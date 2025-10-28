
[t] De Vanilla a React
En los inicios del desarrollo web, las páginas se construían con HTML, CSS y JavaScript puro (VanillaJS). Cada interacción o cambio visual debía manejarse manualmente con funciones que modificaban el DOM, lo que hacía que las aplicaciones crecientes fueran difíciles de mantener. Con el tiempo surgieron librerías y frameworks que ayudaron a estructurar el código, pero la gran revolución llegó con React, una biblioteca creada por Facebook que propuso un modelo declarativo basado en componentes reutilizables y un DOM virtual que mejora el rendimiento y la claridad del código.
[st] DOM
El DOM (Document Object Model) es una representación en memoria de la estructura de una página web, donde cada elemento del HTML —como etiquetas, atributos y texto— se organiza en forma de árbol de nodos. Gracias al DOM, los lenguajes de programación como JavaScript pueden acceder, modificar o eliminar elementos de la página de manera dinámica. 
[i] https://media.geeksforgeeks.org/wp-content/uploads/20241120143259875787/DOM-Tree1.webp
`Créditos` Geek for geeks
En otras palabras, el DOM actúa como un puente entre el código HTML estático y el comportamiento interactivo que vemos en el navegador, permitiendo que los sitios web respondan a eventos, animaciones o cambios de datos sin necesidad de recargar toda la página.
[st] Node.js
Node.js es un runtime de JavaScript basado en el motor V8 de Chrome, que permite ejecutar código JavaScript fuera del navegador. Esto abrió la puerta al desarrollo de herramientas y servidores escritos en JS. En el entorno del front-end, Node se usa para ejecutar utilidades como `npm`, `Vite` o `Webpack`, que gestionan dependencias, transpilan código moderno (JSX, ES6) y empaquetan la aplicación para producción.
[st] Proceso de desarrollo
Hoy en día, cuando trabajamos con React, el flujo de desarrollo pasa por Node y un bundler (como Vite o Webpack). 
Durante el desarrollo, estos herramientas levantan un servidor local que interpreta JSX y módulos ES modernos en tiempo real, ofreciendo recarga instantánea. 
Al momento del build, todo el código fuente —componentes, estilos y recursos— se transforma y empaqueta en archivos estáticos optimizados: un index.html, un main.js y un main.css, listos para ser desplegados en cualquier servidor web. De esta forma, React se comporta como una aplicación web tradicional en producción, pero con toda la potencia modular y reactiva del desarrollo moderno.

[i] https://www.campusmvp.es/recursos/image.axd?picture=/2017/4T/Webpack-Concepto.gif
`Créditos` Campus MVP.es
[st] Vite
Vite (del francés “rápido”, pronunciado /vit/ como `veet`) es una herramienta de construcción (build tool) que busca ofrecer una experiencia de desarrollo más veloz y ligera para proyectos web modernos. Se compone de dos partes principales: 
Un servidor de desarrollo que aprovecha los módulos ES nativos del navegador e incorpora funciones avanzadas como el Hot Module Replacement (HMR) para recargar cambios al instante, y un comando de compilación que utiliza Rollup para generar recursos estáticos altamente optimizados para producción. 
Vite ofrece configuraciones predeterminadas bien pensadas, pero también es extensible mediante plugins y puede adaptarse fácilmente a distintos frameworks o necesidades específicas de un proyecto.
[st] ECMAScript
ECMAScript es el estándar que define cómo debe funcionar el lenguaje JavaScript. Fue creado por la organización ECMA International para garantizar que todas las implementaciones de JavaScript siguieran un conjunto común de reglas y características. Cada versión del estándar (ES3, ES5, ES6, etc.) introduce nuevas funcionalidades del lenguaje, como clases, promesas o módulos, asegurando compatibilidad y evolución coordinada entre navegadores y entornos.
[st] ES Modules
Los ES Modules (ECMAScript Modules), introducidos oficialmente en ES6 (2015), permiten dividir el código JavaScript en archivos reutilizables e independientes, usando las palabras clave `import` y `export`. Antes de su aparición, los desarrolladores dependían de sistemas externos como CommonJS (en Node.js) o RequireJS (en el navegador) para gestionar dependencias. Con los ES Modules, el lenguaje incorporó de forma nativa un sistema de modularización eficiente, seguro y compatible con los navegadores modernos, facilitando la organización y mantenimiento de aplicaciones grandes.