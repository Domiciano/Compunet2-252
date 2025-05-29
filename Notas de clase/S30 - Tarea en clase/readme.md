# Tarea de front

Clone este proyecto de RestAPI

```
https://github.com/Domiciano/DeezerAPI
```

En el readme del repositorio encontrará cuáles endpoints tiene

Luego realice los siguientes puntos

### 1. Pantalla principal – Listado de playlists

🎯 La pantalla inicial muestra todas las playlists del usuario.
	
🎯 Cada playlist se presenta como un componente interactivo (ej. PlaylistCard, ListItem, etc.). Al hacer clic sobre una playlist, se navega a una nueva pantalla que muestra el contenido (tracks) de dicha playlist.

### 2. Pantalla de tracks de una playlist

🎯 Muestra el título de la playlist seleccionada.

🎯 Presenta la lista de canciones que pertenecen a esa playlist.

🎯 Incluye un botón “Agregar canciones”, que dirige a una pantalla de búsqueda.

🎯 También permite al usuario eliminar canciones individuales de la playlist

### 3. Pantalla de búsqueda de canciones (Deezer)

🎯 Se muestra un campo de texto para ingresar términos de búsqueda y un botón para ejecutar la búsqueda. Los resultados de la búsqueda se muestran en una lista.

🎯 Esta pantalla es contextual, es decir, está asociada a la playlist desde la que fue abierta. Todas las canciones que se agreguen desde aquí irán directamente a esa playlist. Desde los resultados de búsqueda (proporcionados por la API de Deezer), el usuario puede agregar canciones individuales (tipo track) a la playlist activa. **Tenga en cuenta que el modelo de Deezer NO corresponde al modelo de datos**, aunque sí guarda relación


---

### Consideraciones

Crear y eliminar playlists no es necesario implementarlo en esta versión.

Las búsquedas a Deezer deben filtrarse por tipo track para asegurar que los resultados agregables sean canciones válidas.
