---
titulo: "Master Workflows in Oracle APEX: Part I"
extracto: "Create, configure and manage workflows in Oracle APEX: parameters, activities and roles to automate business processes."
categoria: "Oracle APEX"
fecha: "2025-02-20"
minutos: 11
demo: "flujo-apex"
es: "domina-los-workflows-flujo-de-trabajo-en-oracle-apex-parte-i"
cierre: {"titulo": "How many steps of your process live outside the system?", "texto": "Parameters, activities and roles: with those you can model almost any process in APEX. If yours is still coordinated over WhatsApp and spreadsheets, let's move it to the workflow engine.", "accionEtiqueta": "Let's talk about your process"}
---

## 1. Introduction

A workflow is the way tasks are organized and carried out within a process. It lets you automate activities and see their progress in real time.

In this article we look at why it matters and how it works.

## 2. Create a workflow in your Workspace

This guide continues *Learn Automations in Oracle APEX: Part I*, so we'll use the **Blog - Task Automation** application. Once inside, go to **Shared Components** and select **Workflows**.

After clicking **Workflow**, select **Create** to start a new workflow. Once it's created, give it an identity in the **Name** and **Title** fields. In our case, it's **Blog - WorkFlow**.

### 2.1. Workflow versions

A workflow version can be in three states:

- **In development**: editable and can only run in the developer's session. There can be only one version in development.
- **Active**: partially editable, and there can be only one. It can't go back to development.
- **Inactive**: can't be used for new instances, but running ones continue until they complete. They can be deleted or duplicated.

When a workflow is created, it starts **in development**. When you make it **active**, the previous active version becomes **inactive**.

