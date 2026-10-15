# REST en movimiento

<!-- tags: idempotencia, stateless, representación, PUT vs POST, sesión vs token, POST duplicado, 401 en otro servidor, balanceador de carga, Representational State Transfer -->

Tres principios de REST que se entienden mejor viéndolos pasar: qué viaja de verdad por la red, qué pasa al repetir un request y por qué el servidor no debe recordar nada.

## Representación

El recurso vive en el servidor. Lo que el cliente recibe es una copia de su estado, una **representación**, casi siempre en JSON. Cambiar esa copia no cambia el recurso: para eso hay que transferirla de vuelta con un verbo como `PUT`. De ahí viene el nombre: *Representational State Transfer*.

```svg
<svg id="restRepresentacion" data-steps="4" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 572" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restRepresentacion-ttl restRepresentacion-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restRepresentacion-ttl">Lo que viaja es una representación</title>
  <desc id="restRepresentacion-dsc">Animación en cuatro pasos. Uno: el cliente pide GET /usuarios/7; el recurso es una fila de la tabla usuarios en el servidor. Dos: el servidor responde 200 con una copia de la fila en JSON. Tres: el cliente cambia el email en su copia y el recurso del servidor sigue igual. Cuatro: el cliente envía su representación con PUT /usuarios/7 y el servidor actualiza la fila.</desc>
  <defs>
    <style>
      #restRepresentacion .title{fill:#161A26;font-size:22px;font-weight:700}
      #restRepresentacion .sub{fill:#79809A;font-size:13.5px}
      #restRepresentacion .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restRepresentacion .foot{fill:#79809A;font-size:12px}
      #restRepresentacion .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restRepresentacion .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#restRepresentacion-ar-teal)}
      #restRepresentacion .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#restRepresentacion-ar-green)}
      #restRepresentacion .an,#restRepresentacion .ls,#restRepresentacion .st{animation-duration:16s;animation-iteration-count:infinite;animation-timing-function:linear}
      #restRepresentacion .an{opacity:0}
      #restRepresentacion .st{animation-name:restRepresentacion-hide}
      #restRepresentacion .a1{animation-name:restRepresentacion-a1}
      @keyframes restRepresentacion-a1{0%{opacity:0} 2%{opacity:1} 23%{opacity:1} 25%{opacity:0} 100%{opacity:0}}
      #restRepresentacion .a2{animation-name:restRepresentacion-a2}
      @keyframes restRepresentacion-a2{0%{opacity:0} 25%{opacity:0} 27%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #restRepresentacion .a3{animation-name:restRepresentacion-a3}
      @keyframes restRepresentacion-a3{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 73%{opacity:1} 75%{opacity:0} 100%{opacity:0}}
      #restRepresentacion .a4{animation-name:restRepresentacion-a4}
      @keyframes restRepresentacion-a4{0%{opacity:0} 75%{opacity:0} 77%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restRepresentacion .a234{animation-name:restRepresentacion-a234}
      @keyframes restRepresentacion-a234{0%{opacity:0} 25%{opacity:0} 27%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restRepresentacion .a34{animation-name:restRepresentacion-a34}
      @keyframes restRepresentacion-a34{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restRepresentacion .a123{animation-name:restRepresentacion-a123}
      @keyframes restRepresentacion-a123{0%{opacity:0} 2%{opacity:1} 73%{opacity:1} 75%{opacity:0} 100%{opacity:0}}
      #restRepresentacion .hp0{animation-name:restRepresentacion-hp0}
      @keyframes restRepresentacion-hp0{0%,2%{opacity:0;transform:translate(0,0)}3%{opacity:1;transform:translate(0,0)}13.75%{opacity:1;transform:translate(200px,0px)}22%{opacity:1;transform:translate(200px,0px)}23%,100%{opacity:0;transform:translate(200px,0px)}}
      #restRepresentacion .hp1{animation-name:restRepresentacion-hp1}
      @keyframes restRepresentacion-hp1{0%,27%{opacity:0;transform:translate(0,0)}28%{opacity:1;transform:translate(0,0)}38.75%{opacity:1;transform:translate(-196px,0px)}47%{opacity:1;transform:translate(-196px,0px)}48%,100%{opacity:0;transform:translate(-196px,0px)}}
      #restRepresentacion .hp2{animation-name:restRepresentacion-hp2}
      @keyframes restRepresentacion-hp2{0%,76.5%{opacity:0;transform:translate(0,0)}77.5%{opacity:1;transform:translate(0,0)}83.75%{opacity:1;transform:translate(200px,0px)}97%{opacity:1;transform:translate(200px,0px)}98%,100%{opacity:0;transform:translate(200px,0px)}}
      #restRepresentacion .hp3{animation-name:restRepresentacion-hp3}
      @keyframes restRepresentacion-hp3{0%,84.5%{opacity:0;transform:translate(0,0)}85.5%{opacity:1;transform:translate(0,0)}91.75%{opacity:1;transform:translate(-196px,0px)}97%{opacity:1;transform:translate(-196px,0px)}98%,100%{opacity:0;transform:translate(-196px,0px)}}
      @keyframes restRepresentacion-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#restRepresentacion .an,#restRepresentacion .ls,#restRepresentacion .st{animation:none}}
    </style>
    <marker id="restRepresentacion-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="restRepresentacion-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="572" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que viaja es una representación</text>
  <text class="sub" x="48" y="80" data-fit="860">Representational State Transfer: el recurso se queda en el servidor; por la red va una copia de su estado.</text>
  <rect x="48" y="112" width="248" height="64" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="172" y="135" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#0F8478" data-fit="232">Cliente</text><text x="172" y="154" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">navegador · app móvil · Postman</text>
  <rect x="664" y="112" width="248" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text x="788" y="135" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9" data-fit="232">Servidor REST</text><text x="788" y="154" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">Spring Boot · base de datos</text>
  <path class="ar-teal" d="M304,132 H654"/><path class="ar-green" d="M656,156 H306"/>
  <text class="h" x="480" y="116" text-anchor="middle">REQUEST →</text>
  <text class="h" x="480" y="180" text-anchor="middle">← RESPONSE</text>
  <rect x="48" y="192" width="248" height="260" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="216" data-fit="216">LA COPIA DEL CLIENTE</text>
  <g class="an a1"><rect x="64" y="232" width="216" height="124" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="172" y="294" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">todavía no tiene nada</text></g>
  <g class="ls a234"><rect x="64" y="232" width="216" height="124" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="76.0" y="258" font-size="11.5" fill="#161A26">{</text><text class="mono" x="89.8" y="278" font-size="11.5" fill="#161A26">&quot;id&quot;: 7,</text><text class="mono" x="89.8" y="298" font-size="11.5" fill="#161A26">&quot;nombre&quot;: &quot;Ana Gómez&quot;,</text><text class="mono" x="76" y="338" font-size="11.5" fill="#161A26">}</text></g>
  <text class="mono an a2" x="89.8" y="318" font-size="11.5" fill="#161A26">"email": "ana@icesi.edu"</text>
  <g class="ls a34"><rect x="84" y="304" width="190" height="20" rx="5" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="89.8" y="318" font-size="11.5" fill="#161A26" textLength="179.4" lengthAdjust="spacingAndGlyphs">"email": "ana.g@icesi.edu"</text></g>
  <text class="an a3" x="172" y="384" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">editada solo aquí</text>
  <text class="ls a4" x="172" y="384" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">enviada de vuelta con PUT</text>
  <rect x="312" y="192" width="336" height="260" rx="10" fill="#1F2430"/>
  <path d="M312,202 A10,10 0 0 1 322,192 H638 A10,10 0 0 1 648,202 V218 H312 Z" fill="#2A3040"/>
  <g class="an a1"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><text class="mono" x="324.0" y="240" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">GET /usuarios/7 HTTP/1.1</text><text class="mono" x="324.0" y="259" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">Accept: application/json</text></g>
  <g class="an a2"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5">response</text><rect x="316.0" y="226" width="328.0" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="324.0" y="240" font-size="11.5" fill="#E6EAF2" textLength="103.5" lengthAdjust="spacingAndGlyphs">HTTP/1.1 200 OK</text><text class="mono" x="324.0" y="259" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="324.0" y="297" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">{&quot;id&quot;: 7,</text><text class="mono" x="330.9" y="316" font-size="11.5" fill="#E6EAF2" textLength="151.8" lengthAdjust="spacingAndGlyphs">&quot;nombre&quot;: &quot;Ana Gómez&quot;,</text><text class="mono" x="330.9" y="335" font-size="11.5" fill="#E6EAF2" textLength="172.5" lengthAdjust="spacingAndGlyphs">&quot;email&quot;: &quot;ana@icesi.edu&quot;}</text></g>
  <g class="an a3"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5"></text><text class="mono" x="324.0" y="240" font-size="11.5" fill="#8C95AA" textLength="241.5" lengthAdjust="spacingAndGlyphs">(no viaja nada: el cambio es local)</text></g>
  <g class="ls a4"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5">request · response</text><rect x="321.0" y="226" width="26.7" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><rect x="316.0" y="321" width="328.0" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><rect x="316.0" y="359" width="328.0" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="324.0" y="240" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">PUT /usuarios/7 HTTP/1.1</text><text class="mono" x="324.0" y="259" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="324.0" y="297" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">{&quot;id&quot;: 7,</text><text class="mono" x="330.9" y="316" font-size="11.5" fill="#E6EAF2" textLength="151.8" lengthAdjust="spacingAndGlyphs">&quot;nombre&quot;: &quot;Ana Gómez&quot;,</text><text class="mono" x="330.9" y="335" font-size="11.5" fill="#E6EAF2" textLength="186.3" lengthAdjust="spacingAndGlyphs">&quot;email&quot;: &quot;ana.g@icesi.edu&quot;}</text><text class="mono" x="324.0" y="373" font-size="11.5" fill="#E6EAF2" textLength="103.5" lengthAdjust="spacingAndGlyphs">HTTP/1.1 200 OK</text></g>
  <rect x="664" y="192" width="248" height="260" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="680" y="216" data-fit="216">EL RECURSO · TABLA usuarios</text>
  <rect x="680" y="232" width="216" height="32" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><text x="692" y="248" dy="0.35em" font-size="11.5" font-weight="600" fill="#79809A">id</text><text class="mono" x="752" y="248" dy="0.35em" font-size="12" fill="#161A26">7</text>
  <rect x="680" y="272" width="216" height="32" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><text x="692" y="288" dy="0.35em" font-size="11.5" font-weight="600" fill="#79809A">nombre</text><text class="mono" x="752" y="288" dy="0.35em" font-size="12" fill="#161A26">Ana Gómez</text>
  <rect x="680" y="312" width="216" height="32" rx="7" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.25"/><text x="692" y="328" dy="0.35em" font-size="11.5" font-weight="600" fill="#79809A">email</text>
  <text class="mono an a123" x="752" y="328" dy="0.35em" font-size="12" fill="#161A26">ana@icesi.edu</text>
  <g class="ls a4"><rect x="746" y="318" width="144" height="20" rx="5" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="752" y="328" dy="0.35em" font-size="12" fill="#161A26">ana.g@icesi.edu</text></g>
  <g class="an a2"><rect x="680" y="368" width="216" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="788" y="391" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="200">Serializa la fila</text><text x="788" y="410" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">a JSON para enviarla</text></g>
  <g class="an a3"><rect x="680" y="368" width="216" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="788" y="391" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="200">Sin cambios</text><text x="788" y="410" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">el servidor no se enteró</text></g>
  <g class="ls a4"><rect x="680" y="368" width="216" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="788" y="391" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="200">Fila actualizada</text><text x="788" y="410" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">por el PUT, no por la copia</text></g>
  <rect class="an a1" x="674" y="226" width="228" height="124" rx="12" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a2" x="58" y="226" width="228" height="136" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a3" x="58" y="226" width="228" height="136" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a4" x="674" y="226" width="228" height="124" rx="12" fill="none" stroke="#7439B8" stroke-width="3"/>
  <g class="an hp0"><rect x="306" y="122" width="129" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="316" cy="132" r="5" fill="#0F8478"/><text class="mono" x="327" y="132" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /usuarios/7</text></g>
  <g class="an hp1"><rect x="510" y="146" width="116" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="520" cy="156" r="5" fill="#3A8235"/><text class="mono" x="531" y="156" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">200 OK · JSON</text></g>
  <g class="an hp2"><rect x="306" y="122" width="129" height="20" rx="10" fill="#FFFFFF" stroke="#7439B8" stroke-width="1.5"/><circle cx="316" cy="132" r="5" fill="#7439B8"/><text class="mono" x="327" y="132" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">PUT /usuarios/7</text></g>
  <g class="an hp3"><rect x="510" y="146" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="520" cy="156" r="5" fill="#3A8235"/><text class="mono" x="531" y="156" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">200 OK</text></g>
  <rect x="48" y="468" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="496" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El cliente pide el recurso: GET /usuarios/7.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">El recurso vive en el servidor, como una fila de la tabla usuarios.</text></g>
  <g class="an a2"><circle cx="76" cy="496" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">2</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El servidor responde con una representación: una copia de la fila en JSON.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">Eso es lo que viaja. El recurso se queda donde estaba.</text></g>
  <g class="an a3"><circle cx="76" cy="496" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El cliente cambia el email en su copia.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">En el servidor nada cambió: la copia y el recurso ya no coinciden.</text></g>
  <g class="an a4"><circle cx="76" cy="496" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">4</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Para cambiar el recurso, el cliente transfiere su representación con PUT.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">El servidor la aplica a la fila: se transfiere el estado como representación.</text></g>
  <g class="st"><text x="68" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Representational State Transfer: lo que viaja es una representación del estado del recurso.</text><text x="68" y="509" font-size="13" fill="#454C61" data-fit="820">La animación recorre una lectura, un cambio local y un PUT.</text></g>
  <text class="foot" x="48" y="544" data-fit="860">La misma fila podría representarse en XML o en HTML; JSON es solo la representación más común.</text>
</svg>
```

