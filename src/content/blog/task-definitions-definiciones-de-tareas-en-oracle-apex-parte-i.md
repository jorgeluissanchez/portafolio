---
titulo: "Task Definitions (definiciones de tareas) en Oracle APEX: Parte I"
extracto: "Implementar Task Definitions en Oracle APEX: plazos, responsables, parámetros y acciones automatizadas para tareas de aprobación."
categoria: "Oracle APEX"
fecha: "2025-02-17"
minutos: 17
demo: "tarea-apex"
cierre: {"titulo": "¿Tus aprobaciones siguen viviendo en un correo?", "texto": "Aquí has visto la Parte I: crear la definición, los plazos y el responsable. Si en tu empresa aprobar algo todavía es reenviar un adjunto, te lo llevo a Task Definitions.", "accionEtiqueta": "Cuéntame tu caso"}
---

## 1. Introducción

La funcionalidad **Task Definition** fue introducida en la versión 22.1 de Oracle APEX. Permite definir tareas que son iniciadas por un usuario y aprobadas o rechazadas por otro. En esta guía aprenderás a crear una tarea y a implementarla en tus aplicaciones.

## 2. Crea una aplicación en tu Workspace

Antes de crear un **Task Definition**, primero crearemos una aplicación en nuestro espacio de trabajo de Oracle APEX.

Una vez creada la aplicación **Blog - Task Definition**, accede a **Shared Components**. Seguidamente, entra en **Workflows and Automations** y selecciona **Task Definitions** para crear y administrar tus tareas. Después, pulsa **Create** para iniciar la creación de una tarea nueva.

Para crear la tarea debemos completar los campos correspondientes. En este caso, la tarea se llamará **Blog Task**.

**Type** se refiere al tipo de tarea. Oracle APEX ofrece dos:

- Una **Approval Task** permite aprobar, rechazar o delegar la tarea.
- Una **Action Task** requiere ejecutar una acción específica, como subir un archivo, lo cual la marca como completada.

**Subject** define el tema o descripción de la tarea cuando se crea. Por ejemplo: *"Aumentar el sueldo del empleado &EMPLOYEE_NAME de &OLD_SALARY a &NEW_SALARY"*. Si se crea una tarea para aumentar el sueldo de José de 1000 a 2000, el mensaje sería *"Aumentar el sueldo del empleado José de 1000 a 2000"*.

**Priority** establece la prioridad, donde **1** es alta y **5** es baja. Es útil para que los participantes gestionen sus tareas según la importancia.

**Potential Owner** y **Business Administrator** son roles con distintos niveles de privilegio:

- **Potential Owner**: usuario o grupo autorizado para reclamar y completar la tarea. Una vez reclamada, otros Potential Owners no podrán gestionarla.
- **Business Administrator**: usuario o grupo con permisos avanzados para gestionar tareas aunque no sean propietarios. Pueden reasignarlas, modificar estados o intervenir para asegurar su cumplimiento.

Conviene asignar al menos un usuario a alguno de estos roles. **Name** y **Subject** son obligatorios; **Potential Owner** y **Business Administrator** son opcionales.

En la pestaña **Settings** se muestra el tipo de tarea seleccionado durante su creación. El campo **Type** no se puede modificar después de crearla.

La opción **Initiator Can Complete**, si está activada, permite que el usuario que inició la tarea también pueda aprobarla o rechazarla.

Otro campo opcional es **Task Details Page Number**, que permite generar una página específica para la tarea.

Si te preguntas qué representan `&EMPLOYEE_NAME`, `&OLD_SALARY` o `&NEW_SALARY`: son valores dinámicos provenientes de columnas de una consulta SQL. Para usarlos hay que seleccionar la opción **SQL Query** o **Table**. También pueden ser parámetros definidos dentro de la tarea.

## 3. Especifica el plazo de tu tarea

En un **Task Definition** es posible establecer un plazo de vencimiento. Al crearla, el campo **Due On Type** se configura por defecto en **None**, lo que indica que la tarea no tiene límite de tiempo: permanecerá activa indefinidamente hasta ser aprobada o rechazada.

