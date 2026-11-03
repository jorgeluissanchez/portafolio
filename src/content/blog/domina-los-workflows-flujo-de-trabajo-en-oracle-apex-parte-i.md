---
titulo: "Domina los Workflows (flujo de trabajo) en Oracle APEX: Parte I"
extracto: "Crear, configurar y gestionar workflows en Oracle APEX: parámetros, actividades y roles para automatizar procesos empresariales."
categoria: "Oracle APEX"
fecha: "2025-02-20"
minutos: 11
demo: "flujo-apex"
cierre: {"titulo": "¿Cuántos pasos de tu proceso viven fuera del sistema?", "texto": "Parámetros, actividades y roles: con eso se modela casi cualquier proceso en APEX. Si el tuyo todavía se coordina por WhatsApp y hojas de cálculo, lo pasamos al motor de flujos.", "accionEtiqueta": "Hablemos de tu proceso"}
---

## 1. Introducción

Workflow, o flujo de trabajo, es la forma en que se organizan y ejecutan las tareas dentro de un proceso. Permite automatizar actividades y visualizar su progreso en tiempo real.

En este artículo exploramos su importancia y funcionamiento.

## 2. Crea un flujo de trabajo en tu Workspace

Esta guía es una continuación de *Automatización en Oracle APEX v24 - Parte I*, por lo que utilizaremos la aplicación **Blog - Task Automation**. Una vez dentro, accedemos a **Shared Components** y seleccionamos **Workflows**.

Después de hacer clic en **Workflow**, selecciona **Create** para iniciar la creación de un nuevo flujo de trabajo. Una vez creado, debemos asignarle una identificación en los campos **Name** y **Title**. En nuestro caso, es **Blog - WorkFlow**.

### 2.1. Versiones de flujo de trabajo

Una versión de Workflow puede estar en tres estados:

- **En desarrollo**: es editable y sólo se puede ejecutar en la sesión del desarrollador. Sólo puede haber una versión en desarrollo.
- **Activa**: es parcialmente editable y sólo puede haber una. No puede volver a desarrollo.
- **Inactiva**: no se puede usar para nuevas instancias, pero las que están en ejecución continúan hasta completarse. Se pueden eliminar o duplicar.

Cuando se crea un workflow, comienza **en desarrollo**. Al moverlo a **activo**, la versión activa anterior pasa a **inactiva**.

| Sección | Descripción |
| --- | --- |
| **Identification** | **Workflow version** define el nombre de la versión específica. Es importante para diferenciar entre versiones distintas. |
| **Settings** | **State** define el estado actual: *In Development* (editable, sólo en desarrollo), *Active* (ejecutable en producción, sin vuelta atrás) e *Inactive* (no inicia nuevos workflows). |
| **Additional Data** | **Type** define cómo obtener datos adicionales para evaluar variables y condiciones: *Table / View* usa una tabla o vista, *SQL Query* una consulta personalizada. |
| **Advance** | **Debug Level** define el nivel de depuración: *Info* (por defecto), *Warning*, *Error* y *Trace*, el más detallado. |
| **Comments** | Notas visibles sólo en el App Builder. Útiles para documentar el flujo. |

## 3. Parámetros

Un flujo de trabajo puede tener varios parámetros de distintos tipos de datos. Se definen haciendo clic derecho sobre el flujo de trabajo.

| Parámetro | Descripción |
| --- | --- |
| **Identification** | Indica si el parámetro debe proporcionarse siempre al ejecutar el flujo. Si es requerido, debe estar presente para que funcione correctamente. |
| **Label** | El nombre amigable que verá el usuario. Debe ser fácil de entender para quien lo use. |
| **Parameter** | **Data Type** define el tipo esperado: `VARCHAR2`, `TIMESTAMP`, `NUMBER`, `BOOLEAN` o `CLOB`. **Direction** indica cómo se usa: *In* sólo entra, *Out* sólo sale, *In/Out* ambas. **Value** es el valor asignado, dinámico o estático. |
| **Default Value** | El valor que se usa si no se proporciona otro al ejecutar el flujo. Evita errores cuando el parámetro no se establece explícitamente. |
| **Additional Information** | Texto libre sobre el parámetro. Admite sustituciones dinámicas con valores de la aplicación, elementos de página y variables del sistema. |

<demo-flujo-apex></demo-flujo-apex>

## 4. Actividades

Los flujos de trabajo pueden tener varias actividades, como enviar un correo o ejecutar una definición de tarea.

| Actividad | Descripción |
| --- | --- |
| **Workflow Start** | Actividad inicial que arranca el flujo. Se coloca al principio y no puede ser precedida por ninguna otra. |
| **Workflow End** | Marca el final del flujo o de una rama. Cuando se alcanza, no se ejecutan más actividades. |
| **Workflow Switch** | Define ramas condicionales. Según ciertas condiciones, redirige el flujo a diferentes actividades. |
| **Workflow Wait** | Introduce una pausa. Se puede configurar para esperar a que se cumpla una condición o a que pase un tiempo. |
| **Human Task** | Crea una tarea asignada a un usuario para una acción manual. Se vincula a una definición de tarea existente. |
| **Invoke API** | Llama a una API externa para realizar alguna acción. |
| **Invoke Workflow** | Ejecuta otro flujo dentro del mismo aplicativo, permitiendo flujos complejos que dependen de otros. |
| **Execute Code** | Ejecuta SQL o PL/SQL directamente dentro del flujo, para operaciones o cálculos específicos. |
| **Send Email** | Envía un correo como parte del flujo, útil para notificar eventos. |
| **Send Push Notification** | Envía una notificación push a una aplicación o dispositivo móvil asociado. |

