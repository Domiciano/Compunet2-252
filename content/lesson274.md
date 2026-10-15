# Data Transfer Object (DTO)

<!-- tags: DTO, Data Transfer Object, entidad vs DTO, UsuarioResponseDTO, UsuarioRequestDTO, exponer la entidad, password en el JSON, mapeo manual, copiar campos de Entity a DTO, Jackson -->

Cuando un controller responde, no devuelve la entidad que sacó de la base de datos: la copia a un DTO que solo tiene los campos que el cliente debe ver.

```svg
<svg id="restDtoMapeo" data-steps="4" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 680" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restDtoMapeo-ttl restDtoMapeo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restDtoMapeo-ttl">De Entity a DTO: se copia solo lo que sale</title>
  <desc id="restDtoMapeo-dsc">Animación en cuatro pasos para GET /usuarios/7. A la izquierda la entidad Usuario, a la derecha el UsuarioResponseDTO y abajo el código del controller y la respuesta HTTP. Uno: el repository trae la entidad con id, nombre, email y password. Dos: se crea un DTO vacío con id, nombre y email en null. Tres: se copian id, nombre y email; el password no se copia porque el DTO no tiene ese campo. Cuatro: el controller retorna el DTO y Jackson lo escribe como JSON, sin password.</desc>
  <defs>
    <style>
      #restDtoMapeo .title{fill:#161A26;font-size:22px;font-weight:700}
      #restDtoMapeo .sub{fill:#79809A;font-size:13.5px}
      #restDtoMapeo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restDtoMapeo .foot{fill:#79809A;font-size:12px}
      #restDtoMapeo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restDtoMapeo .an,#restDtoMapeo .ls,#restDtoMapeo .st{animation-duration:16s;animation-iteration-count:infinite;animation-timing-function:linear}
      #restDtoMapeo .an{opacity:0}
      #restDtoMapeo .st{animation-name:restDtoMapeo-hide}
      #restDtoMapeo .a1{animation-name:restDtoMapeo-a1}
      @keyframes restDtoMapeo-a1{0%{opacity:0} 2%{opacity:1} 23%{opacity:1} 25%{opacity:0} 100%{opacity:0}}
      #restDtoMapeo .a2{animation-name:restDtoMapeo-a2}
      @keyframes restDtoMapeo-a2{0%{opacity:0} 25%{opacity:0} 27%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #restDtoMapeo .a3{animation-name:restDtoMapeo-a3}
      @keyframes restDtoMapeo-a3{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 73%{opacity:1} 75%{opacity:0} 100%{opacity:0}}
      #restDtoMapeo .a4{animation-name:restDtoMapeo-a4}
      @keyframes restDtoMapeo-a4{0%{opacity:0} 75%{opacity:0} 77%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restDtoMapeo .a13{animation-name:restDtoMapeo-a13}
      @keyframes restDtoMapeo-a13{0%{opacity:0} 2%{opacity:1} 73%{opacity:1} 75%{opacity:0} 100%{opacity:0}}
      #restDtoMapeo .a24{animation-name:restDtoMapeo-a24}
      @keyframes restDtoMapeo-a24{0%{opacity:0} 25%{opacity:0} 27%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restDtoMapeo .a34{animation-name:restDtoMapeo-a34}
      @keyframes restDtoMapeo-a34{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restDtoMapeo .hp0{animation-name:restDtoMapeo-hp0}
      @keyframes restDtoMapeo-hp0{0%,51%{opacity:0;transform:translate(0,0)}52%{opacity:1;transform:translate(0,0)}56.75%{opacity:1;transform:translate(72px,0px)}72%{opacity:1;transform:translate(72px,0px)}73%,100%{opacity:0;transform:translate(72px,0px)}}
      #restDtoMapeo .hp1{animation-name:restDtoMapeo-hp1}
      @keyframes restDtoMapeo-hp1{0%,56.75%{opacity:0;transform:translate(0,0)}57.75%{opacity:1;transform:translate(0,0)}62.5%{opacity:1;transform:translate(72px,0px)}72%{opacity:1;transform:translate(72px,0px)}73%,100%{opacity:0;transform:translate(72px,0px)}}
      #restDtoMapeo .hp2{animation-name:restDtoMapeo-hp2}
      @keyframes restDtoMapeo-hp2{0%,62.5%{opacity:0;transform:translate(0,0)}63.5%{opacity:1;transform:translate(0,0)}68.25%{opacity:1;transform:translate(72px,0px)}72%{opacity:1;transform:translate(72px,0px)}73%,100%{opacity:0;transform:translate(72px,0px)}}
      @keyframes restDtoMapeo-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#restDtoMapeo .an,#restDtoMapeo .ls,#restDtoMapeo .st{animation:none}}
    </style>
  </defs>
  <rect width="960" height="680" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">De Entity a DTO: se copia solo lo que sale</text>
  <text class="sub" x="48" y="80" data-fit="860">La entidad se queda en el servidor; al cliente le llega un DTO con los campos que sí debe ver.</text>
  <rect x="48" y="104" width="320" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="288">ADENTRO · @Entity</text>
  <rect x="64" y="136" width="288" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="208" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="272">Usuario</text>
  <rect x="64" y="192" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="207" dy="0.35em" font-size="13" fill="#454C61">id</text><text class="mono" x="338" y="207" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#161A26">7</text>
  <rect x="64" y="230" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="245" dy="0.35em" font-size="13" fill="#454C61">nombre</text><text class="mono" x="338" y="245" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#161A26">Ana Ruiz</text>
  <rect x="64" y="268" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="283" dy="0.35em" font-size="13" fill="#454C61">email</text><text class="mono" x="338" y="283" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#161A26">ana@icesi.edu.co</text>
  <rect x="64" y="306" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="78" y="321" dy="0.35em" font-size="13" fill="#454C61">password</text><text class="mono" x="338" y="321" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#161A26">$2a$10$Xk9…</text>
  <rect class="an a1" x="60" y="133" width="296" height="46" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="ls a34" x="58" y="300" width="300" height="42" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <g class="ls a34"><text x="480" y="321" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">✕ no se copia</text></g>
  <g class="ls a34"><text class="h" x="480" y="168" text-anchor="middle">SE COPIA →</text></g>
  <rect x="592" y="104" width="320" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="608" y="128" data-fit="288">SALE · DTO</text>
  <g class="an a1"><rect x="608" y="136" width="288" height="200" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="752" y="236" dy="0.35em" text-anchor="middle" font-size="13" fill="#79809A">todavía no existe</text></g>
  <g class="ls a24"><rect x="608" y="136" width="288" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="2.5"/><text class="mono" x="752" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="272">UsuarioResponseDTO</text><rect x="608" y="192" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="622" y="207" dy="0.35em" font-size="13" fill="#454C61">id</text><rect x="608" y="230" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="622" y="245" dy="0.35em" font-size="13" fill="#454C61">nombre</text><rect x="608" y="268" width="288" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="622" y="283" dy="0.35em" font-size="13" fill="#454C61">email</text><text x="752" y="321" dy="0.35em" text-anchor="middle" font-size="12" fill="#79809A">(sin campo password)</text></g>
  <g class="an a2"><text class="mono" x="882" y="207" dy="0.35em" text-anchor="end" font-size="13" fill="#9AA3B5">null</text><text class="mono" x="882" y="245" dy="0.35em" text-anchor="end" font-size="13" fill="#9AA3B5">null</text><text class="mono" x="882" y="283" dy="0.35em" text-anchor="end" font-size="13" fill="#9AA3B5">null</text></g>
  <g class="ls a34"><text class="mono" x="882" y="207" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#3A8235">7</text><text class="mono" x="882" y="245" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#3A8235">Ana Ruiz</text><text class="mono" x="882" y="283" dy="0.35em" text-anchor="end" font-size="13" font-weight="600" fill="#3A8235">ana@icesi.edu.co</text></g>
  <rect class="an a2" x="604" y="133" width="296" height="46" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect x="48" y="368" width="520" height="184" rx="10" fill="#1F2430"/>
  <path d="M48,378 A10,10 0 0 1 58,368 H558 A10,10 0 0 1 568,378 V394 H48 Z" fill="#2A3040"/>
  <rect class="an a1" x="52" y="402" width="512" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/>
  <rect class="an a2" x="52" y="421" width="512" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/>
  <rect class="an a3" x="52" y="440" width="512" height="59" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/>
  <rect class="ls a4" x="52" y="516" width="512" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="60" y="381" dy="0.35em" font-size="11.5" fill="#9AA3B5">UsuarioController.java</text><text class="mono" x="60.0" y="416" font-size="11.5" fill="#E6EAF2" textLength="345.0" lengthAdjust="spacingAndGlyphs">Usuario u = repository.findById(7L).orElseThrow();</text><text class="mono" x="60.0" y="435" font-size="11.5" fill="#E6EAF2" textLength="345.0" lengthAdjust="spacingAndGlyphs">UsuarioResponseDTO dto = new UsuarioResponseDTO();</text><text class="mono" x="60.0" y="454" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">dto.setId(u.getId());</text><text class="mono" x="60.0" y="473" font-size="11.5" fill="#E6EAF2" textLength="200.1" lengthAdjust="spacingAndGlyphs">dto.setNombre(u.getNombre());</text><text class="mono" x="60.0" y="492" font-size="11.5" fill="#E6EAF2" textLength="186.3" lengthAdjust="spacingAndGlyphs">dto.setEmail(u.getEmail());</text><text class="mono" x="60.0" y="511" font-size="11.5" fill="#8C95AA" textLength="179.4" lengthAdjust="spacingAndGlyphs">// el password no se copia</text><text class="mono" x="60.0" y="530" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">return ResponseEntity.ok(dto);</text>
  <rect x="584" y="368" width="328" height="184" rx="10" fill="#1F2430"/>
  <path d="M584,378 A10,10 0 0 1 594,368 H902 A10,10 0 0 1 912,378 V394 H584 Z" fill="#2A3040"/>
  <g class="an a13"><text class="mono" x="596" y="381" dy="0.35em" font-size="11.5" fill="#9AA3B5">respuesta HTTP</text><text class="mono" x="596.0" y="416" font-size="11.5" fill="#8C95AA" textLength="179.4" lengthAdjust="spacingAndGlyphs">(todavía no hay respuesta)</text></g>
  <g class="ls a4"><text class="mono" x="596" y="381" dy="0.35em" font-size="11.5" fill="#9AA3B5">respuesta HTTP · la escribe Jackson</text><rect x="655.1" y="402" width="47.4" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="596.0" y="416" font-size="11.5" fill="#E6EAF2" textLength="103.5" lengthAdjust="spacingAndGlyphs">HTTP/1.1 200 OK</text><text class="mono" x="596.0" y="435" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="596.0" y="473" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">{&quot;id&quot;: 7,</text><text class="mono" x="602.9" y="492" font-size="11.5" fill="#E6EAF2" textLength="144.9" lengthAdjust="spacingAndGlyphs">&quot;nombre&quot;: &quot;Ana Ruiz&quot;,</text><text class="mono" x="602.9" y="511" font-size="11.5" fill="#E6EAF2" textLength="193.2" lengthAdjust="spacingAndGlyphs">&quot;email&quot;: &quot;ana@icesi.edu.co&quot;}</text></g>
  <g class="an hp0"><rect x="370" y="197" width="37" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="380" cy="207" r="5" fill="#3A8235"/><text class="mono" x="391" y="207" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">7</text></g>
  <g class="an hp1"><rect x="370" y="235" width="83" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="380" cy="245" r="5" fill="#3A8235"/><text class="mono" x="391" y="245" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">Ana Ruiz</text></g>
  <g class="an hp2"><rect x="370" y="273" width="136" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="380" cy="283" r="5" fill="#3A8235"/><text class="mono" x="391" y="283" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">ana@icesi.edu.co</text></g>
  <rect x="48" y="568" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="596" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="596" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text><text x="100" y="591" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El repository trae de la base de datos la entidad Usuario con id 7.</text><text x="100" y="609" font-size="13" fill="#454C61" data-fit="790">Trae todas sus columnas, incluido el password cifrado.</text></g>
  <g class="an a2"><circle cx="76" cy="596" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="596" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text><text x="100" y="591" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Se crea un UsuarioResponseDTO vacío.</text><text x="100" y="609" font-size="13" fill="#454C61" data-fit="790">Es otra clase, con solo los campos que el cliente debe ver: id, nombre y email.</text></g>
  <g class="an a3"><circle cx="76" cy="596" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="596" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">3</text><text x="100" y="591" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Se copian los campos uno por uno, de la entidad al DTO.</text><text x="100" y="609" font-size="13" fill="#454C61" data-fit="790">El password se queda: el DTO no tiene un campo para él.</text></g>
  <g class="an a4"><circle cx="76" cy="596" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="596" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text><text x="100" y="591" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El controller retorna el DTO y Jackson lo convierte en JSON.</text><text x="100" y="609" font-size="13" fill="#454C61" data-fit="790">El cliente recibe id, nombre y email; la entidad nunca salió del servidor.</text></g>
  <g class="st"><text x="68" y="591" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Entity → DTO: se copia solo lo que el cliente debe ver.</text><text x="68" y="609" font-size="13" fill="#454C61" data-fit="820">La entidad se queda en el servidor; lo que viaja en el JSON es el DTO.</text></g>
  <text class="foot" x="48" y="652" data-fit="860">Esta copia campo por campo es la que MapStruct escribe por usted, en la lección siguiente.</text>
</svg>
```

