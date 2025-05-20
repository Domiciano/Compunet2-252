# Uso de endpoints autorizados

Se requiere usar el token para usar los elementos. Adicionalmente debe saber cómo cargar datos desde el inicio.


# useEffect

useEffect es un hook de React que permite ejecutar efectos secundarios en componentes funcionales, como llamadas a APIs, suscripciones o manipulación del DOM. Se ejecuta después del renderizado.

```js
useEffect(() => {
  console.log("El componente se montó");
}, []);
```

Si pasa un array vacío ([]), se ejecuta solo una vez al montar.

# Local storage

```js
localStorage.setItem('token', token);
```