## Idempotencia

Un request es **idempotente** si enviarlo una vez o varias deja el servidor en el mismo estado. `GET`, `PUT` y `DELETE` lo son; `POST` no, porque cada envío crea algo nuevo. Fíjese en el último paso: la respuesta puede cambiar (de `204` a `404`) sin que el método deje de ser idempotente.

```svg
<svg id="restIdempotencia" data-steps="7" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 592" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restIdempotencia-ttl restIdempotencia-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restIdempotencia-ttl">Idempotencia: repetir sin cambiar el resultado</title>
  <desc id="restIdempotencia-dsc">Animación en siete pasos con el request a la izquierda y la tabla usuarios a la derecha. Caso POST: tres envíos del mismo POST /usuarios crean tres usuarios Juan, 8, 9 y 10; no es idempotente. Caso PUT: PUT /usuarios/7 cambia el email una vez y los envíos siguientes dejan la fila igual; es idempotente. Caso DELETE: el primer DELETE /usuarios/7 borra la fila con 204 y el segundo responde 404, pero el estado no cambia; es idempotente.</desc>
  <defs>
    <style>
      #restIdempotencia .title{fill:#161A26;font-size:22px;font-weight:700}
      #restIdempotencia .sub{fill:#79809A;font-size:13.5px}
      #restIdempotencia .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restIdempotencia .foot{fill:#79809A;font-size:12px}
      #restIdempotencia .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restIdempotencia .an,#restIdempotencia .ls,#restIdempotencia .st{animation-duration:28s;animation-iteration-count:infinite;animation-timing-function:linear}
      #restIdempotencia .an{opacity:0}
      #restIdempotencia .st{animation-name:restIdempotencia-hide}
      #restIdempotencia .a1{animation-name:restIdempotencia-a1}
      @keyframes restIdempotencia-a1{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a2{animation-name:restIdempotencia-a2}
      @keyframes restIdempotencia-a2{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a3{animation-name:restIdempotencia-a3}
      @keyframes restIdempotencia-a3{0%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a4{animation-name:restIdempotencia-a4}
      @keyframes restIdempotencia-a4{0%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a5{animation-name:restIdempotencia-a5}
      @keyframes restIdempotencia-a5{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a6{animation-name:restIdempotencia-a6}
      @keyframes restIdempotencia-a6{0%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a7{animation-name:restIdempotencia-a7}
      @keyframes restIdempotencia-a7{0%{opacity:0} 85.71%{opacity:0} 87.71%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restIdempotencia .a13{animation-name:restIdempotencia-a13}
      @keyframes restIdempotencia-a13{0%{opacity:0} 2%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a23{animation-name:restIdempotencia-a23}
      @keyframes restIdempotencia-a23{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a15{animation-name:restIdempotencia-a15}
      @keyframes restIdempotencia-a15{0%{opacity:0} 2%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a45{animation-name:restIdempotencia-a45}
      @keyframes restIdempotencia-a45{0%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #restIdempotencia .a67{animation-name:restIdempotencia-a67}
      @keyframes restIdempotencia-a67{0%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restIdempotencia .a1246{animation-name:restIdempotencia-a1246}
      @keyframes restIdempotencia-a1246{0%{opacity:0} 2%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      @keyframes restIdempotencia-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#restIdempotencia .an,#restIdempotencia .ls,#restIdempotencia .st{animation:none}}
    </style>
  </defs>
  <rect width="960" height="592" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Idempotencia: repetir sin cambiar el resultado</text>
  <text class="sub" x="48" y="80" data-fit="860">Un request es idempotente si enviarlo una vez o tres deja el servidor en el mismo estado.</text>
  <g class="an a13"><rect x="692" y="36" width="220" height="28" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="204">CASO 1 · POST</text></g>
  <g class="an a45"><rect x="692" y="36" width="220" height="28" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="204">CASO 2 · PUT</text></g>
  <g class="ls a67"><rect x="692" y="36" width="220" height="28" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="204">CASO 3 · DELETE</text></g>
  <rect x="48" y="104" width="360" height="360" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="328">EL MISMO REQUEST, OTRA VEZ</text>
  <rect x="64" y="136" width="328" height="148" rx="10" fill="#1F2430"/>
  <path d="M64,146 A10,10 0 0 1 74,136 H382 A10,10 0 0 1 392,146 V162 H64 Z" fill="#2A3040"/>
  <g class="an a13"><text class="mono" x="76" y="149" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><rect x="73.0" y="170" width="33.6" height="21" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="76.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="96.6" lengthAdjust="spacingAndGlyphs">POST /usuarios</text><text class="mono" x="76.0" y="203" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="76.0" y="241" font-size="11.5" fill="#E6EAF2" textLength="124.2" lengthAdjust="spacingAndGlyphs">{&quot;nombre&quot;: &quot;Juan&quot;,</text><text class="mono" x="82.9" y="260" font-size="11.5" fill="#E6EAF2" textLength="179.4" lengthAdjust="spacingAndGlyphs">&quot;email&quot;: &quot;juan@icesi.edu&quot;}</text></g>
  <g class="an a45"><text class="mono" x="76" y="149" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><rect x="73.0" y="170" width="26.7" height="21" rx="5" fill="#C9A6EE" fill-opacity=".3" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="76.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="103.5" lengthAdjust="spacingAndGlyphs">PUT /usuarios/7</text><text class="mono" x="76.0" y="203" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="76.0" y="241" font-size="11.5" fill="#E6EAF2" textLength="158.7" lengthAdjust="spacingAndGlyphs">{&quot;nombre&quot;: &quot;Ana Gómez&quot;,</text><text class="mono" x="82.9" y="260" font-size="11.5" fill="#E6EAF2" textLength="186.3" lengthAdjust="spacingAndGlyphs">&quot;email&quot;: &quot;ana.g@icesi.edu&quot;}</text></g>
  <g class="ls a67"><text class="mono" x="76" y="149" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><rect x="73.0" y="170" width="47.4" height="21" rx="5" fill="#F3A3B2" fill-opacity=".3" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="76.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="124.2" lengthAdjust="spacingAndGlyphs">DELETE /usuarios/7</text><text class="mono" x="76.0" y="222" font-size="11.5" fill="#8C95AA" textLength="69.0" lengthAdjust="spacingAndGlyphs">(sin body)</text></g>
  <text class="h" x="64" y="326">ENVÍOS</text>
  <g class="an a1"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">1 de 3</text></g>
  <g class="an a2"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">2 de 3</text></g>
  <g class="an a3"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">3 de 3</text></g>
  <g class="an a4"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">1 de 3</text></g>
  <g class="an a5"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">3 de 3</text></g>
  <g class="an a6"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">1 de 3</text></g>
  <g class="ls a7"><circle cx="148" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="176" cy="322" r="9" fill="#4453C9" stroke="#4453C9" stroke-width="1.5"/><circle cx="204" cy="322" r="9" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">2 de 3</text></g>
  <text class="h" x="64" y="364">RESPUESTA</text>
  <g class="an a1"><rect x="64" y="376" width="328" height="72" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="312">201 Created</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">creó el usuario 8</text></g>
  <g class="an a2"><rect x="64" y="376" width="328" height="72" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="312">201 Created</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">creó el usuario 9</text></g>
  <g class="an a3"><rect x="64" y="376" width="328" height="72" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="312">201 Created</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">creó el usuario 10</text></g>
  <g class="an a4"><rect x="64" y="376" width="328" height="72" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="312">200 OK</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">actualizó el usuario 7</text></g>
  <g class="an a5"><rect x="64" y="376" width="328" height="72" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="312">200 OK</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">la fila ya tenía esos valores</text></g>
  <g class="an a6"><rect x="64" y="376" width="328" height="72" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="312">204 No Content</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">borró el usuario 7</text></g>
  <g class="ls a7"><rect x="64" y="376" width="328" height="72" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="228" y="403" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#C2354F" data-fit="312">404 Not Found</text><text x="228" y="422" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="312">el usuario 7 ya no existe</text></g>
  <rect x="432" y="104" width="480" height="360" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="448" y="128" data-fit="448">TABLA usuarios</text>
  <text x="462" y="152" font-size="11" font-weight="700" fill="#9AA3B5">id</text>
  <text x="504" y="152" font-size="11" font-weight="700" fill="#9AA3B5">nombre</text>
  <text x="664" y="152" font-size="11" font-weight="700" fill="#9AA3B5">email</text>
  <rect x="448" y="164" width="448" height="36" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/><text class="mono" x="462" y="182" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">6</text><text x="504" y="182" dy="0.35em" font-size="13" fill="#161A26">Luis Pérez</text><text class="mono" x="664" y="182" dy="0.35em" font-size="12" fill="#454C61">luis@icesi.edu</text>
  <g class="an a15"><rect x="448" y="208" width="448" height="36" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/><text class="mono" x="462" y="226" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">7</text><text x="504" y="226" dy="0.35em" font-size="13" fill="#161A26">Ana Gómez</text></g>
  <text class="mono an a13" x="664" y="226" dy="0.35em" font-size="12" fill="#454C61">ana@icesi.edu</text>
  <g class="an a45"><rect x="656" y="214" width="132" height="24" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="664" y="226" dy="0.35em" font-size="12" fill="#161A26">ana.g@icesi.edu</text></g>
  <g class="ls a67"><rect x="448" y="208" width="448" height="36" rx="8" fill="#FFFFFF" stroke="#F3A3B2" stroke-width="1.5" stroke-dasharray="5 5"/><text class="mono" x="462" y="226" dy="0.35em" font-size="12.5" fill="#9AA3B5" text-decoration="line-through">7  Ana Gómez</text><text x="880" y="226" dy="0.35em" text-anchor="end" font-size="12" font-weight="700" fill="#C2354F">eliminado</text></g>
  <g class="an a13"><rect x="448" y="252" width="448" height="36" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="462" y="270" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">8</text><text x="504" y="270" dy="0.35em" font-size="13" fill="#161A26">Juan</text><text class="mono" x="664" y="270" dy="0.35em" font-size="12" fill="#454C61">juan@icesi.edu</text></g>
  <g class="an a23"><rect x="448" y="296" width="448" height="36" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text class="mono" x="462" y="314" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">9</text><text x="504" y="314" dy="0.35em" font-size="13" fill="#161A26">Juan</text><text class="mono" x="664" y="314" dy="0.35em" font-size="12" fill="#454C61">juan@icesi.edu</text></g>
  <g class="an a3"><rect x="448" y="340" width="448" height="36" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text class="mono" x="462" y="358" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">10</text><text x="504" y="358" dy="0.35em" font-size="13" fill="#161A26">Juan</text><text class="mono" x="664" y="358" dy="0.35em" font-size="12" fill="#454C61">juan@icesi.edu</text></g>
  <text class="an a2" x="880" y="314" dy="0.35em" text-anchor="end" font-size="12" font-weight="700" fill="#C2354F">duplicado</text>
  <text class="an a3" x="880" y="358" dy="0.35em" text-anchor="end" font-size="12" font-weight="700" fill="#C2354F">duplicado</text>
  <rect class="an a1" x="442" y="246" width="460" height="48" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a2" x="442" y="290" width="460" height="48" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a3" x="442" y="334" width="460" height="48" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a4" x="442" y="202" width="460" height="48" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a5" x="442" y="202" width="460" height="48" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a6" x="442" y="202" width="460" height="48" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a7" x="442" y="202" width="460" height="48" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <g class="an a1246"><rect x="448" y="396" width="448" height="52" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="672" y="422" dy="0.35em" text-anchor="middle" font-size="13" fill="#79809A">¿Repetirlo cambia el estado?</text></g>
  <g class="an a3"><rect x="448" y="396" width="448" height="52" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="672" y="413" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#C2354F" data-fit="432">POST no es idempotente</text><text x="672" y="432" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="432">tres envíos, tres usuarios</text></g>
  <g class="an a5"><rect x="448" y="396" width="448" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="672" y="413" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="432">PUT es idempotente</text><text x="672" y="432" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="432">uno o tres envíos: el mismo estado</text></g>
  <g class="ls a7"><rect x="448" y="396" width="448" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="672" y="413" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="432">DELETE es idempotente</text><text x="672" y="432" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="432">la respuesta cambió; el estado no</text></g>
  <rect x="48" y="480" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="508" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">1</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 1 · El cliente envía POST /usuarios con los datos de Juan.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">El servidor crea el usuario 8 y responde 201 Created.</text></g>
  <g class="an a2"><circle cx="76" cy="508" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">2</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">La red falla antes de que llegue la respuesta y el cliente reintenta.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">El mismo POST crea otro usuario, el 9: un duplicado.</text></g>
  <g class="an a3"><circle cx="76" cy="508" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">3</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Un tercer intento crea un tercer Juan.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">POST no es idempotente: cada envío vuelve a cambiar el estado.</text></g>
  <g class="an a4"><circle cx="76" cy="508" r="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">4</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 2 · PUT /usuarios/7 reemplaza al usuario 7 con un email nuevo.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">El estado cambia una vez: 200 OK.</text></g>
  <g class="an a5"><circle cx="76" cy="508" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">5</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Se envía el mismo PUT dos veces más.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">La fila ya tiene esos valores y queda idéntica. PUT es idempotente.</text></g>
  <g class="an a6"><circle cx="76" cy="508" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">6</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 3 · DELETE /usuarios/7 elimina al usuario.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">Responde 204 No Content.</text></g>
  <g class="an a7"><circle cx="76" cy="508" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="508" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">7</text><text x="100" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El mismo DELETE otra vez responde 404: ya no existe.</text><text x="100" y="521" font-size="13" fill="#454C61" data-fit="790">La respuesta cambió, pero el estado no. Idempotencia habla del estado, no de la respuesta.</text></g>
  <g class="st"><text x="68" y="503" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Idempotente: repetir el request deja el servidor en el mismo estado que enviarlo una vez.</text><text x="68" y="521" font-size="13" fill="#454C61" data-fit="820">GET, PUT y DELETE lo son; POST no.</text></g>
  <text class="foot" x="48" y="564" data-fit="860">Por eso un cliente puede reintentar un PUT o un DELETE sin miedo; un POST repetido puede duplicar datos.</text>
</svg>
```

