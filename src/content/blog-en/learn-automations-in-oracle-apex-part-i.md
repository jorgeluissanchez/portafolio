---
titulo: "Learn Automations in Oracle APEX: Part I"
extracto: "How to automate processes in Oracle APEX with automations and DBMS_SCHEDULER: notifications, updates and scheduled jobs."
categoria: "Oracle APEX"
fecha: "2025-02-16"
minutos: 8
demo: "automatizacion-apex"
es: "aprende-automations-automatizaciones-en-oracle-apex-parte-i"
cierre: {"titulo": "Still writing your jobs by hand?", "texto": "Notifications, updates and batch processes, without fighting DBMS_SCHEDULER. If your application carries loose jobs nobody remembers creating, let's clean them up.", "accionEtiqueta": "Let's review your automations"}
---

## 1. Introduction

Automations in Oracle APEX (since version 20.2) let you automate recurring work such as sending notifications, updating data or running batch processes, without programming **DBMS_SCHEDULER** by hand.

They work as a simple but powerful interface to schedule automatic actions, improving efficiency and making process management inside your applications easier.

## 2. Creating an automation

This guide continues **Task Definitions in Oracle APEX: Part I**, so we'll use the **Blog - Task Definition** application. Once inside the application, go to **Shared Components** and select **Automations**.

After clicking **Automations**, select **Create** to start a new automation.

### 2.1. The fields in "Create Automation", in detail

1. **Name**: the automation's name. It identifies the automated task inside Oracle APEX. In this guide the name is **Blog - Automation**.
2. **Type**: **On Demand** runs the automation only manually or when explicitly called through the `APEX_AUTOMATION` package. **Scheduled** runs it automatically at the frequency set in **Execution Schedule**. If you choose **On Demand**, the **Execution Schedule** option disappears because no schedule is needed.
3. **Actions Initiated On**: with **Query**, actions run only if the defined SQL query returns rows, and the returned data can be used inside the actions. With **Always**, actions run every time the automation fires, regardless of any result.
4. **Execution Schedule** (only visible with **Scheduled**): **Every 15 Minutes**, **On the Hour**, **Daily at Midnight** or **Custom**, which lets you set a custom schedule with cron-like expressions or specific intervals.

Click **Create** to move on to configuring actions and conditions.

## 3. Configure your automation

Once the **Blog - Automation** automation is created, open the **Name** tab, which shows three fields:

- **Name**: the automation's name.
- **Static ID**: a unique identifier used to run the automation manually with `APEX_AUTOMATION.EXECUTE`.
- **Currently Executing**: shows whether the automation is running right now.

Configuring an automation in Oracle APEX defines how and when automatic tasks run inside an application. This section offers advanced options to customize its behavior, set execution conditions and manage its status.

### 3.1. The fields explained

| Field | Description |
| --- | --- |
| **Type** | **Scheduled** runs at the set frequency. **On Demand** only runs when invoked with `APEX_AUTOMATION.EXECUTE`. |
| **Schedule Expression** | Defines repeating schedules with the Database Scheduler calendar syntax. For example "every Tuesday and Friday at 4:00 p.m." or "the second Wednesday of every month". You can type it by hand or use the Interval Builder. |
| **Schedule Status** | **Active**: it will run as scheduled. **Disabled**: scheduling is off but it can still be run manually. **Error**: it was disabled because of an error in the last run. |
| **Actions Initiated On** | **Query** runs a SQL query and acts on each row. **PL/SQL Returning Boolean** runs the actions if the block returns TRUE. **Always** runs every time, ideal with a schedule. |

<demo-automatizacion-apex></demo-automatizacion-apex>

## 4. Setting up actions in the automation

**Actions** define the specific tasks that run when the conditions are met. They're key to automating processes such as sending notifications, updating data or running custom procedures.

After clicking **Add Action**, the **Edit Action** tab appears:

1. **Name**: the action's name, to identify it within the workflow.
2. **Type**: **Execute Code** runs a PL/SQL block, **Send E-Mail** sends an email to the specified recipients and **Send Push Notification** sends a push notification to an application user.
3. **Execution Sequence**: sets the order in which actions run.

### 4.1. Error handling in automations

The **Error Handling** tab lets you configure how to deal with errors during execution. You can define a message that will be written to the log when the action fails. It's a good idea to include `#SQLERRM#` in the message: it's a substitution variable that inserts the actual error raised by Oracle.

There's also **Stop Execution on Error**. When enabled, execution stops as soon as an error occurs while processing the current row, so no further actions run, which helps prevent cascading errors from a failed task.

### 4.2. Server Side Condition

**Server Side Condition** lets you add a condition that must be met before the action runs on the server. It's useful when you want the action to run only if certain criteria are met, such as validating a variable or the status of a process.

The **Do not validate code (parse at runtime only)** option means the condition's code isn't validated at design time but at run time, which is useful when it depends on data only known then.

**Execute For Each Row** specifies whether the condition is evaluated for each row returned by the query or just once, giving you more control over the actions based on each row's data.

## 5. The automation views

| View | Description |
| --- | --- |
| `APEX_APPL_AUTOMATIONS` | Stores the metadata of an application's automations: name, owning application, whether it's active and its creation date. |
| `APEX_APPL_AUTOMATION_ACTIONS` | Stores the actions that run inside each automation. Each action belongs to a specific automation. |
| `APEX_AUTOMATION_LOG` | Logs executions: when they happened, whether they succeeded or failed, and additional messages. |
| `APEX_AUTOMATION_MSG_LOG` | Stores the messages generated during an execution (information, warnings or errors) related to an `APEX_AUTOMATION_LOG` record. |

## 6. Conclusion

**Automations** in Oracle APEX let you automate tasks such as sending emails, push notifications and running code without manual intervention. You can configure actions based on schedules, specific conditions or query data.

With **APEX_AUTOMATION** and **DBMS_SCHEDULER** working together, tasks run automatically or on demand, saving time and reducing errors. You can also manage error handling and set conditions so actions run only when certain criteria are met.