## Entidad y DTO

Un DTO encapsula los datos que se intercambian entre el cliente y el servidor. Separa la representación externa de la entidad interna de base de datos.

```svg
<svg id="restDto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 408" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restDto-ttl restDto-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restDto-ttl">La entidad se queda adentro; los DTOs cruzan la frontera</title>
  <desc id="restDto-dsc">Tres columnas. UsuarioRequestDTO entra con POST /usuarios y trae nombre, email y password, pero no id, que lo genera la base de datos. En el centro la entidad Usuario, con id, nombre, email y password, vive en el servidor. UsuarioResponseDTO sale con GET /usuarios/7 y trae id, nombre y email, pero nunca el password.</desc>
  <defs>
    <style>
      #restDto .title{fill:#161A26;font-size:22px;font-weight:700}
      #restDto .sub{fill:#79809A;font-size:13.5px}
      #restDto .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restDto .foot{fill:#79809A;font-size:12px}
      #restDto .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restDto .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restDto-ar-slate)}
    </style>
    <marker id="restDto-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
  </defs>
  <rect width="960" height="408" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La entidad se queda adentro; los DTOs cruzan la frontera</text>
  <text class="sub" x="48" y="80" data-fit="860">El cliente nunca ve la entidad: manda un DTO de entrada y recibe uno de salida, cada uno con solo los campos que necesita.</text>
  <rect x="48" y="104" width="248" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="216">ENTRA · POST /usuarios</text>
  <rect x="64" y="136" width="216" height="40" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="172" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="200">UsuarioRequestDTO</text>
  <rect x="64" y="192" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="78" y="207" dy="0.35em" font-size="13" fill="#9AA3B5" text-decoration="line-through">id</text><text x="266" y="207" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="600" fill="#C2354F">lo genera la BD</text>
  <rect x="64" y="230" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="78" y="245" dy="0.35em" font-size="13" fill="#161A26">nombre</text>
  <rect x="64" y="268" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="78" y="283" dy="0.35em" font-size="13" fill="#161A26">email</text>
  <rect x="64" y="306" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#86D3CA" stroke-width="1.25"/><text class="mono" x="78" y="321" dy="0.35em" font-size="13" fill="#161A26">password</text>
  <rect x="356" y="104" width="248" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="372" y="128" data-fit="216">ADENTRO · @Entity</text>
  <rect x="372" y="136" width="216" height="40" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="2.5"/><text class="mono" x="480" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="200">Usuario</text>
  <rect x="372" y="192" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="386" y="207" dy="0.35em" font-size="13" fill="#161A26">id</text>
  <rect x="372" y="230" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="386" y="245" dy="0.35em" font-size="13" fill="#161A26">nombre</text>
  <rect x="372" y="268" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="386" y="283" dy="0.35em" font-size="13" fill="#161A26">email</text>
  <rect x="372" y="306" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.25"/><text class="mono" x="386" y="321" dy="0.35em" font-size="13" fill="#161A26">password</text>
  <rect x="664" y="104" width="248" height="248" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="680" y="128" data-fit="216">SALE · GET /usuarios/7</text>
  <rect x="680" y="136" width="216" height="40" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="788" y="156" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="200">UsuarioResponseDTO</text>
  <rect x="680" y="192" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="694" y="207" dy="0.35em" font-size="13" fill="#161A26">id</text>
  <rect x="680" y="230" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="694" y="245" dy="0.35em" font-size="13" fill="#161A26">nombre</text>
  <rect x="680" y="268" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="694" y="283" dy="0.35em" font-size="13" fill="#161A26">email</text>
  <rect x="680" y="306" width="216" height="30" rx="7" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.25" stroke-dasharray="4 4"/><text class="mono" x="694" y="321" dy="0.35em" font-size="13" fill="#9AA3B5" text-decoration="line-through">password</text><text x="882" y="321" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="600" fill="#C2354F">nunca sale</text>
  <path class="ar-slate" d="M300,228 H352"/><path class="ar-slate" d="M608,228 H660"/>
  <text x="326" y="216" text-anchor="middle" font-size="11.5" fill="#79809A">se copia</text>
  <text x="634" y="216" text-anchor="middle" font-size="11.5" fill="#79809A">se copia</text>
  <text class="foot" x="48" y="380" data-fit="860">Si el controller devolviera la entidad, el password viajaría en el JSON de la respuesta.</text>
</svg>
```

- No exponga directamente sus entidades. Use DTOs para controlar qué datos se intercambian.
- Separe DTOs de entrada (`Request`) y de salida (`Response`) cuando la estructura difiera.
- Incluya solo los campos necesarios para cada operación.
- Evite lógica de negocio en los DTOs — solo atributos y constructores.
- Nombre los DTOs claramente: `UsuarioRequestDTO`, `UsuarioResponseDTO` o simplemente `UsuarioDTO`.
- Organice los DTOs en un paquete `dto` separado.

```java
// DTO de entrada — lo que el cliente envía al servidor
public class UsuarioRequestDTO {
    private String nombre;
    private String email;
    private String password;
    // getters y setters
}

// DTO de salida — lo que el servidor devuelve al cliente
public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    // no incluye password
    // getters y setters
}
```
