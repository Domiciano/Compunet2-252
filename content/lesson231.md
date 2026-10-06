# Cargando usuario desde la DB

<!-- tags: UserDetailsService, loadUserByUsername, UserDetails, usuarios en base de datos,
     DaoAuthenticationProvider, SecurityUser, UsernameNotFoundException, Bad credentials,
     SecurityContextHolder, AuthorizationFilter -->

## Cargando usuario de DB

Ya hemos visto cómo se carga un in-memory user. Pero ahora, tenemos que llevar esta forma en la que funcionan los usuarios en SpringBoot para habilitar los usuarios almacenados en base de datos.

```svg
<svg id="ssCargaDb" data-steps="7" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 738" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="ssCargaDb-ttl ssCargaDb-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="ssCargaDb-ttl">Del formulario a la base de datos: quién carga el usuario</title>
  <desc id="ssCargaDb-dsc">Animación en siete pasos y dos columnas: las piezas de Spring Security a la izquierda y el código propio a la derecha. En cada paso, un punto viaja de bloque en bloque con lo que entra o lo que sale. Uno: del navegador llega POST /login con el correo y la contraseña, y UsernamePasswordAuthenticationFilter arma una Authentication sin autenticar. Dos: el filtro se la pasa al AuthenticationManager, que se la entrega a DaoAuthenticationProvider. Tres: el provider llama a loadUserByUsername de CustomUserDetailsService con el correo. Cuatro: ese servicio llama a findByEmail de UserService, este al de UserRepository, y el repositorio hace un SELECT en la tabla users. Cinco: vuelve un User, que se envuelve en un SecurityUser, el UserDetails que sale de loadUserByUsername. Seis: el provider le entrega las dos contraseñas al PasswordEncoder, que responde true. Siete: sube una Authentication autenticada, se crea la sesión HTTP y la respuesta sale con Set-Cookie JSESSIONID.</desc>
  <defs>
    <style>
      #ssCargaDb .title{fill:#161A26;font-size:22px;font-weight:700}
      #ssCargaDb .sub{fill:#79809A;font-size:13.5px}
      #ssCargaDb .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #ssCargaDb .foot{fill:#79809A;font-size:12px}
      #ssCargaDb .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #ssCargaDb .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#ssCargaDb-ar-teal)}
      #ssCargaDb .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#ssCargaDb-ar-green)}
      #ssCargaDb .an,#ssCargaDb .ls,#ssCargaDb .st{animation-duration:28s;animation-iteration-count:infinite;animation-timing-function:linear}
      #ssCargaDb .an{opacity:0}
      #ssCargaDb .st{animation-name:ssCargaDb-hide}
      #ssCargaDb .a1{animation-name:ssCargaDb-a1}
      @keyframes ssCargaDb-a1{0%{opacity:0} 2%{opacity:1} 12.29%{opacity:1} 14.29%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a2{animation-name:ssCargaDb-a2}
      @keyframes ssCargaDb-a2{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 26.57%{opacity:1} 28.57%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a3{animation-name:ssCargaDb-a3}
      @keyframes ssCargaDb-a3{0%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a4{animation-name:ssCargaDb-a4}
      @keyframes ssCargaDb-a4{0%{opacity:0} 42.86%{opacity:0} 44.86%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a5{animation-name:ssCargaDb-a5}
      @keyframes ssCargaDb-a5{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a6{animation-name:ssCargaDb-a6}
      @keyframes ssCargaDb-a6{0%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a7{animation-name:ssCargaDb-a7}
      @keyframes ssCargaDb-a7{0%{opacity:0} 85.71%{opacity:0} 87.71%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssCargaDb .a14{animation-name:ssCargaDb-a14}
      @keyframes ssCargaDb-a14{0%{opacity:0} 2%{opacity:1} 55.14%{opacity:1} 57.14%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a35{animation-name:ssCargaDb-a35}
      @keyframes ssCargaDb-a35{0%{opacity:0} 28.57%{opacity:0} 30.57%{opacity:1} 69.43%{opacity:1} 71.43%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .a57{animation-name:ssCargaDb-a57}
      @keyframes ssCargaDb-a57{0%{opacity:0} 57.14%{opacity:0} 59.14%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssCargaDb .aD{animation-name:ssCargaDb-aD}
      @keyframes ssCargaDb-aD{0%{opacity:0} 14.29%{opacity:0} 16.29%{opacity:1} 40.86%{opacity:1} 42.86%{opacity:0} 71.43%{opacity:0} 73.43%{opacity:1} 83.71%{opacity:1} 85.71%{opacity:0} 100%{opacity:0}}
      #ssCargaDb .hp0{animation-name:ssCargaDb-hp0}
      @keyframes ssCargaDb-hp0{0%,1.14%{opacity:0;transform:translate(0,0)}1.71%{opacity:1;transform:translate(0,0)}7.86%{opacity:1;transform:translate(0px,20px)}12.57%{opacity:1;transform:translate(0px,20px)}13.14%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssCargaDb .hp1{animation-name:ssCargaDb-hp1}
      @keyframes ssCargaDb-hp1{0%,15.14%{opacity:0;transform:translate(0,0)}15.71%{opacity:1;transform:translate(0,0)}19.29%{opacity:1;transform:translate(0px,20px)}26.86%{opacity:1;transform:translate(0px,20px)}27.43%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssCargaDb .hp2{animation-name:ssCargaDb-hp2}
      @keyframes ssCargaDb-hp2{0%,19.71%{opacity:0;transform:translate(0,0)}20.29%{opacity:1;transform:translate(0,0)}23.86%{opacity:1;transform:translate(0px,20px)}26.86%{opacity:1;transform:translate(0px,20px)}27.43%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssCargaDb .hp3{animation-name:ssCargaDb-hp3}
      @keyframes ssCargaDb-hp3{0%,29.71%{opacity:0;transform:translate(0,0)}30.29%{opacity:1;transform:translate(0,0)}36.43%{opacity:1;transform:translate(46px,0px)}41.14%{opacity:1;transform:translate(46px,0px)}41.71%,100%{opacity:0;transform:translate(46px,0px)}}
      #ssCargaDb .hp4{animation-name:ssCargaDb-hp4}
      @keyframes ssCargaDb-hp4{0%,43.43%{opacity:0;transform:translate(0,0)}44%{opacity:1;transform:translate(0,0)}46.71%{opacity:1;transform:translate(0px,20px)}55.43%{opacity:1;transform:translate(0px,20px)}56%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssCargaDb .hp5{animation-name:ssCargaDb-hp5}
      @keyframes ssCargaDb-hp5{0%,46.71%{opacity:0;transform:translate(0,0)}47.29%{opacity:1;transform:translate(0,0)}50%{opacity:1;transform:translate(0px,20px)}55.43%{opacity:1;transform:translate(0px,20px)}56%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssCargaDb .hp6{animation-name:ssCargaDb-hp6}
      @keyframes ssCargaDb-hp6{0%,50%{opacity:0;transform:translate(0,0)}50.57%{opacity:1;transform:translate(0,0)}53.29%{opacity:1;transform:translate(34px,0px)}55.43%{opacity:1;transform:translate(34px,0px)}56%,100%{opacity:0;transform:translate(34px,0px)}}
      #ssCargaDb .hp7{animation-name:ssCargaDb-hp7}
      @keyframes ssCargaDb-hp7{0%,57.43%{opacity:0;transform:translate(0,0)}58%{opacity:1;transform:translate(0,0)}60.14%{opacity:1;transform:translate(-48px,0px)}69.71%{opacity:1;transform:translate(-48px,0px)}70.29%,100%{opacity:0;transform:translate(-48px,0px)}}
      #ssCargaDb .hp8{animation-name:ssCargaDb-hp8}
      @keyframes ssCargaDb-hp8{0%,60%{opacity:0;transform:translate(0,0)}60.57%{opacity:1;transform:translate(0,0)}62.71%{opacity:1;transform:translate(0px,-20px)}69.71%{opacity:1;transform:translate(0px,-20px)}70.29%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssCargaDb .hp9{animation-name:ssCargaDb-hp9}
      @keyframes ssCargaDb-hp9{0%,62.57%{opacity:0;transform:translate(0,0)}63.14%{opacity:1;transform:translate(0,0)}65.29%{opacity:1;transform:translate(0px,-20px)}69.71%{opacity:1;transform:translate(0px,-20px)}70.29%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssCargaDb .hp10{animation-name:ssCargaDb-hp10}
      @keyframes ssCargaDb-hp10{0%,65.14%{opacity:0;transform:translate(0,0)}65.71%{opacity:1;transform:translate(0,0)}67.86%{opacity:1;transform:translate(-46px,0px)}69.71%{opacity:1;transform:translate(-46px,0px)}70.29%,100%{opacity:0;transform:translate(-46px,0px)}}
      #ssCargaDb .hp11{animation-name:ssCargaDb-hp11}
      @keyframes ssCargaDb-hp11{0%,72.29%{opacity:0;transform:translate(0,0)}72.86%{opacity:1;transform:translate(0,0)}76.43%{opacity:1;transform:translate(0px,24px)}84%{opacity:1;transform:translate(0px,24px)}84.57%,100%{opacity:0;transform:translate(0px,24px)}}
      #ssCargaDb .hp12{animation-name:ssCargaDb-hp12}
      @keyframes ssCargaDb-hp12{0%,76.86%{opacity:0;transform:translate(0,0)}77.43%{opacity:1;transform:translate(0,0)}81%{opacity:1;transform:translate(0px,-24px)}84%{opacity:1;transform:translate(0px,-24px)}84.57%,100%{opacity:0;transform:translate(0px,-24px)}}
      #ssCargaDb .hp13{animation-name:ssCargaDb-hp13}
      @keyframes ssCargaDb-hp13{0%,86.29%{opacity:0;transform:translate(0,0)}86.86%{opacity:1;transform:translate(0,0)}89.57%{opacity:1;transform:translate(0px,-20px)}98.29%{opacity:1;transform:translate(0px,-20px)}98.86%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssCargaDb .hp14{animation-name:ssCargaDb-hp14}
      @keyframes ssCargaDb-hp14{0%,89.57%{opacity:0;transform:translate(0,0)}90.14%{opacity:1;transform:translate(0,0)}92.86%{opacity:1;transform:translate(0px,-20px)}98.29%{opacity:1;transform:translate(0px,-20px)}98.86%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssCargaDb .hp15{animation-name:ssCargaDb-hp15}
      @keyframes ssCargaDb-hp15{0%,92.86%{opacity:0;transform:translate(0,0)}93.43%{opacity:1;transform:translate(0,0)}96.14%{opacity:1;transform:translate(0px,-20px)}98.29%{opacity:1;transform:translate(0px,-20px)}98.86%,100%{opacity:0;transform:translate(0px,-20px)}}
      @keyframes ssCargaDb-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#ssCargaDb .an,#ssCargaDb .ls,#ssCargaDb .st{animation:none}}
    </style>
    <marker id="ssCargaDb-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="ssCargaDb-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="738" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Del formulario a la base de datos: quién carga el usuario</text>
  <text class="sub" x="48" y="80" data-fit="860">Spring Security sabe autenticar, pero no sabe dónde están los usuarios: eso se lo dice su código.</text>
  <rect x="48" y="104" width="316" height="502" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="284">SPRING SECURITY</text>
  <rect x="388" y="104" width="524" height="502" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="404" y="128" data-fit="492">SU CÓDIGO</text>
  <rect x="64" y="140" width="284" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="206" y="158" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="268">Navegador</text>
  <rect x="64" y="220" width="284" height="36" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="206" y="238" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#4453C9" data-fit="268">UsernamePasswordAuthenticationFilter</text>
  <rect x="64" y="300" width="284" height="36" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="206" y="318" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="268">AuthenticationManager</text>
  <rect x="64" y="380" width="284" height="36" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text class="mono" x="206" y="398" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="268">DaoAuthenticationProvider</text>
  <rect x="64" y="460" width="284" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="206" y="478" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="268">PasswordEncoder</text>
  <path class="ar-teal" d="M72,178 V218"/><path class="ar-green" d="M88,218 V178"/>
  <path class="ar-teal" d="M72,258 V298"/><path class="ar-green" d="M88,298 V258"/>
  <path class="ar-teal" d="M72,338 V378"/><path class="ar-green" d="M88,378 V338"/>
  <path class="ar-teal" d="M72,418 V458"/><path class="ar-green" d="M88,458 V418"/>
  <text class="h" x="404" y="148">USUARIO AUTENTICADO</text><text class="h" x="668" y="148">CÓMO LEER LOS PUNTOS</text>
  <g class="an a14"><rect x="404" y="162" width="240" height="96" rx="10" fill="none" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="524" y="210" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">todavía no hay un UserDetails</text></g>
  <g class="ls a57"><rect x="404" y="162" width="240" height="96" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="416" y="183" font-size="13" font-weight="700" fill="#3A8235">SecurityUser</text><text x="628" y="183" text-anchor="end" font-size="11.5" fill="#454C61">es un UserDetails</text><rect x="416" y="194" width="216" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="524" y="211" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="200">User</text><text x="524" y="230" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="200">ana@icesi.edu.co · 123456</text></g>
  <rect x="668" y="162" width="228" height="96" rx="10" fill="#FBFBFD" stroke="#D9DEE8" stroke-width="1.5"/>
  <circle cx="700" cy="194" r="7" fill="#0F8478"/><circle cx="700" cy="228" r="7" fill="#3A8235"/>
  <text x="720" y="194" dy="0.35em" font-size="12.5" font-weight="600" fill="#161A26">lo que entra al bloque</text>
  <text x="720" y="228" dy="0.35em" font-size="12.5" font-weight="600" fill="#161A26">lo que sale del bloque</text>
  <rect x="404" y="380" width="200" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="504" y="398" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="184">CustomUserDetailsService</text>
  <rect x="404" y="460" width="200" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="504" y="478" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="184">UserService</text>
  <rect x="404" y="540" width="200" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="504" y="558" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="184">UserRepository</text>
  <path class="ar-teal" d="M350,391 H402"/><path class="ar-green" d="M402,405 H350"/>
  <path class="ar-teal" d="M412,418 V458"/><path class="ar-green" d="M428,458 V418"/>
  <path class="ar-teal" d="M412,498 V538"/><path class="ar-green" d="M428,538 V498"/>
  <text class="h" x="716" y="514">TABLA USERS</text>
  <rect x="716" y="522" width="180" height="72" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M716,546 H896 V530 A8,8 0 0 0 888,522 H724 A8,8 0 0 0 716,530 Z" fill="#EFF1F5"/>
  <path d="M716,546 H896 M716,570 H896 M840,522 V594" stroke="#D9DEE8" stroke-width="1.25" fill="none"/>
  <text class="mono" x="724" y="534" dy="0.35em" font-size="10.5" font-weight="700" fill="#556074">email</text><text class="mono" x="848" y="534" dy="0.35em" font-size="10.5" font-weight="700" fill="#556074">pass</text>
  <text class="mono" x="724" y="558" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">ana@icesi.edu.co</text><text class="mono" x="848" y="558" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">123456</text>
  <text class="mono" x="724" y="582" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">luis@icesi.edu.co</text><text class="mono" x="848" y="582" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">qwerty</text>
  <path class="ar-teal" d="M606,552 H714"/><path class="ar-green" d="M714,566 H606"/>
  <rect class="an a1" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a1" x="60" y="216" width="292" height="44" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a2" x="60" y="296" width="292" height="44" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an aD" x="60" y="376" width="292" height="44" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a35" x="400" y="376" width="208" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a4" x="400" y="456" width="208" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a4" x="400" y="536" width="208" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a5" x="398" y="156" width="252" height="108" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a6" x="60" y="456" width="292" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a7" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a4" x="716" y="546" width="180" height="24" fill="#0F8478" fill-opacity=".12" stroke="#0F8478" stroke-width="2"/>
  <circle cx="350" cy="238" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="350" y="238" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">1</text>
  <circle cx="350" cy="318" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="350" y="318" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">2</text>
  <circle cx="610" cy="398" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="610" y="398" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <circle cx="610" cy="478" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="610" y="478" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text>
  <circle cx="644" cy="162" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="644" y="162" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">5</text>
  <circle cx="350" cy="478" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="350" y="478" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text>
  <circle cx="350" cy="158" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="350" y="158" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">7</text>
  <g class="an hp0"><rect x="62" y="168" width="287" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="178" r="5" fill="#0F8478"/><text class="mono" x="83" y="178" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">POST /login · ana@icesi.edu.co · 123456</text></g>
  <g class="an hp1"><rect x="62" y="248" width="221" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="258" r="5" fill="#0F8478"/><text class="mono" x="83" y="258" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">Authentication sin autenticar</text></g>
  <g class="an hp2"><rect x="62" y="328" width="221" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="338" r="5" fill="#0F8478"/><text class="mono" x="83" y="338" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">Authentication sin autenticar</text></g>
  <g class="an hp3"><rect x="342" y="354" width="281" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="352" cy="364" r="5" fill="#0F8478"/><text class="mono" x="363" y="364" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">loadUserByUsername(&quot;ana@icesi.edu.co&quot;)</text></g>
  <g class="an hp4"><rect x="402" y="408" width="235" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="412" cy="418" r="5" fill="#0F8478"/><text class="mono" x="423" y="418" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">findByEmail(&quot;ana@icesi.edu.co&quot;)</text></g>
  <g class="an hp5"><rect x="402" y="488" width="235" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="412" cy="498" r="5" fill="#0F8478"/><text class="mono" x="423" y="498" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">findByEmail(&quot;ana@icesi.edu.co&quot;)</text></g>
  <g class="an hp6"><rect x="606" y="542" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="616" cy="552" r="5" fill="#0F8478"/><text class="mono" x="627" y="552" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">SELECT</text></g>
  <g class="an hp7"><rect x="660" y="556" width="56" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="670" cy="566" r="5" fill="#3A8235"/><text class="mono" x="681" y="566" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">fila</text></g>
  <g class="an hp8"><rect x="418" y="528" width="241" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="428" cy="538" r="5" fill="#3A8235"/><text class="mono" x="439" y="538" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">User · ana@icesi.edu.co · 123456</text></g>
  <g class="an hp9"><rect x="418" y="448" width="241" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="428" cy="458" r="5" fill="#3A8235"/><text class="mono" x="439" y="458" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">User · ana@icesi.edu.co · 123456</text></g>
  <g class="an hp10"><rect x="388" y="354" width="195" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="398" cy="364" r="5" fill="#3A8235"/><text class="mono" x="409" y="364" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">UserDetails: SecurityUser</text></g>
  <g class="an hp11"><rect x="62" y="416" width="208" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="426" r="5" fill="#0F8478"/><text class="mono" x="83" y="426" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">matches(&quot;123456&quot;, &quot;123456&quot;)</text></g>
  <g class="an hp12"><rect x="78" y="440" width="56" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="450" r="5" fill="#3A8235"/><text class="mono" x="99" y="450" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">true</text></g>
  <g class="an hp13"><rect x="78" y="368" width="202" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="378" r="5" fill="#3A8235"/><text class="mono" x="99" y="378" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">Authentication autenticada</text></g>
  <g class="an hp14"><rect x="78" y="288" width="202" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="298" r="5" fill="#3A8235"/><text class="mono" x="99" y="298" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">Authentication autenticada</text></g>
  <g class="an hp15"><rect x="78" y="208" width="228" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="218" r="5" fill="#3A8235"/><text class="mono" x="99" y="218" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">Set-Cookie: JSESSIONID=ABC123…</text></g>
  <rect x="48" y="622" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="650" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">1</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Llega el POST /login: UsernamePasswordAuthenticationFilter saca el usuario y la contraseña del formulario.</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">Con ellos arma un objeto Authentication, todavía sin autenticar.</text></g>
  <g class="an a2"><circle cx="76" cy="650" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">2</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El filtro le entrega esa Authentication al AuthenticationManager, que se la pasa a DaoAuthenticationProvider.</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">Este provider sabe autenticar, pero no sabe dónde están los usuarios.</text></g>
  <g class="an a3"><circle cx="76" cy="650" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Por eso llama a loadUserByUsername con el nombre de usuario y espera de vuelta un UserDetails.</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">Aquí entra su código: CustomUserDetailsService implementa UserDetailsService.</text></g>
  <g class="an a4"><circle cx="76" cy="650" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">4</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">CustomUserDetailsService le pasa el correo a UserService, y este a UserRepository, que consulta la tabla users.</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">Son el servicio y el repositorio de usuarios, como los de cualquier otra entidad.</text></g>
  <g class="an a5"><circle cx="76" cy="650" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">5</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">De vuelta sube un User; CustomUserDetailsService lo envuelve en un SecurityUser, que implementa UserDetails.</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">Eso es lo que sale de loadUserByUsername.</text></g>
  <g class="an a6"><circle cx="76" cy="650" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">6</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">DaoAuthenticationProvider le entrega al PasswordEncoder la contraseña del formulario y la de getPassword().</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">Si el usuario no existe o las contraseñas no coinciden, la autenticación falla.</text></g>
  <g class="an a7"><circle cx="76" cy="650" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="650" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">7</text><text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Coinciden: sube una Authentication ya autenticada y se crea la sesión HTTP.</text><text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">La respuesta sale con la cookie JSESSIONID, igual que con el usuario en memoria.</text></g>
  <g class="st"><text x="68" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Spring Security trae el filtro, el manager y el provider; usted escribe quién carga el usuario y qué lo representa.</text><text x="68" y="663" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los siete pasos.</text></g>
  <text class="foot" x="48" y="710" data-fit="860">Bloques índigo: los trae Spring Security. Bloques ámbar: los escribe usted.</text>
</svg>
```

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