### 4.1. Activity Variables

Cada actividad puede manejar **Activity Variables**, valores asociados a la actividad que sirven para:

- Guardar información temporalmente, como el estado de una tarea.
- Pasar datos entre actividades, como el usuario asignado.
- Determinar condiciones en un **Workflow Switch**, definiendo qué camino seguir.

### 4.2. Opciones para crear actividades

Al diseñar un flujo, APEX permite agregar actividades en distintas posiciones del diagrama:

1. **Create Activity Below**: agrega una actividad después de la seleccionada. Se usa para continuar el flujo normal. No se puede usar en **Workflow End**.
2. **Create Activity After**: similar a la anterior, pero coloca la actividad como un paso independiente. Útil cuando una actividad puede derivar en dos caminos.
3. **Create Connection**: conecta actividades entre sí para definir el orden de ejecución. No se puede conectar a **Workflow End**.

#### 4.2.1. Reglas de conexión entre actividades

| Desde → Hacia | ¿Es posible? | Notas |
| --- | --- | --- |
| Workflow Start → Otra actividad | Sí | La actividad de inicio siempre se conecta a otra. |
| Actividad cualquiera → Workflow End | Sí | Marca el final del flujo. |
| Workflow End → Otra actividad | No | No se puede conectar después del End. |
| Workflow Switch → Varias actividades | Sí | Se pueden definir rutas condicionales. |
| Invoke Workflow → Otra actividad | Sí | Se pueden ejecutar workflows secundarios antes de continuar. |
| Send Email → Otra actividad | Sí | Después de una notificación, el flujo puede continuar. |
| Execute Code → Otra actividad | Sí | El flujo continúa después de ejecutar el PL/SQL. |

### 4.3. Roles en workflows y tareas

Los roles determinan qué acciones puede realizar cada usuario dentro de una instancia de flujo de trabajo:

- **Workflow Owners**: pueden iniciar, terminar y reintentar un workflow si ocurre un error.
- **Workflow Administrators**: tienen permisos avanzados para suspender, reanudar y modificar variables de un workflow en ejecución.

### 4.4. Vistas de workflow

Las vistas permiten acceder a información sobre la definición, ejecución y monitoreo de los workflows. Se dividen en vistas de metadatos, que contienen la estructura y configuración, y vistas en tiempo de ejecución, que aportan datos sobre el estado actual.

#### 4.4.1. Workflow Metadata Views

| Vista | Descripción |
| --- | --- |
| `APEX_APPL_WORKFLOWS` | Definiciones de workflows en la aplicación, incluyendo el ID estático. |
| `APEX_APPL_WORKFLOW_VERSIONS` | Versiones de cada definición, para gestionar cambios. |
| `APEX_APPL_WORKFLOW_ACTIVITIES` | Definición de actividades dentro de un workflow. |
| `APEX_APPL_WORKFLOW_TRANSITIONS` | Transiciones entre actividades: cómo se conectan los pasos. |
| `APEX_APPL_WORKFLOW_BRANCHES` | Ramas de decisión en actividades tipo switch. |
| `APEX_APPL_WORKFLOW_VARIABLES` | Variables definidas a nivel de workflow. |
| `APEX_APPL_WORKFLOW_ACT_VARS` | Variables asociadas a actividades específicas. |
| `APEX_APPL_WORKFLOW_PARAMS` | Definición de parámetros usados en workflows. |
| `APEX_APPL_WORKFLOW_PARTICIPANT` | Participantes del workflow: usuarios o roles que pueden interactuar. |
| `APEX_APPL_WORKFLOW_COMP_PARAMS` | Parámetros de componentes usados en el Page Designer. |

#### 4.4.2. Workflow Runtime Views

| Vista | Descripción |
| --- | --- |
| `APEX_WORKFLOWS` | Instancias activas de workflows, con referencia a su definición. |
| `APEX_WORKFLOW_ACTIVITIES` | Instancias de actividades en ejecución. |
| `APEX_WORKFLOW_PARAMETERS` | Valores de parámetros en ejecución, con tipo de datos y formato. |
| `APEX_WORKFLOW_VARIABLES` | Valores de variables usadas en la ejecución. |
| `APEX_WORKFLOW_ACTIVITY_VARS` | Valores de variables dentro de actividades específicas. |
| `APEX_WORKFLOW_PARTICIPANTS` | Usuarios o roles asignados a tareas activas. |
| `APEX_WORKFLOW_AUDIT` | Historial de auditoría, incluyendo cambios y transiciones. |

## 5. Conclusión

Los **Workflows en Oracle APEX** permiten automatizar y estructurar procesos empresariales, facilitando la administración con tareas humanas asignadas a usuarios concretos, transiciones condicionales mediante `Workflow Switch` que permiten caminos dinámicos, y ejecución de código que integra la lógica de negocio dentro del flujo.

Esto mejora la eficiencia operativa y la trazabilidad de los procesos dentro de la organización.
