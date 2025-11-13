[t] useContext
El hook `useContext` de React es una herramienta para gestionar el estado global de la aplicación. Permite a los componentes acceder a datos compartidos sin necesidad de pasar props manualmente a través de múltiples niveles del árbol de componentes, un problema conocido como "prop drilling".

[st] Creación del contexto
Podemos crear un contexto para la aplicación. Las variables que pongamos aquí serán accesibles desde cualquier nodo del arbol de la aplicación
[code:js]
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

const useApp => () {
  return useContext(AppContext);
}
[endcode]

`AppProvider` funciona como wrapper, es decir que si quiere obtener las variables en un componente tendrá que envolverlo
[code:jsx]
<AppProvider>
  <Profile />
</AppProvider>
[endcode]
Ahora, dentro del elemento puede usar el contexto de esta manera.
[code:jsx]
const Profile = () => {
  const { user, setUser } = useApp();
  return (
    <div>
      <p>{user ? user.name : "Sin usuario"}</p>
      <button onClick={() => setUser({ name: "Alice" })}>Cambiar</button>
    </div>
  );
};
[endcode]

[st] Persistir el estado
Necesita controlar la persistencia usando el ciclo de vida de los datos, para eso, analice el siguiente código.
[code:jsx]
import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Se ejecuta una sola vez al montar
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // Cada vez que cambia user, lo guardamos
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // limpia si se desloguea
      localStorage.removeItem("user"); 
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
[endcode]