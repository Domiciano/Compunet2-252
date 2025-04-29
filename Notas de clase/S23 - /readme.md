# Front


Uso del elemento en HTML

```html
<body>
  ...
  <script type="module" src="./main.js"></script>
</body>
```

o

```html
<head>
  <script type="module" src="./main.js" defer></script>
</head>
```


# Repasito de JS


### `var`

Permite redeclaración.

```js
var mensaje = "Hola";
var mensaje = "Hola otra vez"; // válido
console.log(mensaje); // "Hola otra vez"
```

Además tiene alcance de función

```js
function ejemploIf() {
  if (true) {
    var mensaje = "Hola desde el if";
    console.log(mensaje); // "Hola desde el if"
  }
  console.log(mensaje); // Accesible: "Hola desde el if"
}

ejemploIf();
```

### `let`

No permite redeclaración

```js
let nombre = "Ana";
// let nombre = "Laura"; // Error: ya declarado
nombre = "Laura"; // Permitido
console.log(nombre); // "Laura"
```

Además tiene alcance en el contexto `{}` donde fue declarado

```js
function ejemploIfConLet() {
  if (true) {
    let mensaje = "Hola desde el if";
    console.log("Dentro del if:", mensaje); // "Hola desde el if"
  }
  console.log("Fuera del if:", mensaje); // Error: mensaje is not defined
}

ejemploIfConLet();
```


### `const`

Es igual que `let` pero no permite reasignación

```js
const PI = 3.1416;
// PI = 3.15; // Error: no se puede cambiar
console.log(PI);
```

### Primitivos de datos

```js
let texto = "Hola mundo";       // string
let edad = 25;                  // number
let activo = true;              // boolean
let vacio = null;               // null (intencionalmente vacío)
let indefinido;                 // undefined (sin valor asignado)

console.log(typeof texto);      // string
console.log(typeof edad);       // number
console.log(typeof activo);     // boolean
console.log(typeof vacio);      // object (quirk de JS)
console.log(typeof indefinido); // undefined
```

### Objetos

```js
const persona = {
  nombre: "Carlos",
  edad: 30,
  activo: true
};

console.log(persona.nombre); // "Carlos"
console.log(persona["edad"]); // 30

persona.edad = 31;
console.log(persona.edad); // 31
```

### Arreglos

```js
const frutas = ["manzana", "pera", "uva"];

console.log(frutas[0]); // "manzana"
frutas.push("banano");  // agregar
console.log(frutas.length); // 4

frutas[1] = "kiwi";
console.log(frutas); // ["manzana", "kiwi", "uva", "banano"]
```

### Desestructuración de Objetos

```js
const usuario = {
  nombre: "Lucía",
  correo: "lucia@example.com",
  rol: "admin"
};

// Extraer propiedades en variables
const { nombre, rol } = usuario;

console.log(nombre); // "Lucía"
console.log(rol);    // "admin"
```


### Funciones

```js
function saludar(nombre) {
  return "Hola, " + nombre + "!";
}

console.log(saludar("Ana")); // "Hola, Ana!"
```


```js
const despedir = function(nombre) {
  return "Adiós, " + nombre + "!";
};

console.log(despedir("Luis")); // "Adiós, Luis!"
```

```js
const multiplicar = (a, b) => {
  return a * b;
};

console.log(multiplicar(4, 5)); // 20
```

### Desestructuración y funciones

```js
const mostrarUsuario = ({ nombre, correo }) => {
  console.log("Nombre:", nombre);
  console.log("Correo:", correo);
};

mostrarUsuario({
  nombre: "María",
  correo: "maria@example.com",
  rol: "admin"
});
// Salida:
// Nombre: María
// Correo: maria@example.com
```


# Componentes

Un **componente** en desarrollo web es una unidad modular y reutilizable que encapsula tanto la estructura (HTML), el comportamiento (JavaScript) y, a veces, el estilo (CSS) de una parte específica de la interfaz o funcionalidad de una aplicación. Su propósito es dividir una aplicación en piezas independientes, cada una con una responsabilidad clara, que pueden combinarse y reutilizarse para construir interfaces complejas de forma organizada y mantenible. Aunque los componentes son nativos en frameworks como React o Vue, en JavaScript puro pueden implementarse mediante funciones, clases o Web Components que gestionan su propio contenido y lógica.

*Los componentes son como piezas de Lego: unidades independientes con forma y función definidas que pueden ensamblarse entre sí para construir interfaces complejas de manera flexible y reutilizable.*


Podemos crear nuestro primer componente de `Card` para representar cualquier objeto de nuestro Rest API.

