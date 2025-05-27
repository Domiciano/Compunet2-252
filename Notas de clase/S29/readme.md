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
// App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Items from './Items'
import { Container } from '@mui/material'
import NotificationBanner from './components/NotificationBanner'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth="sm">
        <NotificationBanner />
        <Items />
      </Container>
    </QueryClientProvider>
  )
}
```

# Ejemplo de GET

Con el cliente se pueden hacer cosas como las siguientes

```jsx
// Items.jsx
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material'
import NewItemForm from './NewItemForm'

export default function Items() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: () => axios.get('https://api.example.com/items').then(res => res.data),
  })

  if (isLoading) return <CircularProgress />
  if (error) return <Alert severity="error">Error al cargar</Alert>

  return (
    <>
      <List>
        {data.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </>
  )
}
```

