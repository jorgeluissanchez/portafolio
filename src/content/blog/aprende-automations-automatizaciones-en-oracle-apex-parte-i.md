---
titulo: "Aprende Automations (automatizaciones) en Oracle APEX: Parte I"
extracto: "Cómo automatizar procesos en Oracle APEX con automations y DBMS_SCHEDULER: notificaciones, actualizaciones y tareas programadas."
categoria: "Oracle APEX"
fecha: "2025-02-16"
minutos: 8
demo: "automatizacion-apex"
cierre: {"titulo": "¿Todavía escribes tus jobs a mano?", "texto": "Notificaciones, actualizaciones y procesos por lotes, sin pelearte con DBMS_SCHEDULER. Si tu aplicación arrastra jobs sueltos que nadie recuerda haber creado, los ordenamos.", "accionEtiqueta": "Revisemos tus automations"}
---

## 1. Introducción

Automatización (Automations) en Oracle APEX (versión 20.2) permite automatizar tareas recurrentes como envío de notificaciones, actualización de datos o procesos por lotes, sin necesidad de programar manualmente con **DBMS_SCHEDULER**.

Funciona como una interfaz simplificada y potente para programar acciones automáticas, mejorando la eficiencia y facilitando la gestión de procesos dentro de las aplicaciones.

## 2. Creación de una automatización

Para esta guía es una continuación de **Definición de Tareas en Oracle APEX v24 Parte I**, por lo tanto, utilizaremos la aplicación **Blog - Task Definition**. Una vez que estemos en la aplicación accedemos a **Shared Components** y selecciona **Automations** (Automatización).

Después de hacer clic en **Automations**, selecciona **Create** para iniciar la creación de una automatización nueva.

### 2.1. Explicación detallada de los campos en "Create Automation"

1. **Name**: aquí debes ingresar el nombre de la automatización. Este nombre identifica la tarea automatizada dentro de Oracle APEX. En esta guía el nombre de la tarea es **Blog - Automation**.
2. **Type**: **On Demand** ejecuta la automatización sólo de forma manual o cuando se llama explícitamente mediante el paquete `APEX_AUTOMATION`. **Scheduled** la ejecuta automáticamente según la frecuencia programada en **Execution Schedule**. Si eliges **On Demand**, la opción **Execution Schedule** desaparece porque no se necesita un horario de ejecución.
3. **Actions Initiated On**: con **Query**, las acciones se ejecutan sólo si la consulta SQL definida devuelve resultados, y los datos devueltos pueden usarse dentro de las acciones. Con **Always**, las acciones se ejecutan siempre que la automatización se active, sin depender de ningún resultado.
4. **Execution Schedule** (sólo visible con **Scheduled**): **Every 15 Minutes**, **On the Hour**, **Daily at Midnight** o **Custom**, que permite configurar un horario personalizado mediante expresiones cron o intervalos específicos.

Le damos clic en **Create** para avanzar a la configuración de acciones y condiciones.

## 3. Configura tu automatización

Una vez creada la automatización **Blog - Automation**, accedemos a la pestaña **Name**, donde se presentan tres campos:

- **Name**: nombre de la automatización.
- **Static ID**: identificador único usado para ejecutar la automatización manualmente con `APEX_AUTOMATION.EXECUTE`.
- **Currently Executing**: indica si la automatización se está ejecutando en ese momento.

La configuración de una automatización en Oracle APEX permite definir cómo y cuándo se ejecutarán tareas automáticas dentro de una aplicación. Esta sección proporciona opciones avanzadas para personalizar el comportamiento, estableciendo condiciones de ejecución y gestionando su estado.

### 3.1. Explicación de los campos