| Section | Description |
| --- | --- |
| **Identification** | **Workflow version** sets the name of the specific version. It's important to tell different versions apart. |
| **Settings** | **State** sets the current state: *In Development* (editable, development only), *Active* (runs in production, no going back) and *Inactive* (doesn't start new workflows). |
| **Additional Data** | **Type** defines how to get additional data to evaluate variables and conditions: *Table / View* uses a table or view, *SQL Query* a custom query. |
| **Advance** | **Debug Level** sets the debug level: *Info* (default), *Warning*, *Error* and *Trace*, the most detailed. |
| **Comments** | Notes visible only in App Builder. Useful to document the flow. |

## 3. Parameters

A workflow can have several parameters of different data types. You define them by right-clicking the workflow.

| Parameter | Description |
| --- | --- |
| **Identification** | Whether the parameter must always be provided when running the flow. If required, it must be present for the flow to work correctly. |
| **Label** | The friendly name users will see. It should be easy to understand for whoever uses it. |
| **Parameter** | **Data Type** sets the expected type: `VARCHAR2`, `TIMESTAMP`, `NUMBER`, `BOOLEAN` or `CLOB`. **Direction** says how it's used: *In* only comes in, *Out* only goes out, *In/Out* both. **Value** is the assigned value, dynamic or static. |
| **Default Value** | The value used if no other is provided when running the flow. It prevents errors when the parameter isn't set explicitly. |
| **Additional Information** | Free text about the parameter. It supports dynamic substitutions with application values, page items and system variables. |

<demo-flujo-apex></demo-flujo-apex>

## 4. Activities

Workflows can have several activities, such as sending an email or running a task definition.

| Activity | Description |
| --- | --- |
| **Workflow Start** | The initial activity that starts the flow. It goes at the beginning and can't be preceded by any other. |
| **Workflow End** | Marks the end of the flow or of a branch. Once reached, no more activities run. |
| **Workflow Switch** | Defines conditional branches. Based on certain conditions, it routes the flow to different activities. |
| **Workflow Wait** | Introduces a pause. It can wait for a condition to be met or for a period of time to pass. |
| **Human Task** | Creates a task assigned to a user for a manual action. It's linked to an existing task definition. |
| **Invoke API** | Calls an external API to perform an action. |
| **Invoke Workflow** | Runs another workflow in the same application, enabling complex flows that depend on others. |
| **Execute Code** | Runs SQL or PL/SQL directly inside the flow, for specific operations or calculations. |
| **Send Email** | Sends an email as part of the flow, useful to notify events. |
| **Send Push Notification** | Sends a push notification to an associated application or mobile device. |

### 4.1. Activity Variables

Each activity can handle **Activity Variables**, values tied to the activity that are used to:

- Store information temporarily, such as a task's status.
- Pass data between activities, such as the assigned user.
- Drive conditions in a **Workflow Switch**, deciding which path to follow.

### 4.2. Options for creating activities

When designing a flow, APEX lets you add activities at different positions in the diagram:

1. **Create Activity Below**: adds an activity after the selected one. Used to continue the normal flow. It can't be used on **Workflow End**.
2. **Create Activity After**: similar to the previous one, but places the activity as an independent step. Useful when an activity can lead to two paths.
3. **Create Connection**: connects activities to define the execution order. You can't connect from **Workflow End**.

#### 4.2.1. Connection rules between activities

| From → To | Possible? | Notes |
| --- | --- | --- |
| Workflow Start → Another activity | Yes | The start activity always connects to another one. |
| Any activity → Workflow End | Yes | Marks the end of the flow. |
| Workflow End → Another activity | No | Nothing can be connected after End. |
| Workflow Switch → Several activities | Yes | You can define conditional routes. |
| Invoke Workflow → Another activity | Yes | Child workflows can run before continuing. |
| Send Email → Another activity | Yes | After a notification, the flow can continue. |
| Execute Code → Another activity | Yes | The flow continues after the PL/SQL runs. |

### 4.3. Roles in workflows and tasks

Roles determine what each user can do inside a workflow instance:

- **Workflow Owners**: can start, terminate and retry a workflow if an error occurs.
- **Workflow Administrators**: have advanced permissions to suspend, resume and change the variables of a running workflow.

### 4.4. Workflow views

Views give you access to information about workflow definition, execution and monitoring. They're split into metadata views, which contain the structure and configuration, and runtime views, which provide data on the current state.

#### 4.4.1. Workflow Metadata Views

| View | Description |
| --- | --- |
| `APEX_APPL_WORKFLOWS` | Workflow definitions in the application, including the static ID. |
| `APEX_APPL_WORKFLOW_VERSIONS` | Versions of each definition, to manage changes. |
| `APEX_APPL_WORKFLOW_ACTIVITIES` | Definition of the activities inside a workflow. |
| `APEX_APPL_WORKFLOW_TRANSITIONS` | Transitions between activities: how the steps connect. |
| `APEX_APPL_WORKFLOW_BRANCHES` | Decision branches in switch activities. |
| `APEX_APPL_WORKFLOW_VARIABLES` | Variables defined at the workflow level. |
| `APEX_APPL_WORKFLOW_ACT_VARS` | Variables tied to specific activities. |
| `APEX_APPL_WORKFLOW_PARAMS` | Definition of the parameters used in workflows. |
| `APEX_APPL_WORKFLOW_PARTICIPANT` | Workflow participants: users or roles that can interact with it. |
| `APEX_APPL_WORKFLOW_COMP_PARAMS` | Component parameters used in Page Designer. |

#### 4.4.2. Workflow Runtime Views

| View | Description |
| --- | --- |
| `APEX_WORKFLOWS` | Active workflow instances, with a reference to their definition. |
| `APEX_WORKFLOW_ACTIVITIES` | Running activity instances. |
| `APEX_WORKFLOW_PARAMETERS` | Runtime parameter values, with data type and format. |
| `APEX_WORKFLOW_VARIABLES` | Values of the variables used during execution. |
| `APEX_WORKFLOW_ACTIVITY_VARS` | Variable values inside specific activities. |
| `APEX_WORKFLOW_PARTICIPANTS` | Users or roles assigned to active tasks. |
| `APEX_WORKFLOW_AUDIT` | Audit history, including changes and transitions. |

## 5. Conclusion

**Workflows in Oracle APEX** let you automate and structure business processes: human tasks assigned to specific users, conditional transitions through `Workflow Switch` that allow dynamic paths, and code execution that brings business logic into the flow.

That improves operational efficiency and process traceability across the organization.
