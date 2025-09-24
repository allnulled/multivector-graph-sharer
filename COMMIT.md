# Último commit:

# 07-06-2025 13:14pm:

[x] Bueno, muchas cositas sueltas. No sabría ahora dar una lista.

# 20-05-2025 02:45am

[x] Panel de binarios
  [x] basado en fs
    [x] para escribir mejor
  [x] que permita categorías
  [x] que permita búsqueda rápida
  [x] que permita clickar
[x] El botón de la cámara
  [x] que guarde los resultados con la fecha
  [x] en un fichero de la bd
[x] panel para explorar fotos anteriores
[x] carpeta de TODOs especial
  [x] que se visualice directamente en el despues
[x] reincorporado y mejorado console-hooker
[x] bug de chivato de goals viewer
[x] mejorado process-viewer
  [x] mejor botón que links
  [x] botón para cerrar proceso sin entrar
[x] mejorado goals viewer
  [x] numeritos
  [x] coloritos
  [x] dibujitos
  [x] barritas
  [x] vistas para grupos
  [x] simbolitos eficientes
  [x] itera con el día del calendario


# 19-05-2025 10:18am

[x] Mejorar flujo de copia de seguridad
[x] Reconstruido goals-viewer
[x] Poner botón para abrir rutiner.md en el diálogo del rutiner.


# 19-05-2025 00:36am

[x] Goals viewer
  [x] con su bars-graph
    [x] que funciona siempre con porcentajes
    [x] que permite reflejar varias propiedades por row
    [x] que permite cambiar de vista según propiedad concreta
    [x] que asigna color según valor y polaridad
      [x] que la polaridad sea una propiedad factible
  [x] con su bars-graph-bar
[x] diálogos en vez de forms embedidos en agenda para new y edit accion


# 17-05-2025 10:59am

