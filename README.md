### Proyecto de JavaScript:

# Sistema de Gestión de inventario  



#### :round_pushpin: Descripción General: 

El Sistema de Gestión CRUD es una aplicación web diseñada para administrar y manipular datos a través de operaciones básicas CRUD: Crear, Leer, Actualizar y Eliminar. Esta aplicación proporciona una interfaz de usuario intuitiva que permite a los usuarios interactuar con los datos de forma eficiente y efectiva.

La aplicación está desarrollada utilizando tecnologías web estándar como HTML, CSS y JavaScript, junto con bibliotecas externas para la gestión de eventos, manipulación del DOM y comunicación con el servidor a través de API RESTful.



#### :rocket: Requisitos para el funcionamiento

- Se requiere tener json-server instalado (preferiblemente la versión 0.17.4, ya que esto es más estable)

  ```  
  json-server --watch storage/data/db.json
  
  ```

  

#### :busts_in_silhouette: ​Autoría:

- Sofia Marcela Medina Díaz: [@S0fiaMedina](https://github.com/S0fiaMedina)
- Liliana Paola Castellanos Pinzon: [@lipaocaspi](https://github.com/lipaocaspi)

- **Institución**: CampusLands
- **Revisado por**: [@trainingLeader](https://github.com/trainingLeader)







****





## :pushpin: Información Detallada:

#### Tecnologías usadas:

- HTML
- CSS
- JavaScript
- JSON Server

## :lipstick: ​Diseño

- Metodología BEM para una organización clara de estilos.
- Totalmente responsive, con enfoque "Desktop First".
- Este proyecto utiliza CSS vanilla para estilos, lo que significa que el  CSS se ha escrito directamente en su forma estándar sin el uso de  preprocesadores como Sass o frameworks como Bootstrap.
- El diseño  está modularizado. El archivo  principal de estilos (`main.css`) actúa como punto de  entrada, importando otros archivos de estilos que, en conjunto, definen  los estilos globales para todo el sitio web.



## :sparkles: ​Interactividad



#### Api.js

- **Servicios API**:

  - **1. `getData(endPoint)`**

    - **Descripción:** Este servicio permite realizar una solicitud GET para obtener datos desde un endpoint específico.
  
    - Parámetros:
      - `endPoint`: El endpoint desde el cual se van a obtener los datos.
  
    - Respuesta:
      - Retorna los datos obtenidos desde el endpoint en formato JSON.

      ****

  - **2.** `postData(element, endPoint)`

    - **Descripción:** Este servicio permite realizar una solicitud POST para enviar datos a un endpoint específico.
      - Parámetros:
  
        - `element`: Los datos que se van a enviar al endpoint.
        - `endPoint`: El endpoint al cual se van a enviar los datos.
  
    - Respuesta:
  
      - Retorna la respuesta de la solicitud POST	
  
      ****
  
  - **3. **`getDataId(endPoint, id)`**
  
    - **Descripción:** Esta función realiza una solicitud GET para obtener los datos de un recurso específico identificado por su ID en un endpoint determinado.
      - **Parámetros:**
        - `endPoint`: La URL del endpoint desde donde se obtendrán los datos.
        - `id`: El ID del recurso que se desea obtener.
  
  
    - **Respuesta:**
      
      - Retorna una promesa que se resuelve con los datos del recurso obtenidos del endpoint.
      
      ****
  
  - **4. **`deleteData(endPoint, id)`**
  
    - **Descripción:** Esta función realiza una solicitud DELETE para eliminar un recurso específico identificado por su ID en un endpoint determinado.
  
      - **Parámetros:**
        - `endPoint`: La URL del endpoint desde donde se eliminará el recurso.
        - `id`: El ID del recurso que se desea eliminar.
      - **Respuesta:**
        - Retorna una promesa que se resuelve con la respuesta de la solicitud DELETE.
  
      ****
  
  - **5. **`updateData(endPoint, id, object)`
  
    - **Descripción:** Esta función realiza una solicitud PUT para actualizar un recurso específico identificado por su ID en un endpoint determinado con los datos proporcionados.
      - **Parámetros:**
        - `endPoint`: La URL del endpoint donde se actualizará el recurso.
        - `id`: El ID del recurso que se desea actualizar.
        - `object`: Los nuevos datos que se utilizarán para actualizar el recurso.
  
    - **Respuesta:**
      - Retorna una promesa que se resuelve con la respuesta de la solicitud PUT.



***



#### menu.js

- El archivo crea dinámicamente un menú lateral en una página web  utilizando datos predefinidos. Cada elemento del menú tiene opciones  para agregar, eliminar, editar y buscar datos relacionados con activos,  personas, marcas, etc. El menú se inserta en el DOM para su  visualización y uso en la página web.

  ****

#### dataForm.js

- Este archivo contiene la definición de objetos exportados que se  utilizan para renderizar los inputs y los labels de diferentes tipos de  formularios. Cada objeto contiene información sobre los campos del  formulario, como el ID, la etiqueta y el tipo de entrada. Los tipos de  formularios incluyen activos, personas, marcas, tipos de personas, tipos de movimiento, tipos de activos, estados, teléfonos, movimientos y  asignaciones. Estos objetos exportados se utilizan en otros archivos  para generar dinámicamente los formularios en la interfaz de usuario.

  ****

#### crud.js

- El script importa información de formularios desde otro archivo llamado "dataForm.js" y funciones de API desde un archivo llamado "api.js". Utiliza esta información para generar formularios dinámicamente en la interfaz de usuario y manejar las interacciones del usuario con estos formularios.
- La lógica principal del script se encuentra dentro de un bucle que escucha los clics en elementos de menú. Dependiendo del tipo de acción seleccionada (agregar, editar, eliminar, etc.), el script genera el contenido del formulario correspondiente y maneja las interacciones del usuario, como enviar datos al servidor a través de peticiones HTTP.
- Además de manejar la creación y envío de formularios, el script también incluye lógica para buscar información, mostrar resultados y realizar acciones específicas dependiendo del tipo de elemento y acción seleccionada por el usuario.



## :card_file_box: ​Backend

- El archivo que contiene toda la data es `storage/data/db.json`
- Backend prototipado haciendo uso de [json-server](https://github.com/typicode/json-server).
- Se recomienda encarecidamente usar la version 0.17.4 ya que esta es más estable que la ultima versión.

***

## :hammer_and_wrench: 3. Mantenimiento del Software

### 3.1 Mantenimiento Correctivo
Este proceso se centra en la identificación, diagnóstico y corrección de errores o anomalías que se presenten durante la ejecución de la aplicación.
*   **Corrección de Bugs en UI/UX**: Solución de problemas visuales o de interacción que impidan el uso correcto del sistema de inventarios y carrito de compras (ej. botones que no responden, cálculos incorrectos en el checkout).
*   **Depuración de Lógica de Negocio**: Revisión y ajuste de las funciones en `cart.js`, `checkout.js` y `crud.js` para asegurar que las operaciones CRUD y transaccionales reflejen correctamente el estado del inventario.
*   **Integridad de Datos**: Resolución de inconsistencias en la lectura/escritura del archivo `db.json` gestionado por `json-server`, asegurando que no se pierdan registros durante las peticiones asíncronas.

### 3.2 Mantenimiento Adaptativo
Modificaciones necesarias para mantener la compatibilidad del software con cambios en el entorno tecnológico o requisitos externos.
*   **Compatibilidad de Navegadores**: Pruebas y ajustes de estilos (CSS) y scripts (ES6+) para soportar actualizaciones de motores de renderizado en Chrome, Firefox, Edge y Safari.
*   **Actualización de Librerías y Herramientas**: Migración o actualización de dependencias como `json-server` (actualmente v0.17.4) a versiones más recientes, asegurando que los scripts del `package.json` sigan funcionando.
*   **Nuevas Regulaciones**: Adaptación de los formularios de datos (ej. en `dataForm.js`) para cumplir con nuevas normativas de captura de información o privacidad de datos si fuese requerido.

### 3.3 Mantenimiento Perfectivo
Mejoras enfocadas en elevar la calidad, rendimiento y experiencia de usuario sin alterar la funcionalidad esencial.
*   **Optimización de Rendimiento**: Refactorización de código crítico para reducir el tiempo de carga y mejorar la respuesta de la interfaz (ej. optimizar bucles en `menu.js` o la carga de datos en `api.js`).
*   **Mejoras de Usabilidad**: Implementación de feedback visual más claro (toast notifications, validaciones en tiempo real) y mejoras en la accesibilidad para facilitar la navegación del usuario.
*   **Limpieza de Código**: Eliminación de código comentado o en desuso y estandarización de nombres de variables y funciones para facilitar la lectura por parte de nuevos desarrolladores.

### 3.4 Mantenimiento Preventivo
Acciones proactivas destinadas a mejorar la mantenibilidad y fiabilidad futura del sistema, previniendo fallos antes de que ocurran.
*   **Refactorización Modular**: Reorganización periódica de archivos grandes en módulos más pequeños y cohesivos para reducir la complejidad técnica (Deuda Técnica).
*   **Actualización de Dependencias de Seguridad**: Monitoreo y actualización regular de paquetes npm para mitigar vulnerabilidades conocidas.
*   **Documentación Continua**: Actualización de comentarios en el código y del archivo `README.md` para asegurar que la documentación técnica esté siempre sincronizada con la implementación actual.
