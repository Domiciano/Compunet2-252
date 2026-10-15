# ¿Qué es REST?

## Arquitectura REST

REST (Representational State Transfer) es un estilo de arquitectura para servicios web. Define cómo los sistemas se comunican a través de HTTP usando recursos identificados por URLs y verbos estándar.

```svg
<svg id="restCiclo" data-steps="4" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 572" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restCiclo-ttl restCiclo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restCiclo-ttl">Un request REST, de ida y vuelta</title>
  <desc id="restCiclo-dsc">Animación en cuatro pasos con el cliente a la izquierda, los mensajes HTTP en el centro y el servidor REST a la derecha. Uno: el cliente envía GET /usuarios/7. Dos: el servidor ubica el recurso usuarios con id 7 y ejecuta la lectura sin consultar ninguna sesión. Tres: responde 200 OK con el usuario en JSON y el cliente lo muestra. Cuatro: sobre la misma URL, el cliente envía DELETE /usuarios/7 y el servidor responde 204 No Content.</desc>
  <defs>
    <style>
      #restCiclo .title{fill:#161A26;font-size:22px;font-weight:700}
      #restCiclo .sub{fill:#79809A;font-size:13.5px}
      #restCiclo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restCiclo .foot{fill:#79809A;font-size:12px}
      #restCiclo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restCiclo .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#restCiclo-ar-teal)}
      #restCiclo .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#restCiclo-ar-green)}
      #restCiclo .an,#restCiclo .ls,#restCiclo .st{animation-duration:16s;animation-iteration-count:infinite;animation-timing-function:linear}
      #restCiclo .an{opacity:0}
      #restCiclo .st{animation-name:restCiclo-hide}
      #restCiclo .a1{animation-name:restCiclo-a1}
      @keyframes restCiclo-a1{0%{opacity:0} 2%{opacity:1} 23%{opacity:1} 25%{opacity:0} 100%{opacity:0}}
      #restCiclo .a2{animation-name:restCiclo-a2}
      @keyframes restCiclo-a2{0%{opacity:0} 25%{opacity:0} 27%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #restCiclo .a3{animation-name:restCiclo-a3}
      @keyframes restCiclo-a3{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 73%{opacity:1} 75%{opacity:0} 100%{opacity:0}}
      #restCiclo .a4{animation-name:restCiclo-a4}
      @keyframes restCiclo-a4{0%{opacity:0} 75%{opacity:0} 77%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #restCiclo .a12{animation-name:restCiclo-a12}
      @keyframes restCiclo-a12{0%{opacity:0} 2%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #restCiclo .hp0{animation-name:restCiclo-hp0}
      @keyframes restCiclo-hp0{0%,2%{opacity:0;transform:translate(0,0)}3%{opacity:1;transform:translate(0,0)}13.75%{opacity:1;transform:translate(200px,0px)}22%{opacity:1;transform:translate(200px,0px)}23%,100%{opacity:0;transform:translate(200px,0px)}}
      #restCiclo .hp1{animation-name:restCiclo-hp1}
      @keyframes restCiclo-hp1{0%,52%{opacity:0;transform:translate(0,0)}53%{opacity:1;transform:translate(0,0)}63.75%{opacity:1;transform:translate(-196px,0px)}72%{opacity:1;transform:translate(-196px,0px)}73%,100%{opacity:0;transform:translate(-196px,0px)}}
      #restCiclo .hp2{animation-name:restCiclo-hp2}
      @keyframes restCiclo-hp2{0%,76.5%{opacity:0;transform:translate(0,0)}77.5%{opacity:1;transform:translate(0,0)}83.75%{opacity:1;transform:translate(200px,0px)}97%{opacity:1;transform:translate(200px,0px)}98%,100%{opacity:0;transform:translate(200px,0px)}}
      #restCiclo .hp3{animation-name:restCiclo-hp3}
      @keyframes restCiclo-hp3{0%,84.5%{opacity:0;transform:translate(0,0)}85.5%{opacity:1;transform:translate(0,0)}91.75%{opacity:1;transform:translate(-196px,0px)}97%{opacity:1;transform:translate(-196px,0px)}98%,100%{opacity:0;transform:translate(-196px,0px)}}
      @keyframes restCiclo-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#restCiclo .an,#restCiclo .ls,#restCiclo .st{animation:none}}
    </style>
    <marker id="restCiclo-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="restCiclo-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="572" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un request REST, de ida y vuelta</text>
  <text class="sub" x="48" y="80" data-fit="860">La URL nombra el recurso, el verbo HTTP dice qué hacer con él y la respuesta trae su representación en JSON.</text>
  <rect x="48" y="112" width="248" height="64" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="172" y="135" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#0F8478" data-fit="232">Cliente</text><text x="172" y="154" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">navegador · app móvil · Postman</text>
  <rect x="664" y="112" width="248" height="64" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text x="788" y="135" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9" data-fit="232">Servidor REST</text><text x="788" y="154" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="232">Spring Boot · @RestController</text>
  <path class="ar-teal" d="M304,132 H654"/><path class="ar-green" d="M656,156 H306"/>
  <text class="h" x="480" y="116" text-anchor="middle">REQUEST →</text>
  <text class="h" x="480" y="180" text-anchor="middle">← RESPONSE</text>
  <rect x="48" y="192" width="248" height="260" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="216" data-fit="216">LO QUE VE EL CLIENTE</text>
  <g class="an a12"><rect x="64" y="240" width="180" height="10" rx="5" fill="#E3E7EE"/><rect x="64" y="266" width="216" height="10" rx="5" fill="#E3E7EE"/><rect x="64" y="292" width="150" height="10" rx="5" fill="#E3E7EE"/><rect x="64" y="318" width="200" height="10" rx="5" fill="#E3E7EE"/><text x="172" y="372" text-anchor="middle" font-size="12.5" font-weight="600" fill="#79809A">esperando la respuesta…</text></g>
  <g class="ls a3"><rect x="64" y="236" width="216" height="104" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><circle cx="104" cy="276" r="22" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="104" y="276" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#0F8478">AG</text><text x="136" y="270" font-size="14" font-weight="700" fill="#161A26">Ana Gómez</text><text class="mono" x="136" y="290" font-size="11.5" fill="#454C61">ana@icesi.edu</text><text x="80" y="326" font-size="12" fill="#79809A" data-fit="184">El cliente decide cómo pintarlo</text></g>
  <g class="an a4"><rect x="64" y="236" width="216" height="64" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="172" y="259" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#C2354F" data-fit="200">Usuario 7 eliminado</text><text x="172" y="278" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">la respuesta no trae body</text></g>
  <rect x="312" y="192" width="336" height="260" rx="10" fill="#1F2430"/>
  <path d="M312,202 A10,10 0 0 1 322,192 H638 A10,10 0 0 1 648,202 V218 H312 Z" fill="#2A3040"/>
  <g class="an a12"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5">request</text><text class="mono" x="324.0" y="240" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">GET /usuarios/7 HTTP/1.1</text><text class="mono" x="324.0" y="259" font-size="11.5" fill="#E6EAF2" textLength="131.1" lengthAdjust="spacingAndGlyphs">Host: api.icesi.edu</text><text class="mono" x="324.0" y="278" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">Accept: application/json</text><text class="mono" x="324.0" y="316" font-size="11.5" fill="#8C95AA" textLength="165.6" lengthAdjust="spacingAndGlyphs">(sin body: GET solo lee)</text></g>
  <g class="an a2"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5"></text><rect x="321.0" y="226" width="26.7" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><rect x="348.6" y="226" width="81.9" height="21" rx="5" fill="#A9B4F2" fill-opacity=".3" stroke="#A9B4F2" stroke-width="1.5"/></g>
  <g class="ls a3"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5">response</text><rect x="316.0" y="226" width="328.0" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="324.0" y="240" font-size="11.5" fill="#E6EAF2" textLength="103.5" lengthAdjust="spacingAndGlyphs">HTTP/1.1 200 OK</text><text class="mono" x="324.0" y="259" font-size="11.5" fill="#E6EAF2" textLength="207.0" lengthAdjust="spacingAndGlyphs">Content-Type: application/json</text><text class="mono" x="324.0" y="297" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">{</text><text class="mono" x="337.8" y="316" font-size="11.5" fill="#E6EAF2" textLength="55.2" lengthAdjust="spacingAndGlyphs">&quot;id&quot;: 7,</text><text class="mono" x="337.8" y="335" font-size="11.5" fill="#E6EAF2" textLength="151.8" lengthAdjust="spacingAndGlyphs">&quot;nombre&quot;: &quot;Ana Gómez&quot;,</text><text class="mono" x="337.8" y="354" font-size="11.5" fill="#E6EAF2" textLength="165.6" lengthAdjust="spacingAndGlyphs">&quot;email&quot;: &quot;ana@icesi.edu&quot;</text><text class="mono" x="324.0" y="373" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text></g>
  <g class="an a4"><text class="mono" x="324" y="205" dy="0.35em" font-size="11.5" fill="#9AA3B5">request · response</text><rect x="321.0" y="226" width="47.4" height="21" rx="5" fill="#F3A3B2" fill-opacity=".3" stroke="#F3A3B2" stroke-width="1.5"/><rect x="316.0" y="283" width="328.0" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="324.0" y="240" font-size="11.5" fill="#E6EAF2" textLength="186.3" lengthAdjust="spacingAndGlyphs">DELETE /usuarios/7 HTTP/1.1</text><text class="mono" x="324.0" y="297" font-size="11.5" fill="#E6EAF2" textLength="158.7" lengthAdjust="spacingAndGlyphs">HTTP/1.1 204 No Content</text><text class="mono" x="324.0" y="335" font-size="11.5" fill="#8C95AA" textLength="241.5" lengthAdjust="spacingAndGlyphs">(sin body: no hay nada que mostrar)</text></g>
  <rect x="664" y="192" width="248" height="260" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="680" y="216" data-fit="216">RECURSOS DEL SERVIDOR</text>
  <rect x="680" y="232" width="216" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="692" y="247" dy="0.35em" class="mono" font-size="13" fill="#161A26" data-fit="196">/usuarios</text><rect x="680" y="272" width="216" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="692" y="287" dy="0.35em" class="mono" font-size="13" fill="#161A26" data-fit="196">/cursos</text><rect x="680" y="312" width="216" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="692" y="327" dy="0.35em" class="mono" font-size="13" fill="#161A26" data-fit="196">/productos</text>
  <text class="mono an a2" x="884" y="247" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="700" fill="#4453C9">findById(7)</text>
  <text class="mono an a4" x="884" y="247" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="700" fill="#C2354F">deleteById(7)</text>
  <rect x="680" y="364" width="216" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="788" y="387" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="200">Stateless</text><text x="788" y="406" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">no recuerda requests anteriores</text>
  <rect class="an a1" x="42" y="106" width="260" height="76" rx="12" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a2" x="658" y="106" width="260" height="76" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a2" x="674" y="226" width="228" height="42" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a3" x="58" y="230" width="228" height="116" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a4" x="674" y="226" width="228" height="42" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <g class="an hp0"><rect x="306" y="122" width="129" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="316" cy="132" r="5" fill="#0F8478"/><text class="mono" x="327" y="132" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /usuarios/7</text></g>
  <g class="an hp1"><rect x="510" y="146" width="116" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="520" cy="156" r="5" fill="#3A8235"/><text class="mono" x="531" y="156" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">200 OK · JSON</text></g>
  <g class="an hp2"><rect x="306" y="122" width="149" height="20" rx="10" fill="#FFFFFF" stroke="#C2354F" stroke-width="1.5"/><circle cx="316" cy="132" r="5" fill="#C2354F"/><text class="mono" x="327" y="132" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">DELETE /usuarios/7</text></g>
  <g class="an hp3"><rect x="510" y="146" width="122" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="520" cy="156" r="5" fill="#3A8235"/><text class="mono" x="531" y="156" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">204 No Content</text></g>
  <rect x="48" y="468" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="496" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El cliente pide un recurso: GET /usuarios/7.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">La URL dice cuál recurso; el verbo GET dice qué hacer con él: leerlo.</text></g>
  <g class="an a2"><circle cx="76" cy="496" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">2</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El servidor ubica el recurso usuarios con id 7 y ejecuta la lectura.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">No consulta ninguna sesión: todo lo que necesita viene en ese mismo request.</text></g>
  <g class="an a3"><circle cx="76" cy="496" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">3</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Responde 200 OK con la representación del recurso en JSON.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">El cliente recibe datos, no una página HTML: él decide cómo mostrarlos.</text></g>
  <g class="an a4"><circle cx="76" cy="496" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="496" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">4</text><text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Mismo recurso, otro verbo: DELETE /usuarios/7 lo elimina.</text><text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">204 No Content confirma sin body. La URL no cambió; cambió el verbo.</text></g>
  <g class="st"><text x="68" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Una URL por recurso; el verbo HTTP dice la acción y la respuesta trae JSON.</text><text x="68" y="509" font-size="13" fill="#454C61" data-fit="820">La animación recorre una lectura y un borrado.</text></g>
  <text class="foot" x="48" y="544" data-fit="860">Cada request es autocontenido: el servidor no guarda estado entre una petición y la siguiente.</text>
</svg>
```

