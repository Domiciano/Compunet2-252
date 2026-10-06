# Spring Security

Spring Security es un framework de autenticación y autorización altamente personalizable para aplicaciones Java basadas en Spring. Proporciona mecanismos robustos para gestionar la seguridad, incluyendo autenticación de usuarios, control de acceso basado en roles, protección contra ataques como CSRF y session fixation, y compatibilidad con estándares como OAuth2 y JWT. Se integra fácilmente con Spring Boot y permite asegurar tanto aplicaciones web con Spring MVC y Thymeleaf como APIs REST.

## Setup

Para usar Spring Security debe añadir la dependencia de Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Trabajemos en el mismo repositorio que venimos manejando

```http
https://github.com/Domiciano/SpringMVC261
```

Al añadir la dependencia, verá que para acceder a sus controllers por medio de request desde el navegador, tendrá que `autenticarse` en la página.

## ¿Cómo o en dónde me autentico?

Al ejecutar la aplicación aparecerá algo como

```plain
Using generated security password: 0be98d58-3edd-49c4-b73a-e0a3fdda1809

This generated password is for development use only. Your security configuration must be updated before running your application in production.
```

Este es un usuario por defecto almacenado en memoria que usted debe/puede usar para obtener acceso a la página. Las credenciales son `user` y el password suministrado en la consola.

- Verifique en la consola del navegador la cookie que se crea

## Mecanismo de autenticación basada en estado

Reproduzca la animación: muestra, paso a paso, qué viaja entre el navegador y el servidor. Debajo está el detalle de cada paso.

