# CSRF Token

<!-- tags: CSRF, token CSRF, _csrf, campo oculto en formularios, 403 Forbidden al enviar un formulario,
     CsrfFilter, th:action, Invalid CSRF token, falsificación de peticiones, csrf().disable() -->

Desde que instaló Spring Security, todos los formularios de su aplicación llevan un campo oculto que usted no escribió. Se llama `_csrf` y es la defensa de Spring Security contra un ataque muy concreto: que otra página web haga peticiones a su aplicación usando la sesión de un usuario que ya inició sesión.

## El problema: la cookie viaja sola

En la autenticación basada en estado, el servidor reconoce al usuario por la cookie `JSESSIONID`. El navegador envía esa cookie **automáticamente** en cada request dirigido a su aplicación, sin importar desde qué página se originó el request.

Eso abre una puerta. Suponga que un usuario tiene sesión abierta en su aplicación y, en otra pestaña, entra a un sitio malicioso. Ese sitio puede traer un formulario escondido que apunta a su aplicación y que se envía solo:

```html
<form action="http://localhost:8080/courses" method="post">
    <input type="hidden" name="name" value="spam"/>
</form>
<script>document.forms[0].submit()</script>
```

El navegador envía ese `POST` con la cookie `JSESSIONID` del usuario. Para el servidor, el request es idéntico a uno legítimo: trae una sesión válida. El usuario acaba de crear, borrar o modificar algo sin enterarse.

Este ataque se llama **CSRF** (*Cross-Site Request Forgery*, falsificación de peticiones entre sitios).

## Para qué sirve el CSRF Token

El CSRF Token es un valor aleatorio que el servidor genera para cada sesión y que escribe dentro de los formularios que él mismo entrega. Cuando el formulario se envía, el servidor compara el token que llega con el que tiene guardado en la sesión.

La cookie no alcanza para pasar esa verificación, y ahí está la gracia:

- La **cookie** la envía el navegador por su cuenta, también cuando el request sale de otro sitio.
- El **token** solo está dentro del HTML que su aplicación le entregó al usuario. Un sitio malicioso no puede leer las páginas de su aplicación, así que no tiene forma de conocerlo.

Un request que modifica datos y no trae el token correcto se rechaza, aunque traiga una sesión válida.

## Dónde verlo

Abra cualquier formulario de su aplicación en el navegador, por ejemplo la página de login, y revise el HTML con las herramientas de desarrollador. Verá un campo que no está en su plantilla:

```html
<form action="/courses" method="post">
    <input type="hidden" name="_csrf" value="7f3a9cXk2Lq0…"/>
    <input type="text" name="name"/>
    <button type="submit">Crear</button>
</form>
```

El valor es un texto largo y aleatorio; aquí está recortado. Ese `input` lo agrega Thymeleaf automáticamente en todos los formularios que usan `th:action` y cuyo método es `post`:

```html
<form th:action="@{/courses}" method="post">
    <input type="text" name="name"/>
    <button type="submit">Crear</button>
</form>
```

Si escribe el formulario con `action` a secas, Thymeleaf no interviene y el campo no aparece. En ese caso hay que ponerlo a mano:

```html
<form action="/courses" method="post">
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
    <input type="text" name="name"/>
    <button type="submit">Crear</button>
</form>
```

- Verifique que el formulario de login que genera Spring Security también trae su campo `_csrf`

## El mecanismo

La animación recorre dos casos: primero el formulario de su propia aplicación, que trae el token, y después un sitio malicioso que intenta el mismo `POST` sin él.