| Campo | Descripción |
| --- | --- |
| **Type** | **Scheduled** ejecuta según la frecuencia establecida. **On Demand** sólo se ejecuta al invocarla con `APEX_AUTOMATION.EXECUTE`. |
| **Schedule Expression** | Define horarios repetitivos con la sintaxis de calendario del Database Scheduler. Por ejemplo "cada martes y viernes a las 4:00 p.m." o "el segundo miércoles de cada mes". Se puede escribir a mano o usar el Interval Builder. |
| **Schedule Status** | **Active**: se ejecutará según lo programado. **Disabled**: la programación está desactivada pero puede ejecutarse manualmente. **Error**: se desactivó por un error en la última ejecución. |
| **Actions Initiated On** | **Query** ejecuta una consulta SQL y actúa por cada fila. **PL/SQL Returning Boolean** ejecuta las acciones si el bloque devuelve TRUE. **Always** ejecuta siempre, ideal con horario programado. |

<demo-automatizacion-apex></demo-automatizacion-apex>

## 4. Configuración de acciones en la automatización

Las **acciones** definen las tareas específicas que se ejecutarán cuando se cumplan las condiciones establecidas. Son fundamentales para automatizar procesos como el envío de notificaciones, actualizaciones de datos o la ejecución de procedimientos personalizados.

Después de pulsar **Add Action** aparece la pestaña **Edit Action**:

1. **Name**: nombre de la acción, para identificarla dentro del flujo de trabajo.
2. **Type**: **Execute Code** ejecuta un bloque PL/SQL, **Send E-Mail** envía un correo a los destinatarios especificados y **Send Push Notification** envía una notificación push a un usuario de la aplicación.
3. **Execution Sequence**: determina el orden en el que se ejecutan las acciones.

### 4.1. Manejo de errores en automatizaciones

La pestaña **Error Handling** permite configurar cómo tratar los errores que surjan durante la ejecución. Puedes definir un mensaje que se mostrará en el registro cuando la acción falle. Conviene incluir `#SQLERRM#` en el mensaje: es una variable de sustitución que inserta el error real generado por Oracle.

Además existe **Stop Execution on Error**. Al habilitarla, la ejecución se detiene al encontrar un error procesando la fila actual, de modo que no se ejecutan acciones adicionales — útil para prevenir errores en cascada por una tarea fallida.

### 4.2. Server Side Condition

**Server Side Condition** permite agregar una condición que debe cumplirse antes de que la acción se ejecute en el servidor. Es útil cuando quieres que la acción sólo corra si se cumplen ciertos criterios, como la validación de una variable o el estado de un proceso.

La opción **Do not validate code (parse at runtime only)** hace que el código de la condición no se valide en tiempo de diseño sino en el de ejecución, útil cuando depende de datos que sólo se conocen entonces.

**Execute For Each Row** especifica si la condición se evalúa para cada fila devuelta por la consulta o una sola vez, lo que permite mayor control sobre las acciones según los datos de cada fila.

## 5. Descripción de las vistas en automatización

| Vista | Descripción |
| --- | --- |
| `APEX_APPL_AUTOMATIONS` | Almacena los metadatos de las automatizaciones de una aplicación: nombre, aplicación a la que pertenece, si está activa y su fecha de creación. |
| `APEX_APPL_AUTOMATION_ACTIONS` | Guarda las acciones que se ejecutan dentro de cada automatización. Cada acción pertenece a una automatización específica. |
| `APEX_AUTOMATION_LOG` | Registra las ejecuciones: cuándo ocurrieron, si fueron exitosas o fallaron, y mensajes adicionales. |
| `APEX_AUTOMATION_MSG_LOG` | Almacena los mensajes generados durante una ejecución — información, advertencias o errores — relacionados con un registro de `APEX_AUTOMATION_LOG`. |

## 6. Conclusión

Las **Automations** en Oracle APEX permiten automatizar tareas como el envío de correos, notificaciones push y ejecución de código sin intervención manual. Puedes configurar acciones basadas en horarios, condiciones específicas o datos de consulta.

Con la integración de **APEX_AUTOMATION** y **DBMS_SCHEDULER**, las tareas se ejecutan automáticamente o bajo demanda, ahorrando tiempo y reduciendo errores. Además puedes gestionar el manejo de errores y establecer condiciones para ejecutar acciones sólo cuando se cumplan ciertos criterios.