```js
export function Card({ title, content, buttonText}) {
  const card = document.createElement('div'); //<div></div>
  card.className = 'card'; //<div class="card"></div>

  const cardTitle = document.createElement('h2'); //<h2></h2>
  cardTitle.className = 'card-title'; //<h2 class="card-title"></h2>
  cardTitle.textContent = title;
  card.appendChild(cardTitle); //<div class="card"><h2 class="card-title"></h2></div>

  const cardContent = document.createElement('p'); //<p></p>
  cardContent.className = 'card-content'; //<p class="card-content"></p>
  cardContent.textContent = content;
  card.appendChild(cardContent); //<div class="card"><h2 class="card-title"></h2><p class="card-content"></p></div>

  const button = document.createElement('button'); //<button></button>
  button.className = 'card-button'; //<button class="card-button"></button>
  button.textContent = buttonText;
  card.appendChild(button); //<div class="card"><h2 class="card-title"></h2><p class="card-content"></p><button class="card-button"></button></div>

  // Devolver la tarjeta completa
  return card;
}
```

Podemos crear un componente `CardList` que encapsula a su vez lógica

```js
export function CardList(cards) {
  const cardListElement = document.createElement('div');
  cardListElement.className = 'card-list';

  cards.forEach(cardData => {
    const card = Card({
      title: cardData.title,       
      content: cardData.content,   
      buttonText: cardData.buttonText 
    });

    cardListElement.appendChild(card);
  });

  // Retornar el elemento con la lista completa de tarjetas
  return cardListElement;
}
```


Ahora puede generar una arreglo de elementos y usar el componente de lista de cards

```js
import axios from 'axios';
import { CardList } from './components.js';

const cardsData = [
  { title:"Alfa", content: 'Card 1: Primera tarjeta', buttonText: 'Eliminar'},
  { title:"Beta", content: 'Card 2: Segunda tarjeta', buttonText: 'Eliminar'},
  { title:"Gamma", content: 'Card 3: Tercera tarjeta', buttonText: 'Eliminar'},
];

const cardList = CardList(cardsData);
document.body.appendChild(cardList);
```


# Creando un proyecto de Node

Para empezar puede usar el comando


```sh
npm init
```


Que iniciará un proyecto de node.

Adicione el archivo `.gitignore`

```gitignore
node_modules/
```

Instalemos la librería ahora de axios que nos permitirá hacer HTTP Request

```sh
npm install axios
```


Vamos a ejecutar esto usando Node.JS y no el Navegador. Para eso vamos a crear `script.js`

```js
const axios = require('axios');

const URL = 'https://pokeapi.co/api/v2/pokemon/15';

axios.get(URL)
  .then(response => {
    console.log('Datos recibidos:');
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error al hacer la solicitud:', error.message);
  });
```

Puede usar `node script.js`


# Modulos

CommonJS es el sistema de módulos tradicional de Node.js. Utiliza require() para importar y module.exports o exports para exportar módulos. Es sincrónico y se usa principalmente en aplicaciones del lado del servidor.

```js
// CommonJS

module.exports.suma = function(a, b) {
  return a + b;
};

...

const { suma } = require('./math');
console.log(suma(2, 3)); // 5
```

ES Modules (ESM) es el sistema oficial en ECMAScript, utilizando import y export. Es asincrónico, lo que facilita la carga de módulos en el navegador y otros entornos modernos como Node.js.

```js
export function suma(a, b) {
  return a + b;
}

...

import { suma } from './math.js';
console.log(suma(2, 3)); // 5
```




# Webpack

Webpack es una herramienta que nos permite **empaquetar una aplicación web** a partir de módulos escritos con `import/export`, integrando librerías instaladas desde NPM y funcionalidades de Node.js, para que todo funcione correctamente en el navegador. Gracias a Webpack, podemos construir una app moderna con dependencias externas sin preocuparnos por la compatibilidad del navegador, ya que genera un **bundle final optimizado** con todo lo necesario para que nuestra aplicación funcione.

<p align="center">
    <img src="https://programaenlinea.net/wp-content/uploads/2019/02/webpack-1.png" width="512">
</p>


Clonemos este repositorio que es una aplicación constrida con el *bundler* webpack.

```
https://github.com/Domiciano/WPExample
```


# Reto

Use esta API

```
https://pokeapi.co/api/v2/pokemon?limit=10&offset=0
```

Listará los primeros 10 pokemon. *Atrápalos a todos* los 10 de esa lista en tarjetas y muestra su nombre y su imagen. Note que cada objeto de este ejemplo tiene la estructura

```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=10&limit=10",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    }
   ]
}
```

Es decir que en el arreglo de `result` encontrará al pokemon y su nombre. Además tendrá una URL que al consultarla podrá acceder a un objeto con estos valores en su estructura

```json
{
    
    "name": "bulbasaur",
    
    "sprites": {
        "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
        
    }
    
}
```

Su reto es entonces secuenciar las consultas para lograr generar un componente `PokemonCard`.