```svg
<svg id="csrfMecanismo" data-steps="7" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 602" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="csrfMecanismo-ttl csrfMecanismo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="csrfMecanismo-ttl">CSRF Token: la cookie no basta</title>
  <desc id="csrfMecanismo-dsc">Animación en siete pasos con el recorrido del request a la izquierda, la página abierta en el navegador arriba a la derecha y la sesión HTTP del servidor debajo. Caso uno, el formulario propio. Uno: el usuario con sesión pide el formulario con un GET, que CsrfFilter no verifica. Dos: Spring Security genera un token, lo guarda en la sesión y lo escribe en el formulario como campo oculto _csrf. Tres: al enviar, el navegador manda la cookie JSESSIONID y el campo _csrf. Cuatro: CsrfFilter compara el token del request con el de la sesión, coinciden y el POST llega al controller. Caso dos, un sitio malicioso. Cinco: el usuario abre sitio-malo.com, que trae un formulario escondido dirigido a la aplicación. Seis: el navegador envía el POST con la cookie, pero sin _csrf. Siete: CsrfFilter rechaza el request con 403 Forbidden y el controller no se ejecuta.</desc>
  <defs>
    <style>
      #csrfMecanismo .title{fill:#161A26;font-size:22px;font-weight:700}
      #csrfMecanismo .sub{fill:#79809A;font-size:13.5px}
      #csrfMecanismo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #csrfMecanismo .foot{fill:#79809A;font-size:12px}
      #csrfMecanismo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #csrfMecanismo .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#csrfMecanismo-ar-teal)}
      #csrfMecanismo .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#csrfMecanismo-ar-green)}
      #csrfMecanismo .an,#csrfMecanismo .ls,#csrfMecanismo .st{animation-duration:28s;animation-iteration-count:infinite;animation-timing-function:linear}
      #csrfMecanismo .an{opacity:0}
      #csrfMecanismo .st{animation-name:csrfMecanismo-hide}
      #csrfMecanismo .a1{animation-name:csrfMecanismo-a1}
      @keyframes csrfMecanismo-a1{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a2{animation-name:csrfMecanismo-a2}
      @keyframes csrfMecanismo-a2{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a3{animation-name:csrfMecanismo-a3}
      @keyframes csrfMecanismo-a3{0%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a4{animation-name:csrfMecanismo-a4}
      @keyframes csrfMecanismo-a4{0%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a5{animation-name:csrfMecanismo-a5}
      @keyframes csrfMecanismo-a5{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a6{animation-name:csrfMecanismo-a6}
      @keyframes csrfMecanismo-a6{0%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a7{animation-name:csrfMecanismo-a7}
      @keyframes csrfMecanismo-a7{0%{opacity:0} 85.71%{opacity:0} 87.71%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #csrfMecanismo .a14{animation-name:csrfMecanismo-a14}
      @keyframes csrfMecanismo-a14{0%{opacity:0} 2%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a24{animation-name:csrfMecanismo-a24}
      @keyframes csrfMecanismo-a24{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .a27{animation-name:csrfMecanismo-a27}
      @keyframes csrfMecanismo-a27{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #csrfMecanismo .a57{animation-name:csrfMecanismo-a57}
      @keyframes csrfMecanismo-a57{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #csrfMecanismo .aW{animation-name:csrfMecanismo-aW}
      @keyframes csrfMecanismo-aW{0%{opacity:0} 2%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .aN{animation-name:csrfMecanismo-aN}
      @keyframes csrfMecanismo-aN{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .aF{animation-name:csrfMecanismo-aF}
      @keyframes csrfMecanismo-aF{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .aC{animation-name:csrfMecanismo-aC}
      @keyframes csrfMecanismo-aC{0%{opacity:0} 2%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #csrfMecanismo .hp0{animation-name:csrfMecanismo-hp0}
      @keyframes csrfMecanismo-hp0{0%,0.86%{opacity:0;transform:translate(0,0)}1.43%{opacity:1;transform:translate(0,0)}5%{opacity:1;transform:translate(0px,20px)}12.57%{opacity:1;transform:translate(0px,20px)}13.14%,100%{opacity:0;transform:translate(0px,20px)}}
      #csrfMecanismo .hp1{animation-name:csrfMecanismo-hp1}
      @keyframes csrfMecanismo-hp1{0%,5.43%{opacity:0;transform:translate(0,0)}6%{opacity:1;transform:translate(0,0)}9.57%{opacity:1;transform:translate(0px,20px)}12.57%{opacity:1;transform:translate(0px,20px)}13.14%,100%{opacity:0;transform:translate(0px,20px)}}
      #csrfMecanismo .hp2{animation-name:csrfMecanismo-hp2}
      @keyframes csrfMecanismo-hp2{0%,15.14%{opacity:0;transform:translate(0,0)}15.71%{opacity:1;transform:translate(0,0)}19.29%{opacity:1;transform:translate(0px,-20px)}26.86%{opacity:1;transform:translate(0px,-20px)}27.43%,100%{opacity:0;transform:translate(0px,-20px)}}
      #csrfMecanismo .hp3{animation-name:csrfMecanismo-hp3}
      @keyframes csrfMecanismo-hp3{0%,19.71%{opacity:0;transform:translate(0,0)}20.29%{opacity:1;transform:translate(0,0)}23.86%{opacity:1;transform:translate(0px,-20px)}26.86%{opacity:1;transform:translate(0px,-20px)}27.43%,100%{opacity:0;transform:translate(0px,-20px)}}
      #csrfMecanismo .hp4{animation-name:csrfMecanismo-hp4}
      @keyframes csrfMecanismo-hp4{0%,29.71%{opacity:0;transform:translate(0,0)}30.29%{opacity:1;transform:translate(0,0)}36.43%{opacity:1;transform:translate(0px,20px)}41.14%{opacity:1;transform:translate(0px,20px)}41.71%,100%{opacity:0;transform:translate(0px,20px)}}
      #csrfMecanismo .hp5{animation-name:csrfMecanismo-hp5}
      @keyframes csrfMecanismo-hp5{0%,43.43%{opacity:0;transform:translate(0,0)}44%{opacity:1;transform:translate(0,0)}46.71%{opacity:1;transform:translate(0px,20px)}55.43%{opacity:1;transform:translate(0px,20px)}56%,100%{opacity:0;transform:translate(0px,20px)}}
      #csrfMecanismo .hp6{animation-name:csrfMecanismo-hp6}
      @keyframes csrfMecanismo-hp6{0%,46.71%{opacity:0;transform:translate(0,0)}47.29%{opacity:1;transform:translate(0,0)}50%{opacity:1;transform:translate(0px,-20px)}55.43%{opacity:1;transform:translate(0px,-20px)}56%,100%{opacity:0;transform:translate(0px,-20px)}}
      #csrfMecanismo .hp7{animation-name:csrfMecanismo-hp7}
      @keyframes csrfMecanismo-hp7{0%,50%{opacity:0;transform:translate(0,0)}50.57%{opacity:1;transform:translate(0,0)}53.29%{opacity:1;transform:translate(0px,-20px)}55.43%{opacity:1;transform:translate(0px,-20px)}56%,100%{opacity:0;transform:translate(0px,-20px)}}
      #csrfMecanismo .hp8{animation-name:csrfMecanismo-hp8}
      @keyframes csrfMecanismo-hp8{0%,72.57%{opacity:0;transform:translate(0,0)}73.14%{opacity:1;transform:translate(0,0)}79.29%{opacity:1;transform:translate(0px,20px)}84%{opacity:1;transform:translate(0px,20px)}84.57%,100%{opacity:0;transform:translate(0px,20px)}}
      #csrfMecanismo .hp9{animation-name:csrfMecanismo-hp9}
      @keyframes csrfMecanismo-hp9{0%,86.86%{opacity:0;transform:translate(0,0)}87.43%{opacity:1;transform:translate(0,0)}93.57%{opacity:1;transform:translate(0px,-20px)}98.29%{opacity:1;transform:translate(0px,-20px)}98.86%,100%{opacity:0;transform:translate(0px,-20px)}}
      @keyframes csrfMecanismo-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#csrfMecanismo .an,#csrfMecanismo .ls,#csrfMecanismo .st{animation:none}}
    </style>
    <marker id="csrfMecanismo-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="csrfMecanismo-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="602" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">CSRF Token: la cookie no basta</text>
  <text class="sub" x="48" y="80" data-fit="860">El servidor solo acepta un formulario si trae el token que él mismo escribió en esa página.</text>
  <g class="ls a14"><rect x="692" y="36" width="220" height="28" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235" data-fit="204">CASO 1 · SU FORMULARIO</text></g>
  <g class="an a57"><rect x="692" y="36" width="220" height="28" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="204">CASO 2 · SITIO MALICIOSO</text></g>
  <rect x="48" y="104" width="316" height="366" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="284">EL RECORRIDO DEL REQUEST</text>
  <rect x="388" y="104" width="524" height="236" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="404" y="128" data-fit="492">LA PÁGINA ABIERTA EN EL NAVEGADOR</text>
  <rect x="388" y="354" width="524" height="116" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="404" y="378" data-fit="492">EN EL SERVIDOR · SESIÓN HTTP</text>
  <rect x="64" y="140" width="284" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="206" y="158" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074" data-fit="268">Navegador · JSESSIONID=ABC123…</text>
  <rect x="64" y="220" width="284" height="36" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text class="mono" x="206" y="238" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="268">CsrfFilter</text>
  <rect x="64" y="300" width="284" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="206" y="318" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="268">CoursesController</text>
  <path class="ar-teal" d="M72,178 V218"/><path class="ar-green" d="M88,218 V178"/>
  <path class="ar-teal" d="M72,258 V298"/><path class="ar-green" d="M88,298 V258"/>
  <text class="h" x="64" y="366">LO QUE COMPARA CSRFFILTER</text>
  <g class="an aW"><rect x="64" y="376" width="284" height="78" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="206" y="415" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">nada por ahora</text></g>
  <g class="ls a4"><rect x="64" y="376" width="284" height="78" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="78" y="397" font-size="12" fill="#161A26">request:  _csrf=7f3a9c…</text><text class="mono" x="78" y="415" font-size="12" fill="#161A26">sesión:   7f3a9c…</text><text x="78" y="440" font-size="13" font-weight="700" fill="#3A8235">Coinciden: el request pasa</text></g>
  <g class="an a7"><rect x="64" y="376" width="284" height="78" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="78" y="397" font-size="12" fill="#161A26">request:  sin _csrf</text><text class="mono" x="78" y="415" font-size="12" fill="#161A26">sesión:   7f3a9c…</text><text x="78" y="440" font-size="13" font-weight="700" fill="#C2354F">No coinciden: 403 Forbidden</text></g>
  <rect x="404" y="140" width="492" height="186" rx="10" fill="#1F2430"/>
  <path d="M404,150 A10,10 0 0 1 414,140 H886 A10,10 0 0 1 896,150 V166 H404 Z" fill="#2A3040"/>
  <g class="an a1"><text class="mono" x="416" y="153" dy="0.35em" font-size="12" fill="#9AA3B5">localhost:8080/courses/new</text><text class="mono" x="416.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">cargando…</text></g>
  <g class="ls a24"><text class="mono" x="416" y="153" dy="0.35em" font-size="12" fill="#9AA3B5">localhost:8080/courses/new</text><rect x="408" y="189" width="484" height="40" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="416.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="262.2" lengthAdjust="spacingAndGlyphs">&lt;form action=&quot;/courses&quot; method=&quot;post&quot;&gt;</text><text class="mono" x="429.8" y="203" font-size="11.5" fill="#E6EAF2" textLength="227.7" lengthAdjust="spacingAndGlyphs">&lt;input type=&quot;hidden&quot; name=&quot;_csrf&quot;</text><text class="mono" x="478.1" y="222" font-size="11.5" fill="#E6EAF2" textLength="117.3" lengthAdjust="spacingAndGlyphs">value=&quot;7f3a9c…&quot;/&gt;</text><text class="mono" x="429.8" y="241" font-size="11.5" fill="#E6EAF2" textLength="220.8" lengthAdjust="spacingAndGlyphs">&lt;input type=&quot;text&quot; name=&quot;name&quot;/&gt;</text><text class="mono" x="429.8" y="260" font-size="11.5" fill="#E6EAF2" textLength="248.4" lengthAdjust="spacingAndGlyphs">&lt;button type=&quot;submit&quot;&gt;Crear&lt;/button&gt;</text><text class="mono" x="416.0" y="279" font-size="11.5" fill="#E6EAF2" textLength="48.3" lengthAdjust="spacingAndGlyphs">&lt;/form&gt;</text></g>
  <g class="an a57"><text class="mono" x="416" y="153" dy="0.35em" font-size="12" fill="#F3A3B2">sitio-malo.com</text><rect x="408" y="189" width="484" height="40" rx="5" fill="#F3A3B2" fill-opacity=".3" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="416.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="193.2" lengthAdjust="spacingAndGlyphs">&lt;h1&gt;¡Ganaste un premio!&lt;/h1&gt;</text><text class="mono" x="416.0" y="203" font-size="11.5" fill="#E6EAF2" textLength="303.6" lengthAdjust="spacingAndGlyphs">&lt;form action=&quot;http://localhost:8080/courses&quot;</text><text class="mono" x="457.4" y="222" font-size="11.5" fill="#E6EAF2" textLength="96.6" lengthAdjust="spacingAndGlyphs">method=&quot;post&quot;&gt;</text><text class="mono" x="429.8" y="241" font-size="11.5" fill="#E6EAF2" textLength="324.3" lengthAdjust="spacingAndGlyphs">&lt;input type=&quot;hidden&quot; name=&quot;name&quot; value=&quot;spam&quot;/&gt;</text><text class="mono" x="416.0" y="260" font-size="11.5" fill="#E6EAF2" textLength="48.3" lengthAdjust="spacingAndGlyphs">&lt;/form&gt;</text><text class="mono" x="416.0" y="279" font-size="11.5" fill="#E6EAF2" textLength="296.7" lengthAdjust="spacingAndGlyphs">&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</text></g>
  <g class="an a1"><rect x="404" y="390" width="492" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="650" y="411" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="476">Sesión ABC123XYZ456</text><text x="650" y="430" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="476">usuario ana · todavía sin token CSRF</text></g>
  <g class="ls a27"><rect x="404" y="390" width="492" height="60" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="650" y="411" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="476">Sesión ABC123XYZ456</text><text x="650" y="430" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="476">usuario ana · token CSRF 7f3a9c…</text></g>
  <rect class="an aN" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a6" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an aF" x="60" y="216" width="292" height="44" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a7" x="60" y="216" width="292" height="44" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an aC" x="60" y="296" width="292" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a2" x="398" y="384" width="504" height="72" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a4" x="398" y="384" width="504" height="72" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a7" x="398" y="384" width="504" height="72" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a5" x="398" y="134" width="504" height="198" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <g class="an hp0"><rect x="62" y="168" width="136" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="178" r="5" fill="#0F8478"/><text class="mono" x="83" y="178" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /courses/new</text></g>
  <g class="an hp1"><rect x="62" y="248" width="136" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="258" r="5" fill="#0F8478"/><text class="mono" x="83" y="258" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /courses/new</text></g>
  <g class="an hp2"><rect x="78" y="288" width="202" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="298" r="5" fill="#3A8235"/><text class="mono" x="99" y="298" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">formulario + _csrf=7f3a9c…</text></g>
  <g class="an hp3"><rect x="78" y="208" width="175" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="218" r="5" fill="#3A8235"/><text class="mono" x="99" y="218" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">HTML con _csrf=7f3a9c…</text></g>
  <g class="an hp4"><rect x="62" y="168" width="221" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="178" r="5" fill="#0F8478"/><text class="mono" x="83" y="178" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">POST /courses · _csrf=7f3a9c…</text></g>
  <g class="an hp5"><rect x="62" y="248" width="116" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="258" r="5" fill="#0F8478"/><text class="mono" x="83" y="258" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">POST /courses</text></g>
  <g class="an hp6"><rect x="78" y="288" width="122" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="298" r="5" fill="#3A8235"/><text class="mono" x="99" y="298" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">302 · /courses</text></g>
  <g class="an hp7"><rect x="78" y="208" width="122" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="218" r="5" fill="#3A8235"/><text class="mono" x="99" y="218" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">302 · /courses</text></g>
  <g class="an hp8"><rect x="62" y="168" width="195" height="20" rx="10" fill="#FFFFFF" stroke="#C2354F" stroke-width="1.5"/><circle cx="72" cy="178" r="5" fill="#C2354F"/><text class="mono" x="83" y="178" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">POST /courses · sin _csrf</text></g>
  <g class="an hp9"><rect x="78" y="208" width="116" height="20" rx="10" fill="#FFFFFF" stroke="#C2354F" stroke-width="1.5"/><circle cx="88" cy="218" r="5" fill="#C2354F"/><text class="mono" x="99" y="218" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">403 Forbidden</text></g>
  <rect x="48" y="486" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="514" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 1 · El usuario, ya con sesión, abre el formulario para crear un curso.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">Es un GET: CsrfFilter no verifica nada en las peticiones que solo leen.</text></g>
  <g class="an a2"><circle cx="76" cy="514" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">2</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Spring Security genera un token aleatorio, lo guarda en la sesión y Thymeleaf lo escribe en el formulario.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">Viaja como un campo oculto llamado _csrf: el usuario no lo ve, pero está en el HTML.</text></g>
  <g class="an a3"><circle cx="76" cy="514" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">3</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Al enviar el formulario, el navegador manda la cookie JSESSIONID y, en el cuerpo, el campo _csrf.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">La cookie la pone el navegador; el token solo lo tiene quien recibió esa página.</text></g>
  <g class="an a4"><circle cx="76" cy="514" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">CsrfFilter compara el token del request con el de la sesión: coinciden.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">El POST llega al controller y el curso se crea.</text></g>
  <g class="an a5"><circle cx="76" cy="514" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">5</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 2 · Sin cerrar sesión, el usuario abre otra página: sitio-malo.com.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">Esa página trae un formulario escondido que apunta a su aplicación y se envía solo.</text></g>
  <g class="an a6"><circle cx="76" cy="514" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">6</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El navegador envía el POST con la cookie JSESSIONID, porque va dirigido a localhost:8080.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">Pero el sitio malicioso no pudo leer el token: el request llega sin _csrf.</text></g>
  <g class="an a7"><circle cx="76" cy="514" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="514" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">7</text><text x="100" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="790">CsrfFilter no encuentra el token y rechaza el request con 403 Forbidden.</text><text x="100" y="527" font-size="13" fill="#454C61" data-fit="790">El controller nunca se ejecuta: tener la cookie no fue suficiente.</text></g>
  <g class="st"><text x="68" y="509" font-size="13" font-weight="600" fill="#161A26" data-fit="820">La cookie viaja sola en cada request; el token CSRF solo viaja en los formularios que entregó su aplicación.</text><text x="68" y="527" font-size="13" fill="#454C61" data-fit="820">La animación recorre los dos casos.</text></g>
  <text class="foot" x="48" y="574" data-fit="860">CsrfFilter verifica POST, PUT, PATCH y DELETE; las peticiones GET pasan sin token.</text>
</svg>
```

El filtro que hace la comparación se llama `CsrfFilter` y forma parte de los filtros de seguridad. Solo verifica las peticiones que modifican datos: `POST`, `PUT`, `PATCH` y `DELETE`. Las peticiones `GET` pasan sin token, y por eso un `GET` nunca debería cambiar nada en el servidor.

## Cuando falta el token

Si un formulario se envía sin el token, o con uno que no coincide, Spring Security responde `403 Forbidden` y el controller no se ejecuta.

Es el error típico justo después de agregar Spring Security: un formulario que funcionaba deja de funcionar y devuelve `403`. Casi siempre la causa es una de estas dos:

- El formulario usa `action` en vez de `th:action`, así que Thymeleaf no agregó el campo `_csrf`.
- El request se hace con `fetch` o con una herramienta como Postman, que no envía el token.

La solución es hacer que el token viaje, no apagar la protección. Deshabilitarla con `csrf(csrf -> csrf.disable())` solo tiene sentido cuando la aplicación no usa cookies de sesión, como en las API REST con tokens que veremos más adelante.