[ ] Widget de lsw-goals-viewer
  [ ] son funciones js
  [ ] que se recogen de un directorio
    [ ] /kernel/settings/goals/*.js
  [ ] pueden especificar:
    [ ] urgencia: para ponerse arriba o abajo por sí solo
    [ ] titulo: nombre del objetivo
    [ ] mensaje: mensaje informativo del estado actual
    [ ] métricas: datos implicados en el objetivo y sus estados
      [ ] con algo con porcentaje
      [ ] con algo con color (color control)
      [ ] que sirva para pintar barras de colores
    [ ] intervalo
  [ ] dar botón de conductometría también
  [ ] incrustarlo en tareas posteriores
[ ] Formularios de nuevas instancias:
  [ ] que ahora están embedidos
  [ ] pasarlos a diálogos todos

# 16-05-2025 15:34pm

[x] Desbloquear la importación de JSON para base de datos
[x] Recompilar la aplicación móvil
[x] Cambiar el link

# 15-05-2025 17:47pm - 03:39am

[x] deduplicar título lsw-database
[x] soporte para configuraciones en /kernel/settings/user.env:
  [x] app.username
  [x] app.clock_message
[x] botón de soporte para compilar md a html
  [x] que cargue por lazy-loading
[x] botón de soporte para compilar pegjs a js
  [x] que cargue por lazy-loading PEGjs
[x] meter highlight.js (por lazy-loading) en:
  [x] js
  [x] css
  [x] html
[x] embellecedor de código (por lazy-loading) en:
  [x] js
  [x] css
  [x] html
[x] botón de descargar fichero
[ ] meter en impresora el fabricar pdf (aunque sea en imagen solo de momento)

# 14-05-2025 12:51pm

[x] Se carga automáticamente /kernel/componentes (lifecycle, onLoadComponents)
  [x] usando el .html, .js y .css

# 12-05-2025 21:55pm

[x] botón para visualizar en txt: 🔤
  [x] en libros
  [x] en artículos
  [x] en ítems de la base de datos (cualquier json)
  [x] en tablas (con un estado concreto) de la base de datos (también json)

# 09-05-2025 12:57am

[x] Protolang (el parser): lenguaje para:
  [x] subir conceptos
  [x] subir prototipos de propagador
  [x] relacionar conceptos y propagadores
[x] sentencia inc
[x] botón gráficas
  [x] botón virtualizar
  [x] carpetas:
    [x] /kernel/agenda/proto/boot.proto
    [x] /kernel/agenda/report/*.js
[x] proceso en lsw-conductometria.api.js:
  [x] borrar:
    [x] propagadores de concepto
    [x] propagadores prototipo
    [x] acciones virtuales
  [x] iterar acciones reales
    [x] ir ejecutando propagadores
      [x] con multiplicador ya automático funcionando
    [x] ir inflando acciones virtuales
    [x] ir propagando recursivamente acciones virtuales
[x] reportes de conductometria
  [x] acepta para dialog+table
  [x] acepta para dialog+template
[x] mejorar lsw-table para que sea más ligera

# 06-05-2025 18:59pm - ?

[x] Mantenimiento de bugs

# 05-05-2025 01:30am - 06-05-2025 18:59pm

[x] Fondos de pantalla configurables en:
  [x] /kernel/settings/background.env
[x] Normalizados otra vez los estilos de titulos con hX de html
[x] Eslóganes que también se ponga desde un fichero.
[x] Reelegir los botones iniciales
[x] Hacer la parte de wiki de:
  [x] Buscador de artículos
    [x] Que permita buscar entre artículos
    [x] Que permita ir al artículo y modificarlo
  [x] Explorador de libros
    [x] Que vengan del fs
    [x] De una carpeta
    [x] Con ficheros .tri
      [x] Donde se concatenan los artículos
      [x] Lo que habría que hacer en verdad es:
        [x] Lenguaje para construir árboles
        [x] Cada libro sería un árbol de artículos
        [x] En cada nodo:
          [x] un nombre del nodo
          [x] un artículo asociable al nodo
[x] Enciclopedia:
  [x] Tener un lenguaje para parsear árboles
    [x] lsw-tree-parser
  [x] Tener los componentes de las pantallas
    [x] De libros
      [x] Con botón de editar libros (diálogo)
      [x] Con botón de editar libro (diálogo)
      [x] Que puedas expandir el artículo
      [x] Con botón de editar artículo (diálogo)
    [x] De categorías
      [x] Prácticamente lo mismo que libros
    [x] De artículos
      [x] Un buscador de texto rápido
[x] Añadidas algunas opciones en configuraciones » preferencias de usuario
  [x] Para fondos, rutiner, etc.

----

# 04-05-2025 11:01am.

[x] Corregido bug de al eliminar row desde el diálogo de «Actualizar nota»
[x] Corregido bug de al actualizar row desde el diálogo de «Actualizar nota»
[x] Corregido bug que al expandir 1 row (en vista de tablas), expande todos
  [x] Le faltaba el id en los rows para que funcionara la feature por defecto de lsw-table
[x] Normalizados estilos de interfaz configuraciones de base de datos
[x] Botones para guardar/cargar backups:
  [x] Botones incorporados
    [x] Guardar estado
    [x] Cargar copia
    [x] Ver copia
  [x] Botones funcionando
[x] Notas del spontaneous-table:
  [x] Quitado que ponga 3 puntos al final si no llega al límite
  [x] Permiten togglear tag de parámetros de autogenerada
    [x] clicando a la mano o al robot
  [x] Se ordenan según:
    [x] urgency-first con tiene_estado de urgencia
    [x] posteriority-fist con tiene_fecha
    [x] permite alterar la fecha para ponerla encima
    [x] muestra las 3 primeras letras del estado (si tiene)
  [x] Mejorados estilos del editor
    [x] Botones de incremease/decrease fontsize
    [x] Botón de alternar tipo de fuente
[ ] Intruder
  [x] Para irse quedando con el Rutiner
    [x] Que sea dinámico, a partir de un fichero .env
  [ ] Para irse quedando con el Tracker
    [ ] Este no de momento.


----

# 29-04-2025 13:45pm.

[x] Ampliado los ítems por defecto en cada página del componente `lsw-table`
[x] Acabado bien el ciclo de actualizar tarea del componente `lsw-agenda-acciones-viewer`
  [x] afecta a la agenda
  [x] afecta a la vista de tareas anteriores
  [x] afecta a la vista de tareas posteriores
[x] De este artefacto, también cambiamos la funcionalidad y los colores de las barras de acción
  [x] el color del estado se pondrá en la hora
  [x] el color del concepto se pondrá más blanco seguramente.
  [x] el click para avanzar estado se hará en la hora
  [x] el click para desplegar detalles de tarea se hará en el nombre
    [x] le metemos markdown en los campos clave
      [x] tiene_comentarios
      [x] tiene_parametros
      [x] tiene_resultados
[x] Vamos a quitar los botones de paneles que no funcionan
  [x] Los buscadores físicos y virtuales que no tiran
    [x] Buscar por propagador
    [x] Buscar por impresion
    [x] Buscar por limite
    [x] Buscar por tablas virtuales
[x] El label de duration-control estaba fallando por el skipLabel.
[x] El lsw-table también, mejorado:
  [x] mejor distribución de botones
  [x] ampliada la opción de searcher rápido de texto
  [x] espacios laterales para scrol de móvil
  [x] redimensionamiento vertical con scrol accesible para todos
    [x] pc solo por abajo, so 200px de height inicial + resizable
[x] El lsw-schema-based-form le hemos sacado los plegadores/desplegadores al final.
[x] El picker de horas del calendario había que mejorarlo, no sé, a ver
[x] Mejorado el calendario y botones
[x] Agregamos paginador al lsw-table
[x] Tabla con paginación completa
[x] Modificada duración en tasks_viewer
[x] El flujo de new y update en la database-ui
  [x] Crea el concepto pero no redirecciona al formulario de ese row