## Principios fundamentales de REST

- `Recursos` — Todo se representa como un recurso identificado por una URL. Ejemplos: `/usuarios`, `/cursos/{id}`.
- `Verbos HTTP` — La acción se define por el método HTTP (GET, POST, PUT, DELETE).
- `Stateless` — El servidor no guarda estado entre peticiones. Cada request debe ser autocontenido.
- `Representación uniforme` — Los recursos se representan en un formato estándar, generalmente JSON.
- `Idempotencia` — GET, PUT y DELETE son idempotentes: ejecutarlos varias veces produce el mismo resultado. POST no lo es.

## REST vs RESTful

`REST` es el conjunto de principios arquitectónicos.
`RESTful` es un servicio que implementa esos principios correctamente.

```svg
<svg id="restVsRestful" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 396" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restVsRestful-ttl restVsRestful-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restVsRestful-ttl">REST es la regla; RESTful es la API que la cumple</title>
  <desc id="restVsRestful-dsc">Dos columnas. A la izquierda, cinco principios de REST; a la derecha, cómo se ve cada uno en una API RESTful. Recursos con URL: /usuarios/7. El verbo dice la acción: DELETE /usuarios/7. Stateless: el request trae su propio token en Authorization. Representación uniforme: Content-Type application/json. Idempotencia: tres PUT iguales dejan el mismo estado.</desc>
  <defs>
    <style>
      #restVsRestful .title{fill:#161A26;font-size:22px;font-weight:700}
      #restVsRestful .sub{fill:#79809A;font-size:13.5px}
      #restVsRestful .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restVsRestful .foot{fill:#79809A;font-size:12px}
      #restVsRestful .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #restVsRestful .ar-slate{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#restVsRestful-ar-slate)}
    </style>
    <marker id="restVsRestful-ar-slate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/></marker>
  </defs>
  <rect width="960" height="396" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">REST es la regla; RESTful es la API que la cumple</text>
  <text class="sub" x="48" y="80" data-fit="860">Cada principio del estilo REST se nota en algo concreto del request.</text>
  <rect x="48" y="104" width="400" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="368">REST · ESTILO ARQUITECTÓNICO</text>
  <rect x="512" y="104" width="400" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="528" y="128" data-fit="368">RESTFUL · UNA API QUE LO CUMPLE</text>
  <rect x="64" y="140" width="368" height="30" rx="7" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="78" y="155" dy="0.35em" font-size="13" font-weight="600" fill="#4453C9" data-fit="340">Todo es un recurso con su URL</text>
  <rect x="528" y="140" width="368" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="542" y="155" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="320">/usuarios/7</text><text x="880" y="155" dy="0.35em" text-anchor="end" font-size="14" font-weight="700" fill="#3A8235">✓</text>
  <path class="ar-slate" d="M440,155 H520"/>
  <rect x="64" y="180" width="368" height="30" rx="7" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="78" y="195" dy="0.35em" font-size="13" font-weight="600" fill="#4453C9" data-fit="340">El verbo HTTP dice la acción</text>
  <rect x="528" y="180" width="368" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="542" y="195" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="320">DELETE /usuarios/7</text><text x="880" y="195" dy="0.35em" text-anchor="end" font-size="14" font-weight="700" fill="#3A8235">✓</text>
  <path class="ar-slate" d="M440,195 H520"/>
  <rect x="64" y="220" width="368" height="30" rx="7" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="78" y="235" dy="0.35em" font-size="13" font-weight="600" fill="#4453C9" data-fit="340">Stateless: cada request es completo</text>
  <rect x="528" y="220" width="368" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="542" y="235" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="320">Authorization: Bearer eyJ…</text><text x="880" y="235" dy="0.35em" text-anchor="end" font-size="14" font-weight="700" fill="#3A8235">✓</text>
  <path class="ar-slate" d="M440,235 H520"/>
  <rect x="64" y="260" width="368" height="30" rx="7" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="78" y="275" dy="0.35em" font-size="13" font-weight="600" fill="#4453C9" data-fit="340">Representación uniforme</text>
  <rect x="528" y="260" width="368" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="542" y="275" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="320">Content-Type: application/json</text><text x="880" y="275" dy="0.35em" text-anchor="end" font-size="14" font-weight="700" fill="#3A8235">✓</text>
  <path class="ar-slate" d="M440,275 H520"/>
  <rect x="64" y="300" width="368" height="30" rx="7" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.25"/><text x="78" y="315" dy="0.35em" font-size="13" font-weight="600" fill="#4453C9" data-fit="340">Idempotencia en GET, PUT, DELETE</text>
  <rect x="528" y="300" width="368" height="30" rx="7" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><text class="mono" x="542" y="315" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="320">PUT /usuarios/7  ×3 = mismo estado</text><text x="880" y="315" dy="0.35em" text-anchor="end" font-size="14" font-weight="700" fill="#3A8235">✓</text>
  <path class="ar-slate" d="M440,315 H520"/>
  <text class="foot" x="48" y="368" data-fit="860">Una API que usa HTTP pero pone verbos en la URL o guarda sesión en el servidor no es RESTful.</text>
</svg>
```