```svg
<svg id="ssSesion" data-steps="7" data-step-seconds="3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="ssSesion-ttl ssSesion-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="ssSesion-ttl">Autenticación basada en estado: la sesión y su cookie</title>
  <desc id="ssSesion-dsc">Animación en siete pasos y dos columnas, navegador y servidor, con los mensajes HTTP en el medio. Uno: el navegador pide GET /courses/ y Spring Security intercepta la solicitud porque no hay sesión activa. Dos: Spring Security redirige a /login y el navegador muestra el formulario. Tres: el usuario envía sus credenciales con POST /login. Cuatro: Spring Security verifica las credenciales contra el usuario en memoria. Cinco: el servidor crea una sesión HTTP y genera un JSESSIONID. Seis: la respuesta trae Set-Cookie con el JSESSIONID y el navegador guarda la cookie. Siete: en cada solicitud siguiente el navegador envía la cookie y Spring Security deja pasar la petición al controller.</desc>
  <defs>
    <style>
      #ssSesion .title{fill:#161A26;font-size:22px;font-weight:700}
      #ssSesion .sub{fill:#79809A;font-size:13.5px}
      #ssSesion .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #ssSesion .foot{fill:#79809A;font-size:12px}
      #ssSesion .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #ssSesion .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#ssSesion-ar-teal)}
      #ssSesion .ar-rose{fill:none;stroke:#C2354F;stroke-width:1.75;marker-end:url(#ssSesion-ar-rose)}
      #ssSesion .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#ssSesion-ar-green)}
      #ssSesion .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#ssSesion-ar-amber)}
      #ssSesion .an,#ssSesion .ls,#ssSesion .st{animation-duration:21s;animation-iteration-count:infinite;animation-timing-function:linear}
      #ssSesion .an{opacity:0}
      #ssSesion .st{animation-name:ssSesion-hide}
      #ssSesion .a1{animation-name:ssSesion-a1}
      @keyframes ssSesion-a1{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 100%{opacity:0}}
      #ssSesion .a2{animation-name:ssSesion-a2}
      @keyframes ssSesion-a2{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 100%{opacity:0}}
      #ssSesion .a3{animation-name:ssSesion-a3}
      @keyframes ssSesion-a3{0%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #ssSesion .a4{animation-name:ssSesion-a4}
      @keyframes ssSesion-a4{0%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #ssSesion .a5{animation-name:ssSesion-a5}
      @keyframes ssSesion-a5{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #ssSesion .a6{animation-name:ssSesion-a6}
      @keyframes ssSesion-a6{0%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #ssSesion .a7{animation-name:ssSesion-a7}
      @keyframes ssSesion-a7{0%{opacity:0} 85.71%{opacity:0} 87.71%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssSesion .a12{animation-name:ssSesion-a12}
      @keyframes ssSesion-a12{0%{opacity:0} 2%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 100%{opacity:0}}
      #ssSesion .a14{animation-name:ssSesion-a14}
      @keyframes ssSesion-a14{0%{opacity:0} 2%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #ssSesion .a15{animation-name:ssSesion-a15}
      @keyframes ssSesion-a15{0%{opacity:0} 2%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #ssSesion .a17{animation-name:ssSesion-a17}
      @keyframes ssSesion-a17{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 85.71%{opacity:0} 87.71%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssSesion .a26{animation-name:ssSesion-a26}
      @keyframes ssSesion-a26{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #ssSesion .a36{animation-name:ssSesion-a36}
      @keyframes ssSesion-a36{0%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #ssSesion .a57{animation-name:ssSesion-a57}
      @keyframes ssSesion-a57{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssSesion .a67{animation-name:ssSesion-a67}
      @keyframes ssSesion-a67{0%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssSesion .aB{animation-name:ssSesion-aB}
      @keyframes ssSesion-aB{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 85.71%{opacity:0} 87.71%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssSesion .tk1{animation-name:ssSesion-tk1}
      @keyframes ssSesion-tk1{0%,1.14%{opacity:0;transform:translate(0,0)}2.86%{opacity:1;transform:translate(0,0)}10.71%{opacity:1;transform:translate(348px,0)}13.14%,100%{opacity:0;transform:translate(348px,0)}}
      #ssSesion .tk2{animation-name:ssSesion-tk2}
      @keyframes ssSesion-tk2{0%,15.43%{opacity:0;transform:translate(0,0)}17.14%{opacity:1;transform:translate(0,0)}25%{opacity:1;transform:translate(-348px,0)}27.43%,100%{opacity:0;transform:translate(-348px,0)}}
      #ssSesion .tk3{animation-name:ssSesion-tk3}
      @keyframes ssSesion-tk3{0%,29.71%{opacity:0;transform:translate(0,0)}31.43%{opacity:1;transform:translate(0,0)}39.29%{opacity:1;transform:translate(348px,0)}41.71%,100%{opacity:0;transform:translate(348px,0)}}
      #ssSesion .tk4{animation-name:ssSesion-tk4}
      @keyframes ssSesion-tk4{0%,44%{opacity:0;transform:translate(0,0)}45.71%{opacity:1;transform:translate(0,0)}51.43%{opacity:1;transform:translate(32px,0)}56%,100%{opacity:0;transform:translate(32px,0)}}
      #ssSesion .tk5{animation-name:ssSesion-tk5}
      @keyframes ssSesion-tk5{0%,58.29%{opacity:0;transform:translate(0,0)}60%{opacity:1;transform:translate(0,0)}65.71%{opacity:1;transform:translate(32px,0)}70.29%,100%{opacity:0;transform:translate(32px,0)}}
      #ssSesion .tk6{animation-name:ssSesion-tk6}
      @keyframes ssSesion-tk6{0%,72.57%{opacity:0;transform:translate(0,0)}74.29%{opacity:1;transform:translate(0,0)}82.14%{opacity:1;transform:translate(-348px,0)}84.57%,100%{opacity:0;transform:translate(-348px,0)}}
      #ssSesion .tk7{animation-name:ssSesion-tk7}
      @keyframes ssSesion-tk7{0%,86.86%{opacity:0;transform:translate(0,0)}88.57%{opacity:1;transform:translate(0,0)}94.29%{opacity:1;transform:translate(348px,0)}96.43%{opacity:1;transform:translate(436px,0)}98.86%,100%{opacity:0;transform:translate(436px,0)}}
      @keyframes ssSesion-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#ssSesion .an,#ssSesion .ls,#ssSesion .st{animation:none}}
    </style>
    <marker id="ssSesion-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="ssSesion-ar-rose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#C2354F"/></marker>
    <marker id="ssSesion-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
    <marker id="ssSesion-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Autenticación basada en estado: la sesión y su cookie</text>
  <text class="sub" x="48" y="80" data-fit="860">El servidor recuerda quién inició sesión; el navegador solo guarda un identificador y lo envía en cada solicitud.</text>
  <rect x="48" y="104" width="264" height="364" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="232">NAVEGADOR</text>
  <rect x="648" y="104" width="264" height="364" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="664" y="128" data-fit="232">SERVIDOR · SPRING BOOT</text>
  <text class="h" x="480" y="128" text-anchor="middle">MENSAJES HTTP</text>
  <rect x="60" y="144" width="240" height="220" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2.5"/>
  <path d="M61,180 H299" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="76" cy="162" r="3.5" fill="#C4CBD8"/>
  <circle cx="88" cy="162" r="3.5" fill="#C4CBD8"/>
  <circle cx="100" cy="162" r="3.5" fill="#C4CBD8"/>
  <rect x="112" y="151" width="176" height="22" rx="11" fill="#EFF1F5"/>
  <text class="mono ls a17" x="200" y="162" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="164">localhost:8080/courses/</text>
  <text class="mono an a26" x="200" y="162" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="164">localhost:8080/login</text>
  <g class="an a1"><rect x="76" y="200" width="120" height="10" rx="5" fill="#E3E7EE"/><rect x="76" y="226" width="208" height="10" rx="5" fill="#E3E7EE"/><rect x="76" y="252" width="176" height="10" rx="5" fill="#E3E7EE"/><rect x="76" y="278" width="144" height="10" rx="5" fill="#E3E7EE"/><text x="180" y="332" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61">esperando la respuesta…</text></g>
  <g class="an a26"><text x="76" y="206" font-size="14" font-weight="700" fill="#161A26">Please sign in</text><rect x="76" y="218" width="208" height="28" rx="6" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><rect x="76" y="254" width="208" height="28" rx="6" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/><rect x="76" y="294" width="208" height="30" rx="6" fill="#4453C9"/><text x="180" y="309" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Sign in</text></g>
  <g class="an a2"><text x="88" y="232" dy="0.35em" font-size="12.5" fill="#9AA3B5">Username</text><text x="88" y="268" dy="0.35em" font-size="12.5" fill="#9AA3B5">Password</text></g>
  <g class="an a36"><text class="mono" x="88" y="232" dy="0.35em" font-size="12.5" fill="#161A26">user</text><text x="88" y="268" dy="0.35em" font-size="12.5" fill="#161A26">••••••••••••</text></g>
  <g class="ls a7"><text x="76" y="206" font-size="14" font-weight="700" fill="#161A26">Cursos</text><rect x="76" y="218" width="208" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="88" y="233" dy="0.35em" font-size="13" fill="#161A26" data-fit="188">Computación en Internet II</text><rect x="76" y="254" width="208" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="88" y="269" dy="0.35em" font-size="13" fill="#161A26" data-fit="188">Aplicaciones Móviles</text><rect x="76" y="290" width="208" height="30" rx="7" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.25"/><text x="88" y="305" dy="0.35em" font-size="13" fill="#161A26" data-fit="188">Ingeniería de Software</text></g>
  <g class="an a15"><rect x="60" y="390" width="240" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="180" y="407" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="224">Cookies</text><text x="180" y="426" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="224">ninguna todavía</text></g>
  <g class="ls a67"><rect x="60" y="390" width="240" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="180" y="407" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="224">JSESSIONID=ABC123XYZ456</text><text x="180" y="426" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="224">cookie guardada</text></g>
  <rect x="664" y="144" width="52" height="308" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/>
  <text x="683" y="298" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#4453C9" transform="rotate(-90 683 298)">Spring Security</text>
  <text x="702" y="298" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" transform="rotate(-90 702 298)">intercepta cada solicitud</text>
  <g class="an a12"><rect x="752" y="152" width="148" height="32" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="826" y="168" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="132">sin sesión: no pasa</text></g>
  <rect x="752" y="236" width="148" height="52" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="826" y="253" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="132">user</text><text x="826" y="272" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="132">usuario en memoria</text>
  <g class="an a14"><rect x="752" y="318" width="148" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="826" y="335" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="132">Sesiones HTTP</text><text x="826" y="354" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="132">ninguna todavía</text></g>
  <g class="ls a57"><rect x="752" y="318" width="148" height="52" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="826" y="335" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="132">ABC123XYZ456</text><text x="826" y="354" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="132">sesión de user</text></g>
  <rect x="752" y="390" width="148" height="52" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="826" y="407" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#7439B8" data-fit="132">CoursesController</text><text x="826" y="426" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="132">recurso protegido</text>
  <path class="ar-teal" d="M314,168 H662"/><path class="ar-rose" d="M662,212 H314"/><path class="ar-teal" d="M314,262 H662"/>
  <path class="ar-green" d="M662,344 H314"/><path class="ar-teal" d="M314,416 H662"/>
  <path class="ar-amber" d="M718,262 H750"/><path class="ar-green" d="M718,344 H750"/><path class="ar-teal" d="M718,416 H750"/>
  <text class="mono" x="488" y="160" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="270">GET /courses/</text>
  <text class="mono" x="488" y="204" text-anchor="middle" font-size="12.5" font-weight="600" fill="#C2354F" data-fit="270">302 · Location: /login</text>
  <text class="mono" x="488" y="254" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="270">POST /login</text>
  <text class="mono" x="488" y="280" text-anchor="middle" font-size="11.5" font-weight="600" fill="#454C61" data-fit="270">username=user&amp;password=0be98d58…</text>
  <text class="mono" x="488" y="336" text-anchor="middle" font-size="12" font-weight="600" fill="#3A8235" data-fit="270">Set-Cookie: JSESSIONID=ABC123XYZ456</text>
  <text class="mono" x="488" y="408" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="270">GET /courses/</text>
  <text class="mono" x="488" y="434" text-anchor="middle" font-size="12" font-weight="600" fill="#3A8235" data-fit="270">Cookie: JSESSIONID=ABC123XYZ456</text>
  <rect class="an aB" x="658" y="138" width="64" height="320" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a2" x="54" y="138" width="252" height="232" rx="14" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a3" x="54" y="138" width="252" height="232" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a4" x="746" y="230" width="160" height="64" rx="14" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a5" x="746" y="312" width="160" height="64" rx="14" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a6" x="54" y="384" width="252" height="64" rx="14" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a7" x="746" y="312" width="160" height="64" rx="14" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a7" x="746" y="384" width="160" height="64" rx="14" fill="none" stroke="#7439B8" stroke-width="3"/>
  <circle class="an tk1" cx="314" cy="168" r="8" fill="#0F8478" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk2" cx="662" cy="212" r="8" fill="#C2354F" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk3" cx="314" cy="262" r="8" fill="#0F8478" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk4" cx="718" cy="262" r="8" fill="#A96C05" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk5" cx="718" cy="344" r="8" fill="#3A8235" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk6" cx="662" cy="344" r="8" fill="#3A8235" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk7" cx="314" cy="416" r="8" fill="#3A8235" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="328" cy="168" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="328" y="168" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text>
  <circle cx="640" cy="212" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="640" y="212" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">2</text>
  <circle cx="328" cy="262" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="328" y="262" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">3</text>
  <circle cx="900" cy="236" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="900" y="236" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <circle cx="900" cy="318" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="900" y="318" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">5</text>
  <circle cx="640" cy="344" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="640" y="344" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">6</text>
  <circle cx="328" cy="416" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="328" y="416" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">7</text>
  <rect x="48" y="484" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="512" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El navegador pide un recurso protegido: GET /courses/.</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">Spring Security intercepta la solicitud y detecta que no hay una sesión activa.</text></g>
  <g class="an a2"><circle cx="76" cy="512" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">2</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Spring Security responde con una redirección a /login.</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">El navegador la sigue y muestra la página de inicio de sesión.</text></g>
  <g class="an a3"><circle cx="76" cy="512" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">3</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El usuario escribe su usuario y su contraseña y presiona «Sign in».</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">El navegador envía un POST /login con las credenciales en el cuerpo.</text></g>
  <g class="an a4"><circle cx="76" cy="512" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Spring Security verifica las credenciales.</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">Las compara con el usuario que conoce: por ahora, el usuario en memoria.</text></g>
  <g class="an a5"><circle cx="76" cy="512" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">5</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Son correctas: el servidor crea una sesión HTTP y genera un JSESSIONID único.</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">La sesión vive en el servidor: ese es el «estado» de este mecanismo.</text></g>
  <g class="an a6"><circle cx="76" cy="512" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">6</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">La respuesta trae la cabecera Set-Cookie con el JSESSIONID.</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">El navegador guarda la cookie.</text></g>
  <g class="an a7"><circle cx="76" cy="512" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="512" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">7</text><text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Desde ahora el navegador envía la cookie en cada solicitud, automáticamente.</text><text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">Spring Security encuentra la sesión y deja pasar la petición hasta el controller.</text></g>
  <g class="st"><text x="68" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="820">El servidor guarda la sesión; el navegador solo guarda el JSESSIONID y lo envía en cada solicitud.</text><text x="68" y="525" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los siete pasos.</text></g>
  <text class="foot" x="48" y="572" data-fit="860">La sesión expira en el servidor: el tiempo se ajusta con server.servlet.session.timeout.</text>
</svg>
```

