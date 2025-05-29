# Tarea de front

### 1. Pantalla principal – Listado de playlists

La pantalla inicial muestra todas las playlists del usuario.
	
Cada playlist se presenta como un componente interactivo (ej. PlaylistCard, ListItem, etc.).

Al hacer clic sobre una playlist, se navega a una nueva pantalla que muestra el contenido (tracks) de dicha playlist.

### 2. Pantalla de tracks de una playlist

Muestra el título de la playlist seleccionada.

Presenta una lista de canciones que pertenecen a esa playlist.

Incluye un botón “Agregar canciones”, que dirige a una pantalla de búsqueda.

También permite eliminar canciones individuales de la playlist.

### 3. Pantalla de búsqueda de canciones (Deezer)

Se muestra un campo de texto para ingresar términos de búsqueda y un botón para ejecutar la búsqueda.

Los resultados de la búsqueda se muestran en una lista.

Esta pantalla es contextual, es decir, está asociada a la playlist desde la que fue abierta. Todas las canciones que se agreguen desde aquí irán directamente a esa playlist.

### 4. Agregar canciones a una playlist

Desde los resultados de búsqueda (proporcionados por la API de Deezer), el usuario puede agregar canciones individuales (tipo track) a la playlist activa.

### 5. Eliminar canciones

Desde la pantalla de tracks de una playlist, el usuario puede eliminar canciones de la lista.

---

### Consideraciones

Crear y eliminar playlists no es necesario implementarlo en esta versión.

Las búsquedas a Deezer deben filtrarse por tipo track para asegurar que los resultados agregables sean canciones válidas.