Importa porque las redes fallan. Si un cliente no sabe si su request llegó, puede reintentar un `PUT` o un `DELETE` con tranquilidad; un `POST` repetido puede duplicar datos.

## Stateless

En REST el servidor no guarda estado del cliente entre un request y el siguiente: cada request trae todo lo que se necesita para atenderlo, incluida la identidad del usuario. Así, cuando la aplicación corre en varias instancias, a cualquiera le puede tocar responder.

```svg
<svg id="restStateless" data-steps="4" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restStateless-ttl restStateless-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restStateless-ttl">Stateless: cualquier servidor puede responder</title>
  <desc id="restStateless-dsc">Animación en cuatro pasos con un cliente, un balanceador y dos instancias de la misma aplicación. Caso con sesión: el primer request con la cookie ABC123 llega a A, que guarda esa sesión, y responde 200; el siguiente cae en B, que no conoce la sesión, y responde 401. Caso stateless: el request trae un token firmado; A lo verifica y responde 200, y cuando el siguiente cae en B, B también lo verifica y responde 200.</desc>
  <defs>
    <style>
      #restStateless .title{fill:#161A26;font-size:22px;font-weight:700}
      #restStateless .sub{fill:#79809A;font-size:13.5px}
      #restStateless .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restStateless .foot{fill:#79809A;font-size:12px}
      #restStateless .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restStateless .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#restStateless-ar-teal)}
      #restStateless .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restStateless-ar-slate)}
      #restStateless .an,#restStateless .ls,#restStateless .st{animation-duration:16s;animation-iteration-count:infinite;animation-timing-function:linear}
      #restStateless .an{opacity:0}
      #restStateless .st{animation-name:restStateless-hide}
      #restStateless .a1{animation-name:restStateless-a1}
      @keyframes restStateless-a1{0%{opacity:0} 2%{opacity:1} 23%{opacity:1} 25%{opacity:0} 100%{opacity:0}}
      #restStateless .a2{animation-name:restStateless-a2}
      @keyframes restStateless-a2{0%{opacity:0} 25%{opacity:0} 27%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #restStateless .a3{animation-name:restStateless-a3}
      @keyframes restStateless-a3{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 73%{opacity:1} 75%{opacity:0} 100%{opacity:0}}
      #restStateless .a4{animation-name:restStateless-a4}
      @keyframes restStateless-a4{0%{opacity:0} 75%{opacity:0} 77%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restStateless .a12{animation-name:restStateless-a12}
      @keyframes restStateless-a12{0%{opacity:0} 2%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #restStateless .a34{animation-name:restStateless-a34}
      @keyframes restStateless-a34{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restStateless .hp0{animation-name:restStateless-hp0}
      @keyframes restStateless-hp0{0%,1.5%{opacity:0;transform:translate(0,0)}2.5%{opacity:1;transform:translate(0,0)}8.75%{opacity:1;transform:translate(60px,0px)}22%{opacity:1;transform:translate(60px,0px)}23%,100%{opacity:0;transform:translate(60px,0px)}}
      #restStateless .hp1{animation-name:restStateless-hp1}
      @keyframes restStateless-hp1{0%,9.5%{opacity:0;transform:translate(0,0)}10.5%{opacity:1;transform:translate(0,0)}16.75%{opacity:1;transform:translate(72px,-92px)}22%{opacity:1;transform:translate(72px,-92px)}23%,100%{opacity:0;transform:translate(72px,-92px)}}
      #restStateless .hp2{animation-name:restStateless-hp2}
      @keyframes restStateless-hp2{0%,26.5%{opacity:0;transform:translate(0,0)}27.5%{opacity:1;transform:translate(0,0)}33.75%{opacity:1;transform:translate(60px,0px)}47%{opacity:1;transform:translate(60px,0px)}48%,100%{opacity:0;transform:translate(60px,0px)}}
      #restStateless .hp3{animation-name:restStateless-hp3}
      @keyframes restStateless-hp3{0%,34.5%{opacity:0;transform:translate(0,0)}35.5%{opacity:1;transform:translate(0,0)}41.75%{opacity:1;transform:translate(72px,64px)}47%{opacity:1;transform:translate(72px,64px)}48%,100%{opacity:0;transform:translate(72px,64px)}}
      #restStateless .hp4{animation-name:restStateless-hp4}
      @keyframes restStateless-hp4{0%,51.5%{opacity:0;transform:translate(0,0)}52.5%{opacity:1;transform:translate(0,0)}58.75%{opacity:1;transform:translate(60px,0px)}72%{opacity:1;transform:translate(60px,0px)}73%,100%{opacity:0;transform:translate(60px,0px)}}
      #restStateless .hp5{animation-name:restStateless-hp5}
      @keyframes restStateless-hp5{0%,59.5%{opacity:0;transform:translate(0,0)}60.5%{opacity:1;transform:translate(0,0)}66.75%{opacity:1;transform:translate(72px,-92px)}72%{opacity:1;transform:translate(72px,-92px)}73%,100%{opacity:0;transform:translate(72px,-92px)}}
      #restStateless .hp6{animation-name:restStateless-hp6}
      @keyframes restStateless-hp6{0%,76.5%{opacity:0;transform:translate(0,0)}77.5%{opacity:1;transform:translate(0,0)}83.75%{opacity:1;transform:translate(60px,0px)}97%{opacity:1;transform:translate(60px,0px)}98%,100%{opacity:0;transform:translate(60px,0px)}}
      #restStateless .hp7{animation-name:restStateless-hp7}
      @keyframes restStateless-hp7{0%,84.5%{opacity:0;transform:translate(0,0)}85.5%{opacity:1;transform:translate(0,0)}91.75%{opacity:1;transform:translate(72px,64px)}97%{opacity:1;transform:translate(72px,64px)}98%,100%{opacity:0;transform:translate(72px,64px)}}
      @keyframes restStateless-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#restStateless .an,#restStateless .ls,#restStateless .st{animation:none}}
    </style>
    <marker id="restStateless-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="restStateless-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
  </defs>
  <rect width="960" height="560" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Stateless: cualquier servidor puede responder</text>
  <text class="sub" x="48" y="80" data-fit="860">Si el request trae todo lo que hace falta, no importa a cuál instancia de la aplicación le toque.</text>
  <g class="an a12"><rect x="692" y="36" width="220" height="28" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="204">CASO 1 · CON SESIÓN</text></g>
  <g class="ls a34"><rect x="692" y="36" width="220" height="28" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="802" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235" data-fit="204">CASO 2 · STATELESS</text></g>
  <rect x="48" y="104" width="312" height="104" rx="10" fill="#1F2430"/>
  <path d="M48,114 A10,10 0 0 1 58,104 H350 A10,10 0 0 1 360,114 V130 H48 Z" fill="#2A3040"/>
  <g class="an a12"><text class="mono" x="60" y="117" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><rect x="52.0" y="157" width="304.0" height="21" rx="5" fill="#86D3CA" fill-opacity=".3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="60.0" y="152" font-size="11.5" fill="#E6EAF2" textLength="138.0" lengthAdjust="spacingAndGlyphs">GET /cursos HTTP/1.1</text><text class="mono" x="60.0" y="171" font-size="11.5" fill="#E6EAF2" textLength="172.5" lengthAdjust="spacingAndGlyphs">Cookie: JSESSIONID=ABC123</text></g>
  <g class="ls a34"><text class="mono" x="60" y="117" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><rect x="52.0" y="157" width="304.0" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="60.0" y="152" font-size="11.5" fill="#E6EAF2" textLength="138.0" lengthAdjust="spacingAndGlyphs">GET /cursos HTTP/1.1</text><text class="mono" x="60.0" y="171" font-size="11.5" fill="#E6EAF2" textLength="213.9" lengthAdjust="spacingAndGlyphs">Authorization: Bearer eyJhbGci…</text></g>
  <rect x="48" y="232" width="168" height="64" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="132" y="264" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#0F8478" data-fit="152">Cliente</text>
  <rect x="360" y="232" width="168" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="444" y="255" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="152">Balanceador</text><text x="444" y="274" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">reparte los requests</text>
  <text class="h" x="704" y="104">DOS INSTANCIAS DE LA APP</text>
  <rect x="704" y="120" width="208" height="56" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="808" y="139" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9" data-fit="192">Servidor A</text><text x="808" y="158" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="192">instancia 1</text>
  <rect x="704" y="312" width="208" height="56" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="808" y="331" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9" data-fit="192">Servidor B</text><text x="808" y="350" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="192">instancia 2</text>
  <path class="ar-teal" d="M216,264 H356"/>
  <path class="ar-slate" d="M528,256 C616,256 616,148 700,148"/><path class="ar-slate" d="M528,272 C616,272 616,340 700,340"/>
  <g class="an a12"><rect x="704" y="184" width="208" height="48" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="808" y="199" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="192">ABC123 → ana</text><text x="808" y="218" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="192">sesión en memoria</text></g>
  <g class="an a12"><rect x="704" y="376" width="208" height="48" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="808" y="391" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="192">ninguna sesión</text><text x="808" y="410" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="192">memoria vacía</text></g>
  <g class="ls a34"><rect x="704" y="184" width="208" height="48" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="808" y="199" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="192">clave de firma</text><text x="808" y="218" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="192">ninguna sesión</text></g>
  <g class="ls a34"><rect x="704" y="376" width="208" height="48" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="808" y="391" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074" data-fit="192">clave de firma</text><text x="808" y="410" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="192">ninguna sesión</text></g>
  <g class="an a1"><rect x="48" y="312" width="168" height="60" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="132" y="333" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="152">200 OK</text><text x="132" y="352" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">A tenía la sesión</text></g>
  <g class="an a2"><rect x="48" y="312" width="168" height="60" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text class="mono" x="132" y="333" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#C2354F" data-fit="152">401</text><text x="132" y="352" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">B no conoce ABC123</text></g>
  <g class="an a3"><rect x="48" y="312" width="168" height="60" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="132" y="333" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="152">200 OK</text><text x="132" y="352" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">A verificó el token</text></g>
  <g class="ls a4"><rect x="48" y="312" width="168" height="60" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="132" y="333" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="152">200 OK</text><text x="132" y="352" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="152">B verificó el token</text></g>
  <rect class="an a1" x="698" y="114" width="220" height="124" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a2" x="698" y="306" width="220" height="124" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a3" x="698" y="114" width="220" height="124" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a4" x="698" y="306" width="220" height="124" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <g class="an hp0"><rect x="218" y="254" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="228" cy="264" r="5" fill="#0F8478"/><text class="mono" x="239" y="264" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">ABC123</text></g>
  <g class="an hp1"><rect x="534" y="246" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="544" cy="256" r="5" fill="#0F8478"/><text class="mono" x="555" y="256" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">ABC123</text></g>
  <g class="an hp2"><rect x="218" y="254" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="228" cy="264" r="5" fill="#0F8478"/><text class="mono" x="239" y="264" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">ABC123</text></g>
  <g class="an hp3"><rect x="534" y="262" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="544" cy="272" r="5" fill="#0F8478"/><text class="mono" x="555" y="272" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">ABC123</text></g>
  <g class="an hp4"><rect x="218" y="254" width="56" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="228" cy="264" r="5" fill="#3A8235"/><text class="mono" x="239" y="264" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">eyJ…</text></g>
  <g class="an hp5"><rect x="534" y="246" width="56" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="544" cy="256" r="5" fill="#3A8235"/><text class="mono" x="555" y="256" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">eyJ…</text></g>
  <g class="an hp6"><rect x="218" y="254" width="56" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="228" cy="264" r="5" fill="#3A8235"/><text class="mono" x="239" y="264" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">eyJ…</text></g>
  <g class="an hp7"><rect x="534" y="262" width="56" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="544" cy="272" r="5" fill="#3A8235"/><text class="mono" x="555" y="272" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">eyJ…</text></g>
  <rect x="48" y="448" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="476" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="476" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text><text x="100" y="471" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 1 · Con sesión. El cliente envía su cookie y el balanceador lo manda a A.</text><text x="100" y="489" font-size="13" fill="#454C61" data-fit="790">A guardó la sesión ABC123 en su memoria al hacer login: responde 200.</text></g>
  <g class="an a2"><circle cx="76" cy="476" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="476" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">2</text><text x="100" y="471" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El siguiente request cae en B, con la misma cookie.</text><text x="100" y="489" font-size="13" fill="#454C61" data-fit="790">La sesión vive en la memoria de A; B no la conoce y responde 401.</text></g>
  <g class="an a3"><circle cx="76" cy="476" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="476" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">3</text><text x="100" y="471" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 2 · Stateless. El request trae un token firmado en Authorization.</text><text x="100" y="489" font-size="13" fill="#454C61" data-fit="790">A verifica la firma con su clave: no necesita recordar nada.</text></g>
  <g class="an a4"><circle cx="76" cy="476" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="476" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text><text x="100" y="471" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El siguiente request cae en B, y B también lo acepta.</text><text x="100" y="489" font-size="13" fill="#454C61" data-fit="790">Cualquier instancia puede responder, porque el request trae todo lo que hace falta.</text></g>
  <g class="st"><text x="68" y="471" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Stateless: el servidor no guarda nada entre requests; cada uno trae todo lo que necesita.</text><text x="68" y="489" font-size="13" fill="#454C61" data-fit="820">Por eso una API REST escala agregando instancias.</text></g>
  <text class="foot" x="48" y="532" data-fit="860">El token firmado (JWT) se ve en detalle en «Auth en REST», la semana 12.</text>
</svg>
```