`1` Cuando un usuario intenta acceder a un recurso protegido en la aplicación (por ejemplo, http://localhost:8080/courses/), Spring Security intercepta la solicitud y detecta que no hay una sesión activa.

`2` Spring Security, por defecto, redirige al usuario a la página de inicio de sesión (/login).
El navegador recibe esta redirección y muestra la página de login.

`3` Cuando el usuario ingresa su usuario y contraseña y presiona "Iniciar sesión", el navegador envía una solicitud HTTP POST al servidor con las credenciales:

```plain
POST /login
Content-Type: application/x-www-form-urlencoded

username=user&password=3b4c1d2e-5f6g-7h8i-9j0k-l1m2n3o4p5q6
```

`4` Spring Security verifica las credenciales 

`5` Si son correctas, el servidor crea una nueva sesión HTTP y genera un JSESSIONID único para el usuario autenticado.

`6` Se devuelve la cookie JSESSIONID al cliente en la respuesta HTTP:

```plain
HTTP/1.1 200 OK
Set-Cookie: JSESSIONID=ABC123XYZ456; Path=/; HttpOnly; Secure
```

`7` A partir de este momento, cada vez que el usuario haga una nueva solicitud al servidor, el navegador enviará automáticamente la cookie JSESSIONID:

```plain
GET /admin
Cookie: JSESSIONID=ABC123XYZ456
```

Puede modificar el tiempo de sesión usando el `application.properties`

```ini
server.servlet.session.timeout=5m  # Expira en 5 minutos
```

## Modifiquemos el usuario (in-memory) por defecto

El siguiente paso será modificar el usuario por defecto. Nuestro camino es entender cómo funciona el `UserDetailsService` para mapear usuarios de Spring Security con usuarios almacenados en base de datos.

```java
@Configuration
public class WebSecurityConfig {
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager userDetailsMngr = new InMemoryUserDetailsManager();

        UserDetails user = User.withUsername("miUsuario") // Cambiar el usuario
                .password("123456") // Especificar la contraseña
                .authorities("read") // Las authorities representan los roles o permisos que tiene el usuario
                .build();
        
        userDetailsMngr.createUser(user); // Agregar el usuario a la lista de usuarios

        return userDetailsMngr; // Retornar la lista de usuarios
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
```

## Cargando usuario de DB

Ya hemos visto cómo se carga un in-memory user. Pero ahora, tenemos que llevar esta forma en la que funcionan los usuarios en SpringBoot para habilitar los usuarios almacenados en base de datos.

![Imagen](image15.png "icon")

Requerimos varios ingredientes

`Una tabla de Users`
Para poder disponer de usuarios registrador al momento de hacer login

`Repositorio+Service de Usuarios`
Para extraer información de la tabla de usuarios

`Servicio que implemente UserDetailsService`
UserDetailsService es una interfaz de Spring Security que carga los detalles de un usuario a partir de una fuente de datos para la autenticación. Nuestra fuente de datos en este casos será la base de datos.

`Clase que implemente UserDetails`
UserDetails representa la información del usuario autenticado, incluyendo su nombre, contraseña y roles. UserDetails es una interfaz de Spring Security.

## CustomUserDetailsService

Al implementar `UserDetailsService`, la clase nos pedirá que resolvamos la implementación de loadUserByUsername.

Para resolver este método, puede usar el servicio de `UserService` que es capaz de recuperar registros desde la base de datos.

Recordemos que aquí resolvemos la carga de datos a partir de una fuente de datos

```java
 @Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ?
    }
}
```

El método `loadUserByUsername(String username)` devuelve un objeto de tipo `UserDetails`. De modo que tenemos que crear una clase que implemente esa interfaz.

## SecurityUser

Tenemos que modelar el usuario autenticado. 

- `UserDetails` representa el usuario autenticado, que es diferente al usuario de base de datos.
- `User` representa el usuario extraído de la base de datos

Al implementar de `UserDetails`, tendremos que resolver los métodos `getUsername()`, `getPassword()` y `getAuthorities()`. Para los 2 primeros retornemos la información del usuario de base de datos. El último, en próximas clases lo usaremos para el tema de los permisos

```java
public class SecurityUser implements UserDetails {

    private User user;

    public SecurityUser(User user) {
        this.user = user;
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getPass();
    }

    @Override
    public List<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "read");
    }
}
```

## Método loadUserByUsername

Con todo listo, devolvámos una instancia de `UserDetails` a partir de un `username`. 

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    ...
}
```

Use el `UserService` y cree un objeto de tipo `UserDetail` a partir del usuario recuperado de la base de datos.

## Request autorizadas

Una vez que estamos autorizados, el flujo se ve como en la imagen

![Imagen](image16.png "icon")

El request, ahora lleva la cookie `JSESSIONID`. Esta cookie es verificada por `SecurityContextPersistenceFilter`.

Si el request se mantiene, el filtro recupera la HTTPSession de Tomcat. Por debajo la HTTPSession tiene un objeto llamado `SecurityContext` que se carga en el `SecurityContextHolder`. Esto se mantiene almacenado de forma estática durante el proceso de request-response. Una vez ha terminado al transacción, se limpia el `SecurityContext`

Posteriomente, el `AuthorizationFilter` verifica permisos de esa sesión verificando si la ruta que se solicita en el `request` si es accesible por el usuario con la sesión identificada con `JSESSIONID`
