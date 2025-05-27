# Tanstank

TanStack es un conjunto moderno de bibliotecas open source para aplicaciones web, desarrollado con un enfoque en la gestión eficiente de datos y la construcción de interfaces de usuario altamente reactivas. Incluye herramientas como TanStack Query (antes React Query), TanStack Table, TanStack Router y TanStack Virtual, que ayudan a manejar tareas complejas como el fetching de datos, ruteo, renderizado de tablas y virtualización de listas de manera optimizada. Es muy utilizado en aplicaciones React, aunque muchas de sus herramientas también funcionan con otros frameworks.

El framework maneja los siguientes conceptos

# Store central

Un store central es un objeto que guarda el estado global de la aplicación en un solo lugar.
En vez de tener estados dispersos por muchos componentes, todo se maneja desde un punto centralizado, lo cual facilita el acceso, control y depuración del estado.

En TanStack Query, este store es el QueryClient.
En TanStack Store, lo creás con createStore().

⸻

# Estado reactivo

El estado reactivo significa que cuando el estado cambia, los componentes que lo usan se actualizan automáticamente.
No tenés que decirle a React “vuelva a renderizar”.


# Flujo unidireccional

Un flujo unidireccional quiere decir que los datos siempre viajan en una sola dirección:
Estado > Componente > Evento > Cambio de estado > Vuelta al estado

Esto evita loops y errores confusos.
TanStack mantiene este flujo al actualizar el cache (o el store) y luego reflejar esos cambios en los componentes.

⸻

# Acciones que modifican el estado

Una acción es cualquier operación que cambia el estado, como agregar un ítem, actualizar un dato o mostrar una notificación.
En TanStack, esto puede venir de un mutate(), un setState(), o de un evento como onSuccess.

# Implementación

Instalemos primero las dependencias

```bash
npm install @tanstack/react-query @tanstack/store axios @mui/material @emotion/react @emotion/styled
```


# Query client en el top

Debemos usar como top node a QueryClientProvider, dándole una sóla instancia del cliente a toda la aplicación

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'

function App() {
  
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
        <AppRouter />
    </QueryClientProvider>
  )
}

export default App
```

Cree usted el `AppRouter` con las rutas de su aplicación. Que de momento tendremos `ItemsScreen`


# ItemsScreen

Con el cliente cargado se pueden hacer cosas como las siguientes

```jsx
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ItemsScreen = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: () =>
      axios.get("https://ejemplo.com/lista").then(res=>res.data),
  });

  console.log(data);

  return (
    <>
      <Typography>Alfa</Typography>
    </>
  );
};

export default ItemsScreen;
```

Analice un momento el código y maravíllese al ver `useQuery`.

Este hook recibe un objeto `{}` con 2 parámetros. El nombre con el que se identifica el flujo de datos en este caso `items` y `queryFn` que es la función de donde se obtendrán los datos. A esta función se le debe devolver una `Promise` en lugar del arreglo de datos. Esto es porque internamente Tanstank usará la promesa para el flujo de renderizado.

Allí, `data` serán los datos una vez descargados y usted perfectamente lo puede renderizar como lo hacer con los states usuales.

Renderícelos.

Además `isLoading` y `error` son estados que permiten reflejar en la interfaz el estado de la solicitud. Úselos también
