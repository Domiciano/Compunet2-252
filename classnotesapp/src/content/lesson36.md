[t] Componentes Básicos de Material-UI

[link]Material-UI https://mui.com/ 
Es una popular librería de componentes de React que implementa el sistema de diseño [link]Material Design https://m3.material.io/ de Google. Provee una gran variedad de componentes listos para usar que te permiten construir interfaces de usuario atractivas y consistentes de forma rápida.

[st]Componentes Esenciales
A continuación, exploraremos algunos de los componentes más básicos y útiles.

[st]Stack
El componente `Stack` es un contenedor que te permite organizar elementos en una sola dimensión, ya sea vertical u horizontalmente. Es ideal para distribuir el espaciado entre elementos de forma consistente.

[code:jsx]
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicStack() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  );
}
[endcode]

[st]Typography (Label)

Para mostrar texto, Material-UI provee el componente `Typography`. Funciona como un reemplazo para las etiquetas HTML semánticas (`<h1>`, `<p>`, `<span>`, etc.) y permite aplicar estilos de texto consistentes.

[code:jsx]
import Typography from '@mui/material/Typography';

export default function BasicTypography() {
  return (
    <Typography variant="h5" component="h2">
      Este es un título.
    </Typography>
  );
}
[endcode]

[st]TextField

El `TextField` es el componente para la entrada de datos por parte del usuario. Es altamente configurable y puedes capturar su valor a través del evento `onChange`.

[code:jsx]
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function BasicTextField() {
  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <TextField 
        id="outlined-basic" 
        label="Nombre" 
        variant="outlined" 
        value={name}
        onChange={handleNameChange}
      />
      <Typography variant="body1" style={{ marginTop: '10px' }}>
        Hola, {name || 'desconocido'}!
      </Typography>
    </>
  );
}
[endcode]

[st]Button

El `Button` permite a los usuarios ejecutar una acción con un solo clic. Puedes manejar esta interacción con el evento `onClick`.

[code:jsx]
import React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton() {
  const handleClick = () => {
    alert('¡Botón presionado!');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      Haz Clic
    </Button>
  );
}
[endcode]

[st]Imagen

Para mostrar imágenes, puedes usar la etiqueta `<img>` estándar de HTML o componentes de Material-UI como `CardMedia` si estás dentro de un `Card`. Para un uso simple, un `div` con una imagen de fondo o una etiqueta `img` estilizada es suficiente.

[code:jsx]
import React from 'react';

export default function BasicImage() {
  return (
    <img 
      src="https://via.placeholder.com/150" 
      alt="Placeholder" 
      style={{ width: '150px', height: '150px', borderRadius: '8px' }} 
    />
  );
}
[endcode]

[st]Ejemplo Completo

Ahora, combinemos todos estos elementos usando `Stack` para organizarlos verticalmente.

[code:jsx]
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (email) {
      alert(`Iniciando sesión como ${email}`);
    } else {
      alert('Por favor, introduce tu email.');
    }
  };

  return (
    <Stack spacing={3} sx={{ width: 300, margin: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px' }}>
      <img 
        src="https://mui.com/static/logo.png" 
        alt="MUI Logo" 
        style={{ width: '50px', height: '50px', margin: '0 auto' }} 
      />
      <Typography variant="h5" component="h1" textAlign="center">
        Inicio de Sesión
      </Typography>
      <TextField 
        id="email-input" 
        label="Email" 
        variant="outlined" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Entrar
      </Button>
    </Stack>
  );
}
[endcode]