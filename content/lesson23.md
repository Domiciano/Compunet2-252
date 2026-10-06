# Introducción a Spring Security

<!-- tags: Spring Security, autenticación basada en estado, JSESSIONID, cookie de sesión,
     InMemoryUserDetailsManager, PasswordEncoder, UserDetailsService, contraseña generada en consola,
     redirige a /login, There is no PasswordEncoder mapped -->

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

La animación recorre ese código y muestra qué queda en memoria después de cada parte.

```svg
<svg id="ssInMemory" data-steps="6" data-step-seconds="3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 668" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="ssInMemory-ttl ssInMemory-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="ssInMemory-ttl">Del usuario por defecto a su propio usuario en memoria</title>
  <desc id="ssInMemory-dsc">Animación en seis pasos y dos columnas: el código de WebSecurityConfig a la izquierda y lo que queda en memoria a la derecha. Uno: sin configuración, Spring Boot crea el usuario user con una contraseña generada. Dos: al declarar un Bean de tipo UserDetailsService ese usuario deja de crearse y el InMemoryUserDetailsManager arranca vacío. Tres: User.withUsername construye un UserDetails con nombre, contraseña y authorities. Cuatro: createUser lo agrega al manager. Cinco: el Bean de PasswordEncoder, con NoOpPasswordEncoder, compara la contraseña sin cifrar. Seis: al iniciar sesión entra miUsuario con 123456 y el usuario user ya no existe.</desc>
  <defs>
    <style>
      #ssInMemory .title{fill:#161A26;font-size:22px;font-weight:700}
      #ssInMemory .sub{fill:#79809A;font-size:13.5px}
      #ssInMemory .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #ssInMemory .foot{fill:#79809A;font-size:12px}
      #ssInMemory .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #ssInMemory .an,#ssInMemory .ls,#ssInMemory .st{animation-duration:18s;animation-iteration-count:infinite;animation-timing-function:linear}
      #ssInMemory .an{opacity:0}
      #ssInMemory .st{animation-name:ssInMemory-hide}
      #ssInMemory .a1{animation-name:ssInMemory-a1}
      @keyframes ssInMemory-a1{0%{opacity:0} 2%{opacity:1} 14.67%{opacity:1} 16.67%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a2{animation-name:ssInMemory-a2}
      @keyframes ssInMemory-a2{0%{opacity:0} 16.67%{opacity:0} 18.67%{opacity:1} 31.33%{opacity:1} 33.33%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a3{animation-name:ssInMemory-a3}
      @keyframes ssInMemory-a3{0%{opacity:0} 33.33%{opacity:0} 35.33%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a4{animation-name:ssInMemory-a4}
      @keyframes ssInMemory-a4{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 64.67%{opacity:1} 66.67%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a5{animation-name:ssInMemory-a5}
      @keyframes ssInMemory-a5{0%{opacity:0} 66.67%{opacity:0} 68.67%{opacity:1} 81.33%{opacity:1} 83.33%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a6{animation-name:ssInMemory-a6}
      @keyframes ssInMemory-a6{0%{opacity:0} 83.33%{opacity:0} 85.33%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssInMemory .a13{animation-name:ssInMemory-a13}
      @keyframes ssInMemory-a13{0%{opacity:0} 2%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a23{animation-name:ssInMemory-a23}
      @keyframes ssInMemory-a23{0%{opacity:0} 16.67%{opacity:0} 18.67%{opacity:1} 48%{opacity:1} 50%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a26{animation-name:ssInMemory-a26}
      @keyframes ssInMemory-a26{0%{opacity:0} 16.67%{opacity:0} 18.67%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssInMemory .a34{animation-name:ssInMemory-a34}
      @keyframes ssInMemory-a34{0%{opacity:0} 33.33%{opacity:0} 35.33%{opacity:1} 64.67%{opacity:1} 66.67%{opacity:0} 100%{opacity:0}}
      #ssInMemory .a46{animation-name:ssInMemory-a46}
      @keyframes ssInMemory-a46{0%{opacity:0} 50%{opacity:0} 52%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssInMemory .a56{animation-name:ssInMemory-a56}
      @keyframes ssInMemory-a56{0%{opacity:0} 66.67%{opacity:0} 68.67%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssInMemory .aM{animation-name:ssInMemory-aM}
      @keyframes ssInMemory-aM{0%{opacity:0} 16.67%{opacity:0} 18.67%{opacity:1} 31.33%{opacity:1} 33.33%{opacity:0} 83.33%{opacity:0} 85.33%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssInMemory .tk2{animation-name:ssInMemory-tk2}
      @keyframes ssInMemory-tk2{0%,18%{opacity:0;transform:translate(0,0)}20%{opacity:1;transform:translate(0,0)}28.33%{opacity:1;transform:translate(52px,0)}32%,100%{opacity:0;transform:translate(52px,0)}}
      #ssInMemory .tk4{animation-name:ssInMemory-tk4}
      @keyframes ssInMemory-tk4{0%,51.33%{opacity:0;transform:translate(0,0)}53.33%{opacity:1;transform:translate(0,0)}61.67%{opacity:1;transform:translate(0,-40px)}65.33%,100%{opacity:0;transform:translate(0,-40px)}}
      #ssInMemory .tk6{animation-name:ssInMemory-tk6}
      @keyframes ssInMemory-tk6{0%,84.67%{opacity:0;transform:translate(0,0)}86.67%{opacity:1;transform:translate(0,0)}95.83%{opacity:1;transform:translate(0,-120px)}98.67%,100%{opacity:0;transform:translate(0,-120px)}}
      @keyframes ssInMemory-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#ssInMemory .an,#ssInMemory .ls,#ssInMemory .st{animation:none}}
    </style>
  </defs>
  <rect width="960" height="668" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Del usuario por defecto a su propio usuario en memoria</text>
  <text class="sub" x="48" y="80" data-fit="860">Dos @Bean en WebSecurityConfig: uno dice quiénes son los usuarios y el otro cómo se compara la contraseña.</text>
  <rect x="48" y="104" width="432" height="432" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="400">EL CÓDIGO</text>
  <rect x="504" y="104" width="408" height="432" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="520" y="128" data-fit="376">LO QUE QUEDA EN MEMORIA</text>
  <rect x="60" y="140" width="408" height="382" rx="10" fill="#1F2430"/>
  <path d="M60,150 A10,10 0 0 1 70,140 H458 A10,10 0 0 1 468,150 V166 H60 Z" fill="#2A3040"/>
  <text class="mono" x="72" y="153" dy="0.35em" font-size="12" fill="#9AA3B5">WebSecurityConfig.java</text>
  <rect class="an a2" x="64" y="208" width="400" height="78" rx="5" fill="#A9B4F2" fill-opacity=".3" stroke="#A9B4F2" stroke-width="1.5"/>
  <rect class="an a3" x="64" y="284" width="400" height="78" rx="5" fill="#86D3CA" fill-opacity=".3" stroke="#86D3CA" stroke-width="1.5"/>
  <rect class="an a4" x="64" y="360" width="400" height="21" rx="5" fill="#9FD68D" fill-opacity=".3" stroke="#9FD68D" stroke-width="1.5"/>
  <rect class="an a5" x="64" y="417" width="400" height="59" rx="5" fill="#F0C572" fill-opacity=".3" stroke="#F0C572" stroke-width="1.5"/>
  <rect class="an a6" x="64" y="379" width="400" height="21" rx="5" fill="#A9B4F2" fill-opacity=".3" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="72.0" y="184" font-size="11.5" fill="#E6EAF2" textLength="96.6" lengthAdjust="spacingAndGlyphs">@Configuration</text>
  <text class="mono" x="72.0" y="203" font-size="11.5" fill="#E6EAF2" textLength="220.8" lengthAdjust="spacingAndGlyphs">public class WebSecurityConfig {</text>
  <text class="mono" x="85.8" y="222" font-size="11.5" fill="#E6EAF2" textLength="34.5" lengthAdjust="spacingAndGlyphs">@Bean</text>
  <text class="mono" x="85.8" y="241" font-size="11.5" fill="#E6EAF2" textLength="331.2" lengthAdjust="spacingAndGlyphs">public UserDetailsService userDetailsService() {</text>
  <text class="mono" x="99.6" y="260" font-size="11.5" fill="#E6EAF2" textLength="303.6" lengthAdjust="spacingAndGlyphs">InMemoryUserDetailsManager userDetailsMngr =</text>
  <text class="mono" x="127.2" y="279" font-size="11.5" fill="#E6EAF2" textLength="227.7" lengthAdjust="spacingAndGlyphs">new InMemoryUserDetailsManager();</text>
  <text class="mono" x="99.6" y="298" font-size="11.5" fill="#E6EAF2" textLength="338.1" lengthAdjust="spacingAndGlyphs">UserDetails user = User.withUsername(&quot;miUsuario&quot;)</text>
  <text class="mono" x="127.2" y="317" font-size="11.5" fill="#E6EAF2" textLength="131.1" lengthAdjust="spacingAndGlyphs">.password(&quot;123456&quot;)</text>
  <text class="mono" x="127.2" y="336" font-size="11.5" fill="#E6EAF2" textLength="138.0" lengthAdjust="spacingAndGlyphs">.authorities(&quot;read&quot;)</text>
  <text class="mono" x="127.2" y="355" font-size="11.5" fill="#E6EAF2" textLength="62.1" lengthAdjust="spacingAndGlyphs">.build();</text>
  <text class="mono" x="99.6" y="374" font-size="11.5" fill="#E6EAF2" textLength="227.7" lengthAdjust="spacingAndGlyphs">userDetailsMngr.createUser(user);</text>
  <text class="mono" x="99.6" y="393" font-size="11.5" fill="#E6EAF2" textLength="158.7" lengthAdjust="spacingAndGlyphs">return userDetailsMngr;</text>
  <text class="mono" x="85.8" y="412" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <text class="mono" x="85.8" y="431" font-size="11.5" fill="#E6EAF2" textLength="34.5" lengthAdjust="spacingAndGlyphs">@Bean</text>
  <text class="mono" x="85.8" y="450" font-size="11.5" fill="#E6EAF2" textLength="289.8" lengthAdjust="spacingAndGlyphs">public PasswordEncoder passwordEncoder() {</text>
  <text class="mono" x="99.6" y="469" font-size="11.5" fill="#E6EAF2" textLength="282.9" lengthAdjust="spacingAndGlyphs">return NoOpPasswordEncoder.getInstance();</text>
  <text class="mono" x="85.8" y="488" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <text class="mono" x="72.0" y="507" font-size="11.5" fill="#E6EAF2" textLength="6.9" lengthAdjust="spacingAndGlyphs">}</text>
  <g class="an a1"><path d="M60,166 H468 V512 A10,10 0 0 1 458,522 H70 A10,10 0 0 1 60,512 Z" fill="#1F2430" fill-opacity=".92"/><text x="264" y="330" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Todavía no existe WebSecurityConfig</text><text x="264" y="352" text-anchor="middle" font-size="12.5" fill="#9AA3B5">Solo está la dependencia de Spring Security</text></g>
  <rect x="520" y="150" width="376" height="138" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/>
  <text class="mono" x="536" y="174" font-size="13.5" font-weight="700" fill="#4453C9">InMemoryUserDetailsManager</text>
  <text class="an a1" x="536" y="194" font-size="12" fill="#454C61">lo configura Spring Boot por su cuenta</text>
  <text class="ls a26" x="536" y="194" font-size="12" fill="#454C61">lo crea su método userDetailsService()</text>
  <g class="an a1"><rect x="536" y="208" width="344" height="64" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="708" y="231" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="328">user</text><text x="708" y="250" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="328">contraseña generada: 0be98d58-…</text></g>
  <g class="an a23"><rect x="536" y="208" width="344" height="64" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="708" y="240" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">sin usuarios</text></g>
  <g class="ls a46"><rect x="536" y="208" width="344" height="64" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="708" y="231" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="328">miUsuario</text><text x="708" y="250" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="328">password 123456 · authorities read</text></g>
  <g class="an a1"><rect x="520" y="312" width="376" height="52" rx="10" fill="#1F2430"/><text class="mono" x="534" y="333" font-size="11.5" fill="#E6EAF2">Using generated security password:</text><text class="mono" x="534" y="352" font-size="11.5" fill="#F0C572">0be98d58-3edd-49c4-b73a-e0a3fdda1809</text></g>
  <g class="an a2"><rect x="520" y="312" width="376" height="52" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="708" y="329" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#C2354F" data-fit="360">El usuario por defecto ya no se crea</text><text x="708" y="348" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="360">Spring Boot cede ante su @Bean</text></g>
  <g class="an a34"><rect x="520" y="312" width="376" height="52" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text class="mono" x="708" y="329" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="360">UserDetails</text><text x="708" y="348" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="360">miUsuario · 123456 · read</text></g>
  <g class="ls a56"><rect x="520" y="312" width="376" height="52" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="708" y="329" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="360">NoOpPasswordEncoder</text><text x="708" y="348" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="360">compara la contraseña tal cual, sin cifrar</text></g>
  <text class="h" x="520" y="398">QUIÉN PUEDE INICIAR SESIÓN</text>
  <rect x="520" y="408" width="180" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="610" y="425" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="164">user</text><text x="610" y="444" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="164">la contraseña de la consola</text>
  <rect x="716" y="408" width="180" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="806" y="425" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="164">miUsuario</text><text x="806" y="444" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="164">contraseña 123456</text>
  <g class="an a1"><rect x="520" y="470" width="180" height="28" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="610" y="484" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235" data-fit="164">entra</text></g>
  <g class="ls a26"><rect x="520" y="470" width="180" height="28" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="610" y="484" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="164">ya no existe</text></g>
  <g class="an a13"><rect x="716" y="470" width="180" height="28" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="806" y="484" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="164">no existe</text></g>
  <g class="an a4"><rect x="716" y="470" width="180" height="28" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="806" y="484" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="164">falta el PasswordEncoder</text></g>
  <g class="ls a56"><rect x="716" y="470" width="180" height="28" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="806" y="484" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235" data-fit="164">entra</text></g>
  <rect class="an a1" x="530" y="202" width="356" height="76" rx="14" fill="none" stroke="#556074" stroke-width="3"/>
  <rect class="an a1" x="514" y="402" width="192" height="64" rx="14" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an aM" x="514" y="144" width="388" height="150" rx="14" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a3" x="514" y="306" width="388" height="64" rx="14" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a4" x="530" y="202" width="356" height="76" rx="14" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a5" x="514" y="306" width="388" height="64" rx="14" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a6" x="710" y="402" width="192" height="64" rx="14" fill="none" stroke="#3A8235" stroke-width="3"/>
  <g class="an a1"><circle cx="880" cy="208" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="880" y="208" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text></g>
  <g><circle cx="896" cy="150" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="896" y="150" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">2</text></g>
  <g class="an a34"><circle cx="896" cy="312" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="896" y="312" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">3</text></g>
  <g class="ls a46"><circle cx="880" cy="208" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="880" y="208" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text></g>
  <g class="ls a56"><circle cx="896" cy="312" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="896" y="312" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text></g>
  <g><circle cx="896" cy="408" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="896" y="408" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">6</text></g>
  <circle class="an tk2" cx="468" cy="218" r="8" fill="#4453C9" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk4" cx="708" cy="312" r="8" fill="#3A8235" stroke="#FFFFFF" stroke-width="2"/>
  <circle class="an tk6" cx="806" cy="408" r="8" fill="#0F8478" stroke="#FFFFFF" stroke-width="2"/>
  <rect x="48" y="552" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="580" r="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="76" y="580" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#556074">1</text><text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Sin configuración, Spring Boot crea un usuario por defecto: user, con una contraseña que imprime en la consola.</text><text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">Vive en memoria y la contraseña cambia cada vez que se reinicia la aplicación.</text></g>
  <g class="an a2"><circle cx="76" cy="580" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="76" y="580" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">2</text><text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Al declarar un @Bean de tipo UserDetailsService, Spring Boot deja de crear ese usuario.</text><text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">El InMemoryUserDetailsManager nuevo arranca vacío: es una lista de usuarios en memoria.</text></g>
  <g class="an a3"><circle cx="76" cy="580" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="580" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">3</text><text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">User.withUsername(...) construye un UserDetails: nombre, contraseña y authorities.</text><text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">Las authorities representan los roles o permisos del usuario.</text></g>
  <g class="an a4"><circle cx="76" cy="580" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="580" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">4</text><text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">createUser(user) lo agrega a la lista del manager.</text><text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">El usuario ya existe, pero todavía no puede entrar: falta decir cómo se compara la contraseña.</text></g>
  <g class="an a5"><circle cx="76" cy="580" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="580" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">5</text><text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El segundo @Bean es el PasswordEncoder: NoOpPasswordEncoder compara la contraseña tal cual, sin cifrar.</text><text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">Sirve para aprender; una aplicación real usa un encoder que sí la protege, como BCryptPasswordEncoder.</text></g>
  <g class="an a6"><circle cx="76" cy="580" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="580" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">6</text><text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Al iniciar sesión, Spring Security le pide el usuario al manager y compara la contraseña con el encoder.</text><text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">Ahora entra miUsuario con 123456; el usuario user ya no existe.</text></g>
  <g class="st"><text x="68" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Su @Bean de UserDetailsService reemplaza al usuario por defecto; el PasswordEncoder dice cómo comparar la contraseña.</text><text x="68" y="593" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los seis pasos.</text></g>
  <text class="foot" x="48" y="640" data-fit="860">Los usuarios en memoria se pierden al reiniciar: por eso el siguiente paso es cargarlos de la base de datos.</text>
</svg>
```
