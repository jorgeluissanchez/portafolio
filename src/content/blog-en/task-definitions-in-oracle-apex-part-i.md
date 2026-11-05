---
titulo: "Task Definitions in Oracle APEX: Part I"
extracto: "How to implement Task Definitions in Oracle APEX: due dates, owners, parameters and automated actions for approval tasks."
categoria: "Oracle APEX"
fecha: "2025-02-17"
minutos: 15
demo: "tarea-apex"
es: "task-definitions-definiciones-de-tareas-en-oracle-apex-parte-i"
cierre: {"titulo": "Do your approvals still live in an email?", "texto": "This was Part I: creating the definition, due dates and owners. If approving something at your company still means forwarding an attachment, I'll move it to Task Definitions for you.", "accionEtiqueta": "Tell me about your case"}
---

## 1. Introduction

**Task Definitions** were introduced in Oracle APEX 22.1. They let you define tasks that one user starts and another user approves or rejects. In this guide you'll learn how to create a task and use it in your applications.

## 2. Create an application in your Workspace

Before creating a **Task Definition**, we'll create an application in our Oracle APEX workspace.

Once the **Blog - Task Definition** application is created, go to **Shared Components**. Then open **Workflows and Automations** and select **Task Definitions** to create and manage your tasks. Next, click **Create** to start a new task.

To create the task, fill in the corresponding fields. In this case, the task will be called **Blog Task**.

**Type** is the kind of task. Oracle APEX offers two:

- An **Approval Task** lets you approve, reject or delegate the task.
- An **Action Task** requires performing a specific action, such as uploading a file, which marks it as completed.

**Subject** defines the task's topic or description when it's created. For example: *"Raise the salary of employee &EMPLOYEE_NAME from &OLD_SALARY to &NEW_SALARY"*. If a task is created to raise José's salary from 1000 to 2000, the message would read *"Raise the salary of employee José from 1000 to 2000"*.

**Priority** sets the priority, where **1** is high and **5** is low. It helps participants manage their tasks by importance.

**Potential Owner** and **Business Administrator** are roles with different privilege levels:

- **Potential Owner**: a user or group authorized to claim and complete the task. Once claimed, other Potential Owners can no longer handle it.
- **Business Administrator**: a user or group with advanced permissions to manage tasks even if they're not the owner. They can reassign tasks, change their status or step in to make sure they get done.

It's a good idea to assign at least one user to one of these roles. **Name** and **Subject** are required; **Potential Owner** and **Business Administrator** are optional.

The **Settings** tab shows the task type selected when it was created. The **Type** field can't be changed afterwards.

The **Initiator Can Complete** option, when enabled, lets the user who started the task also approve or reject it.

Another optional field is **Task Details Page Number**, which generates a dedicated page for the task.

If you're wondering what `&EMPLOYEE_NAME`, `&OLD_SALARY` or `&NEW_SALARY` stand for: they're dynamic values coming from the columns of a SQL query. To use them, select the **SQL Query** or **Table** option. They can also be parameters defined inside the task.

## 3. Set your task's due date

A **Task Definition** can have a due date. When you create it, **Due On Type** defaults to **None**, meaning the task has no time limit: it stays active indefinitely until it's approved or rejected.

To make sure tasks get handled on time, assign a due date that matches the priority and the workflow.

The **Interval** option uses the ISO 8601 format. For example, `PT12H` means the task is due after 12 hours. You can also define the due date with **SQL Query**, **Function Body**, **Expression** and **Scheduler Expression**.

The **Expiration Policy** defaults to **None**, but it can be changed to **Expire** or **Renew**. With **Expire**, the task becomes expired once the due date passes. With **Renew**, you set how many times it can be renewed before it expires.

<demo-tarea-apex></demo-tarea-apex>

## 4. Assigning owners

For a task to be effective, you need participants who can start, claim, approve or reject it, according to the roles defined:

- **Potential Owner**: users or groups who can claim and complete the task. Only whoever claimed it can change its status, so assign the right people to avoid confusion.
- **Business Administrator**: users with higher privileges who can step in even if they're not the owner. They can reassign tasks, change their status and make sure the process is followed.

You can also specify which users take part using the **Value Type** field:

1. **Static**: assigns a specific participant by typing their name directly.
2. **SQL Query**: queries a users table to get one or more participants dynamically, by role or criteria.
3. **Function Body**: calls a function that returns a user or group. It must be defined in the database.
4. **Expression**: defines a logical expression to assign participants, for example depending on whether the current user is `USER_TWO`.

## 5. Add parameters

You can add **parameters** to customize the information used in the **Subject** or in the associated actions. Parameters are a flexible way to pass dynamic values that change with each task's context.

For example, to customize the **Subject** message you can use `&EMPLOYEE_NAME` or `&SALARY_INCREASE` and reflect specific values in each instance.

Task Definition parameters are of type **String** and must be defined with a unique **Static ID** so they can be referenced consistently. Besides the Static ID, each parameter has three settings:

1. **Required**: the parameter must be filled in before the task can move forward.
2. **Visible**: the parameter is shown to users when they interact with the task.
3. **Updatable**: users can change the value during the flow.

## 6. Setting up task actions

**Actions** are operations that run in response to events during the workflow. They let you automate work and make the process more efficient: send a notification, update a field or assign a new task.

Each task can have multiple actions, which run in the order defined by the **Execution Sequence**. Organizing them correctly matters, because the order directly affects the flow.

**INCREMENT_SALARY action.** In the **Type** field we choose the kind of action. If we choose **Execute Code**, we can run PL/SQL or call a REST service, depending on what's needed.

In this example the action uses DML code that updates the user's salary. Note that `APEX$TASK_PK` refers to the task's primary key, which is used in the query on the **Settings** tab, in the **Action SQL Query** field, where you configure the query that runs when the action fires.

**Email notification.** If we want to send an email as part of the action, we choose **Send E-Mail**. Additional fields open for the recipient, subject and body. We can use **Email Templates** to include dynamic information (such as the user's name or task details) without writing all the content by hand.