## Semántica REST: diseño de endpoints

Al diseñar endpoints siga estas convenciones:

- Use sustantivos en plural para los recursos: `/usuarios`, `/cursos`, `/productos`.
- Nunca use verbos en la URL. El verbo ya lo define el método HTTP.
- Anide recursos cuando tenga sentido: `/cursos/{id}/estudiantes`.

```svg
<svg id="restSemantica" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 524" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="restSemantica-ttl restSemantica-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="restSemantica-ttl">Dos URLs, seis acciones</title>
  <desc id="restSemantica-dsc">A la izquierda la colección /usuarios con GET para obtener todos y POST para crear. A la derecha el elemento /usuarios/{id} con GET para obtener uno, PUT para reemplazarlo completo, PATCH para actualizar parte y DELETE para eliminarlo. Abajo, un recurso anidado: GET /cursos/{id}/estudiantes son los estudiantes de un curso.</desc>
  <defs>
    <style>
      #restSemantica .title{fill:#161A26;font-size:22px;font-weight:700}
      #restSemantica .sub{fill:#79809A;font-size:13.5px}
      #restSemantica .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #restSemantica .foot{fill:#79809A;font-size:12px}
      #restSemantica .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
    </style>
  </defs>
  <rect width="960" height="524" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Dos URLs, seis acciones</text>
  <text class="sub" x="48" y="80" data-fit="860">El sustantivo va en la URL y la acción la pone el verbo. Sin id se habla de la colección; con id, de un elemento.</text>
  <rect x="48" y="104" width="420" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="388">LA COLECCIÓN</text>
  <rect x="492" y="104" width="420" height="244" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="508" y="128" data-fit="388">UN ELEMENTO</text>
  <rect x="64" y="144" width="388" height="36" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><rect x="70" y="150" width="72" height="24" rx="6" fill="#3A8235"/><text class="mono" x="106.0" y="162" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">GET</text><text class="mono" x="154" y="162" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">/usuarios</text><text x="440" y="162" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">Obtener todos</text>
  <rect x="64" y="188" width="388" height="36" rx="8" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><rect x="70" y="194" width="72" height="24" rx="6" fill="#A96C05"/><text class="mono" x="106.0" y="206" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">POST</text><text class="mono" x="154" y="206" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">/usuarios</text><text x="440" y="206" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">Crear uno nuevo</text>
  <rect x="508" y="144" width="388" height="36" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/><rect x="514" y="150" width="72" height="24" rx="6" fill="#3A8235"/><text class="mono" x="550.0" y="162" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">GET</text><text class="mono" x="598" y="162" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">/usuarios/{id}</text><text x="884" y="162" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">Obtener uno</text>
  <rect x="508" y="188" width="388" height="36" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><rect x="514" y="194" width="72" height="24" rx="6" fill="#7439B8"/><text class="mono" x="550.0" y="206" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">PUT</text><text class="mono" x="598" y="206" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">/usuarios/{id}</text><text x="884" y="206" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">Reemplazarlo completo</text>
  <rect x="508" y="232" width="388" height="36" rx="8" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><rect x="514" y="238" width="72" height="24" rx="6" fill="#7439B8"/><text class="mono" x="550.0" y="250" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">PATCH</text><text class="mono" x="598" y="250" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">/usuarios/{id}</text><text x="884" y="250" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">Actualizar una parte</text>
  <rect x="508" y="276" width="388" height="36" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><rect x="514" y="282" width="72" height="24" rx="6" fill="#C2354F"/><text class="mono" x="550.0" y="294" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">DELETE</text><text class="mono" x="598" y="294" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">/usuarios/{id}</text><text x="884" y="294" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">Eliminarlo</text>
  <rect x="64" y="236" width="388" height="72" rx="10" fill="#1F2430"/>
  <path d="M64,246 A10,10 0 0 1 74,236 H442 A10,10 0 0 1 452,246 V262 H64 Z" fill="#2A3040"/>
  <text class="mono" x="76" y="249" dy="0.35em" font-size="11.5" fill="#9AA3B5">GET /usuarios → 200 OK</text><text class="mono" x="76.0" y="288" font-size="11.5" fill="#E6EAF2" textLength="303.6" lengthAdjust="spacingAndGlyphs">[ {&quot;id&quot;: 1, …}, {&quot;id&quot;: 2, …}, {&quot;id&quot;: 7, …} ]</text>
  <text x="64" y="328" font-size="12.5" fill="#79809A" data-fit="388">Sin {id}: la acción es sobre el conjunto.</text>
  <text x="508" y="328" font-size="12.5" fill="#79809A" data-fit="388">Con {id}: la acción es sobre ese usuario.</text>
  <rect x="48" y="364" width="864" height="108" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="388" data-fit="832">RECURSOS ANIDADOS</text>
  <text class="mono" x="72.0" y="413" dy="0.35em" font-size="18" font-weight="700" fill="#3A8235" textLength="32.4" lengthAdjust="spacingAndGlyphs">GET</text>
  <rect x="121.2" y="398" width="79.6" height="30" rx="6" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="161.0" y="448" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">la colección</text>
  <text class="mono" x="123.2" y="413" dy="0.35em" font-size="18" font-weight="700" fill="#161A26" textLength="75.6" lengthAdjust="spacingAndGlyphs">/cursos</text>
  <rect x="204.8" y="398" width="58.0" height="30" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="233.8" y="448" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05">un curso</text>
  <text class="mono" x="206.8" y="413" dy="0.35em" font-size="18" font-weight="700" fill="#161A26" textLength="54.0" lengthAdjust="spacingAndGlyphs">/{id}</text>
  <rect x="266.8" y="398" width="133.6" height="30" rx="6" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="333.6" y="448" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8">sus estudiantes</text>
  <text class="mono" x="268.8" y="413" dy="0.35em" font-size="18" font-weight="700" fill="#161A26" textLength="129.6" lengthAdjust="spacingAndGlyphs">/estudiantes</text>
  <text x="440" y="407" font-size="13.5" font-weight="600" fill="#161A26">Se lee de izquierda a derecha:</text>
  <text x="440" y="427" font-size="13.5" fill="#454C61">«los estudiantes del curso {id}».</text>
  <text class="foot" x="48" y="496" data-fit="860">Nunca un verbo en la URL: /getUsuarios o /deleteUsuario repiten lo que ya dice el método HTTP.</text>
</svg>
```

Ejemplos de URLs incorrectas vs correctas:

```http
❌ GET /getUsuarios
❌ POST /createProducto
❌ DELETE /deleteUsuarioById
✅ GET /usuarios
✅ POST /productos
✅ DELETE /usuarios/{id}
```