Para garantizar que las tareas se gestionen a tiempo, conviene asignar un plazo acorde a la prioridad y al flujo de trabajo.

La opción **Interval** usa el formato ISO 8601. Por ejemplo, `PT12H` significa que la tarea vencerá después de 12 horas. También se puede definir el vencimiento con **SQL Query**, **Function Body**, **Expression** y **Scheduler Expression**.

En cuanto a la **Expiration Policy**, su valor predeterminado es **None**, pero puede cambiarse a **Expire** o **Renew**. Con **Expire**, la tarea entra en estado de vencimiento una vez pasado el plazo. Con **Renew**, se configura cuántas veces puede renovarse antes de vencer.

<demo-tarea-apex></demo-tarea-apex>

## 4. Asignación de responsables

Para que una tarea sea efectiva es esencial asignar participantes que puedan iniciarla, reclamarla, aprobarla o rechazarla, según los roles establecidos:

- **Potential Owner**: usuarios o grupos que pueden reclamar y completar la tarea. Sólo quien la haya reclamado podrá cambiar su estado, así que conviene asignar a las personas adecuadas para evitar confusiones.
- **Business Administrator**: usuarios con privilegios más elevados que pueden intervenir aunque no sean propietarios. Pueden reasignar tareas, modificar su estado y supervisar que el proceso se cumpla.

Además, podemos especificar qué usuarios participan usando el campo **Value Type**:

1. **Static**: asigna un participante concreto escribiendo su nombre directamente.
2. **SQL Query**: consulta una tabla de usuarios para obtener uno o varios participantes dinámicamente, por rol o por criterios.
3. **Function Body**: llama a una función que devuelve un usuario o grupo. Debe estar definida en la base de datos.
4. **Expression**: define una expresión lógica para asignar participantes, por ejemplo según si el usuario actual es `USER_TWO`.

## 5. Agrega parámetros

Es posible añadir **parámetros** para personalizar la información que se usa en el **Subject** o en las acciones asociadas. Los parámetros son un mecanismo flexible para pasar valores dinámicos que cambian según el contexto de cada tarea.

Por ejemplo, para personalizar el mensaje del **Subject** puedes usar `&EMPLOYEE_NAME` o `&SALARY_INCREASE` y reflejar valores específicos en cada instancia.

Los parámetros en Task Definitions son de tipo **String** y deben definirse con un **Static ID** único para poder referenciarlos de forma consistente. Además del Static ID hay tres configuraciones por parámetro:

1. **Requerido**: el parámetro debe completarse antes de que la tarea pueda avanzar.
2. **Visible**: el parámetro será visible para los usuarios cuando interactúen con la tarea.
3. **Actualizable**: el valor puede ser modificado por los usuarios durante el flujo.

## 6. Configuración de acciones en la tarea

Las **acciones** son operaciones que se ejecutan en respuesta a eventos que ocurren durante el flujo de trabajo. Permiten automatizar tareas y hacer el proceso más eficiente: enviar una notificación, actualizar un campo o asignar una nueva tarea.

Cada tarea puede tener múltiples acciones, que se ejecutan en el orden definido por el **Execution Sequence**. Organizarlas correctamente es importante, porque el orden influye directamente en el flujo.

**Acción INCREMENT_SALARY.** En el campo **Type** seleccionamos el tipo de acción. Si elegimos **Execute Code**, podremos ejecutar PL/SQL o consumir un servicio REST según lo que se necesite.

En este ejemplo la acción usa código DML que actualiza el salario del usuario. Conviene señalar que `APEX$TASK_PK` se refiere a la clave primaria de la tarea, que se utiliza en la consulta de la pestaña **Settings**, en el campo **Action SQL Query**, donde se configura la consulta que se ejecutará al activar la acción.

**Notificación por correo.** Si queremos enviar un correo como parte de la acción, elegimos **Send E-Mail**. Se abrirán campos adicionales para el destinatario, el asunto y el cuerpo del mensaje. Podemos aprovechar las plantillas de correo (**Email Template**) para incluir información dinámica —como el nombre del usuario o detalles de la tarea— sin escribir todo el contenido manualmente.
