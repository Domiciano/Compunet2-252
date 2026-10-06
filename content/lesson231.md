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

```svg
<svg id="ssAutorizadas" data-steps="9" data-step-seconds="4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 656" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="ssAutorizadas-ttl ssAutorizadas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="ssAutorizadas-ttl">Un request, dos finales: sin sesión y con sesión</title>
  <desc id="ssAutorizadas-dsc">Animación en nueve pasos con los filtros de seguridad a la izquierda, las HTTP Sessions del servidor arriba a la derecha y, debajo, los beans del Application Context y la base de datos. Caso uno, sin sesión. Uno: llega GET /courses sin cookie. Dos: el SecurityContextHolder queda vacío y AuthorizationFilter lo consulta. Tres: AuthorizationFilter corta el request y responde 302 a /login; los beans y la base de datos no se tocan. Caso dos, con sesión. Cuatro: el mismo GET lleva la cookie JSESSIONID. Cinco: SecurityContextPersistenceFilter busca la sesión y carga su SecurityContext en el SecurityContextHolder. Seis: AuthorizationFilter verifica el acceso y deja pasar el request al controller. Siete: controller, service y repository consultan la base de datos. Ocho: los datos vuelven al controller. Nueve: la respuesta atraviesa los filtros y llega al navegador con 200 OK.</desc>
  <defs>
    <style>
      #ssAutorizadas .title{fill:#161A26;font-size:22px;font-weight:700}
      #ssAutorizadas .sub{fill:#79809A;font-size:13.5px}
      #ssAutorizadas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #ssAutorizadas .foot{fill:#79809A;font-size:12px}
      #ssAutorizadas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #ssAutorizadas .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#ssAutorizadas-ar-teal)}
      #ssAutorizadas .ar-green{fill:none;stroke:#3A8235;stroke-width:1.75;marker-end:url(#ssAutorizadas-ar-green)}
      #ssAutorizadas .an,#ssAutorizadas .ls,#ssAutorizadas .st{animation-duration:36s;animation-iteration-count:infinite;animation-timing-function:linear}
      #ssAutorizadas .an{opacity:0}
      #ssAutorizadas .st{animation-name:ssAutorizadas-hide}
      #ssAutorizadas .a1{animation-name:ssAutorizadas-a1}
      @keyframes ssAutorizadas-a1{0%{opacity:0} 2%{opacity:1} 9.11%{opacity:1} 11.11%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a2{animation-name:ssAutorizadas-a2}
      @keyframes ssAutorizadas-a2{0%{opacity:0} 11.11%{opacity:0} 13.11%{opacity:1} 20.22%{opacity:1} 22.22%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a3{animation-name:ssAutorizadas-a3}
      @keyframes ssAutorizadas-a3{0%{opacity:0} 22.22%{opacity:0} 24.22%{opacity:1} 31.33%{opacity:1} 33.33%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a4{animation-name:ssAutorizadas-a4}
      @keyframes ssAutorizadas-a4{0%{opacity:0} 33.33%{opacity:0} 35.33%{opacity:1} 42.44%{opacity:1} 44.44%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a5{animation-name:ssAutorizadas-a5}
      @keyframes ssAutorizadas-a5{0%{opacity:0} 44.44%{opacity:0} 46.44%{opacity:1} 53.56%{opacity:1} 55.56%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a6{animation-name:ssAutorizadas-a6}
      @keyframes ssAutorizadas-a6{0%{opacity:0} 55.56%{opacity:0} 57.56%{opacity:1} 64.67%{opacity:1} 66.67%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a7{animation-name:ssAutorizadas-a7}
      @keyframes ssAutorizadas-a7{0%{opacity:0} 66.67%{opacity:0} 68.67%{opacity:1} 75.78%{opacity:1} 77.78%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a8{animation-name:ssAutorizadas-a8}
      @keyframes ssAutorizadas-a8{0%{opacity:0} 77.78%{opacity:0} 79.78%{opacity:1} 86.89%{opacity:1} 88.89%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a9{animation-name:ssAutorizadas-a9}
      @keyframes ssAutorizadas-a9{0%{opacity:0} 88.89%{opacity:0} 90.89%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssAutorizadas .a13{animation-name:ssAutorizadas-a13}
      @keyframes ssAutorizadas-a13{0%{opacity:0} 2%{opacity:1} 31.33%{opacity:1} 33.33%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a14{animation-name:ssAutorizadas-a14}
      @keyframes ssAutorizadas-a14{0%{opacity:0} 2%{opacity:1} 42.44%{opacity:1} 44.44%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a49{animation-name:ssAutorizadas-a49}
      @keyframes ssAutorizadas-a49{0%{opacity:0} 33.33%{opacity:0} 35.33%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssAutorizadas .a59{animation-name:ssAutorizadas-a59}
      @keyframes ssAutorizadas-a59{0%{opacity:0} 44.44%{opacity:0} 46.44%{opacity:1} 98%{opacity:1} 100%{opacity:0}}
      #ssAutorizadas .a23{animation-name:ssAutorizadas-a23}
      @keyframes ssAutorizadas-a23{0%{opacity:0} 11.11%{opacity:0} 13.11%{opacity:1} 31.33%{opacity:1} 33.33%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .a56{animation-name:ssAutorizadas-a56}
      @keyframes ssAutorizadas-a56{0%{opacity:0} 44.44%{opacity:0} 46.44%{opacity:1} 64.67%{opacity:1} 66.67%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .aN{animation-name:ssAutorizadas-aN}
      @keyframes ssAutorizadas-aN{0%{opacity:0} 2%{opacity:1} 9.11%{opacity:1} 11.11%{opacity:0} 33.33%{opacity:0} 35.33%{opacity:1} 42.44%{opacity:1} 44.44%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .aS{animation-name:ssAutorizadas-aS}
      @keyframes ssAutorizadas-aS{0%{opacity:0} 2%{opacity:1} 9.11%{opacity:1} 11.11%{opacity:0} 33.33%{opacity:0} 35.33%{opacity:1} 53.56%{opacity:1} 55.56%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .aC{animation-name:ssAutorizadas-aC}
      @keyframes ssAutorizadas-aC{0%{opacity:0} 55.56%{opacity:0} 57.56%{opacity:1} 64.67%{opacity:1} 66.67%{opacity:0} 77.78%{opacity:0} 79.78%{opacity:1} 86.89%{opacity:1} 88.89%{opacity:0} 100%{opacity:0}}
      #ssAutorizadas .hp0{animation-name:ssAutorizadas-hp0}
      @keyframes ssAutorizadas-hp0{0%,0.89%{opacity:0;transform:translate(0,0)}1.33%{opacity:1;transform:translate(0,0)}6.11%{opacity:1;transform:translate(0px,20px)}9.78%{opacity:1;transform:translate(0px,20px)}10.22%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssAutorizadas .hp1{animation-name:ssAutorizadas-hp1}
      @keyframes ssAutorizadas-hp1{0%,12%{opacity:0;transform:translate(0,0)}12.44%{opacity:1;transform:translate(0,0)}17.22%{opacity:1;transform:translate(0px,20px)}20.89%{opacity:1;transform:translate(0px,20px)}21.33%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssAutorizadas .hp2{animation-name:ssAutorizadas-hp2}
      @keyframes ssAutorizadas-hp2{0%,22.89%{opacity:0;transform:translate(0,0)}23.33%{opacity:1;transform:translate(0,0)}26.11%{opacity:1;transform:translate(0px,-20px)}32%{opacity:1;transform:translate(0px,-20px)}32.44%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssAutorizadas .hp3{animation-name:ssAutorizadas-hp3}
      @keyframes ssAutorizadas-hp3{0%,26.44%{opacity:0;transform:translate(0,0)}26.89%{opacity:1;transform:translate(0,0)}29.67%{opacity:1;transform:translate(0px,-20px)}32%{opacity:1;transform:translate(0px,-20px)}32.44%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssAutorizadas .hp4{animation-name:ssAutorizadas-hp4}
      @keyframes ssAutorizadas-hp4{0%,34.22%{opacity:0;transform:translate(0,0)}34.67%{opacity:1;transform:translate(0,0)}39.44%{opacity:1;transform:translate(0px,20px)}43.11%{opacity:1;transform:translate(0px,20px)}43.56%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssAutorizadas .hp5{animation-name:ssAutorizadas-hp5}
      @keyframes ssAutorizadas-hp5{0%,45.11%{opacity:0;transform:translate(0,0)}45.56%{opacity:1;transform:translate(0,0)}48.33%{opacity:1;transform:translate(34px,0px)}54.22%{opacity:1;transform:translate(34px,0px)}54.67%,100%{opacity:0;transform:translate(34px,0px)}}
      #ssAutorizadas .hp6{animation-name:ssAutorizadas-hp6}
      @keyframes ssAutorizadas-hp6{0%,48.67%{opacity:0;transform:translate(0,0)}49.11%{opacity:1;transform:translate(0,0)}51.89%{opacity:1;transform:translate(-34px,0px)}54.22%{opacity:1;transform:translate(-34px,0px)}54.67%,100%{opacity:0;transform:translate(-34px,0px)}}
      #ssAutorizadas .hp7{animation-name:ssAutorizadas-hp7}
      @keyframes ssAutorizadas-hp7{0%,56.22%{opacity:0;transform:translate(0,0)}56.67%{opacity:1;transform:translate(0,0)}59.44%{opacity:1;transform:translate(0px,20px)}65.33%{opacity:1;transform:translate(0px,20px)}65.78%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssAutorizadas .hp8{animation-name:ssAutorizadas-hp8}
      @keyframes ssAutorizadas-hp8{0%,59.78%{opacity:0;transform:translate(0,0)}60.22%{opacity:1;transform:translate(0,0)}63%{opacity:1;transform:translate(46px,0px)}65.33%{opacity:1;transform:translate(46px,0px)}65.78%,100%{opacity:0;transform:translate(46px,0px)}}
      #ssAutorizadas .hp9{animation-name:ssAutorizadas-hp9}
      @keyframes ssAutorizadas-hp9{0%,67.11%{opacity:0;transform:translate(0,0)}67.56%{opacity:1;transform:translate(0,0)}69.67%{opacity:1;transform:translate(0px,20px)}76.44%{opacity:1;transform:translate(0px,20px)}76.89%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssAutorizadas .hp10{animation-name:ssAutorizadas-hp10}
      @keyframes ssAutorizadas-hp10{0%,69.67%{opacity:0;transform:translate(0,0)}70.11%{opacity:1;transform:translate(0,0)}72.22%{opacity:1;transform:translate(0px,20px)}76.44%{opacity:1;transform:translate(0px,20px)}76.89%,100%{opacity:0;transform:translate(0px,20px)}}
      #ssAutorizadas .hp11{animation-name:ssAutorizadas-hp11}
      @keyframes ssAutorizadas-hp11{0%,72.22%{opacity:0;transform:translate(0,0)}72.67%{opacity:1;transform:translate(0,0)}74.78%{opacity:1;transform:translate(34px,0px)}76.44%{opacity:1;transform:translate(34px,0px)}76.89%,100%{opacity:0;transform:translate(34px,0px)}}
      #ssAutorizadas .hp12{animation-name:ssAutorizadas-hp12}
      @keyframes ssAutorizadas-hp12{0%,78.22%{opacity:0;transform:translate(0,0)}78.67%{opacity:1;transform:translate(0,0)}80.78%{opacity:1;transform:translate(-48px,0px)}87.56%{opacity:1;transform:translate(-48px,0px)}88%,100%{opacity:0;transform:translate(-48px,0px)}}
      #ssAutorizadas .hp13{animation-name:ssAutorizadas-hp13}
      @keyframes ssAutorizadas-hp13{0%,80.78%{opacity:0;transform:translate(0,0)}81.22%{opacity:1;transform:translate(0,0)}83.33%{opacity:1;transform:translate(0px,-20px)}87.56%{opacity:1;transform:translate(0px,-20px)}88%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssAutorizadas .hp14{animation-name:ssAutorizadas-hp14}
      @keyframes ssAutorizadas-hp14{0%,83.33%{opacity:0;transform:translate(0,0)}83.78%{opacity:1;transform:translate(0,0)}85.89%{opacity:1;transform:translate(0px,-20px)}87.56%{opacity:1;transform:translate(0px,-20px)}88%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssAutorizadas .hp15{animation-name:ssAutorizadas-hp15}
      @keyframes ssAutorizadas-hp15{0%,89.33%{opacity:0;transform:translate(0,0)}89.78%{opacity:1;transform:translate(0,0)}91.89%{opacity:1;transform:translate(-46px,0px)}98.67%{opacity:1;transform:translate(-46px,0px)}99.11%,100%{opacity:0;transform:translate(-46px,0px)}}
      #ssAutorizadas .hp16{animation-name:ssAutorizadas-hp16}
      @keyframes ssAutorizadas-hp16{0%,91.89%{opacity:0;transform:translate(0,0)}92.33%{opacity:1;transform:translate(0,0)}94.44%{opacity:1;transform:translate(0px,-20px)}98.67%{opacity:1;transform:translate(0px,-20px)}99.11%,100%{opacity:0;transform:translate(0px,-20px)}}
      #ssAutorizadas .hp17{animation-name:ssAutorizadas-hp17}
      @keyframes ssAutorizadas-hp17{0%,94.44%{opacity:0;transform:translate(0,0)}94.89%{opacity:1;transform:translate(0,0)}97%{opacity:1;transform:translate(0px,-20px)}98.67%{opacity:1;transform:translate(0px,-20px)}99.11%,100%{opacity:0;transform:translate(0px,-20px)}}
      @keyframes ssAutorizadas-hide{from{opacity:0}to{opacity:0}}
      @media (prefers-reduced-motion: reduce){#ssAutorizadas .an,#ssAutorizadas .ls,#ssAutorizadas .st{animation:none}}
    </style>
    <marker id="ssAutorizadas-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="ssAutorizadas-ar-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#3A8235"/></marker>
  </defs>
  <rect width="960" height="656" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un request, dos finales: sin sesión y con sesión</text>
  <text class="sub" x="48" y="80" data-fit="860">Los filtros de seguridad deciden si el request llega a los beans o se devuelve al login.</text>
  <g class="an a13"><rect x="712" y="36" width="200" height="28" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="812" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#C2354F" data-fit="184">CASO 1 · SIN SESIÓN</text></g>
  <g class="ls a49"><rect x="712" y="36" width="200" height="28" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="812" y="50" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#3A8235" data-fit="184">CASO 2 · CON SESIÓN</text></g>
  <rect x="48" y="104" width="316" height="420" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="64" y="128" data-fit="284">FILTROS DE SEGURIDAD</text>
  <rect x="388" y="104" width="524" height="166" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="404" y="128" data-fit="492">HTTP SESSIONS · EN EL SERVIDOR</text>
  <rect x="388" y="284" width="304" height="240" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="404" y="515" data-fit="272">APPLICATION CONTEXT · BEANS</text>
  <rect x="708" y="284" width="204" height="240" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <text class="h" x="724" y="308" data-fit="172">BASE DE DATOS</text>
  <rect x="64" y="140" width="284" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="an a13" x="206" y="158" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074">Navegador · sin cookie</text>
  <text class="ls a49" x="206" y="158" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074">Navegador · JSESSIONID=ABC123…</text>
  <rect x="64" y="220" width="284" height="36" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text class="mono" x="206" y="238" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#4453C9" data-fit="268">SecurityContextPersistenceFilter</text>
  <rect x="64" y="300" width="284" height="36" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="2.5"/><text class="mono" x="206" y="318" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="268">AuthorizationFilter</text>
  <path class="ar-teal" d="M72,178 V218"/><path class="ar-green" d="M88,218 V178"/>
  <path class="ar-teal" d="M72,258 V298"/><path class="ar-green" d="M88,298 V258"/>
  <path d="M206,338 V390" stroke="#556074" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
  <text x="216" y="368" font-size="12" font-weight="600" fill="#556074">consulta</text>
  <rect x="64" y="392" width="284" height="88" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="76" y="413" font-size="12.5" font-weight="700" fill="#4453C9">SecurityContextHolder</text>
  <g class="an a14"><rect x="76" y="424" width="260" height="44" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/><text x="206" y="446" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">vacío: nadie autenticado</text></g>
  <g class="ls a59"><rect x="76" y="424" width="260" height="44" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text class="mono" x="206" y="437" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="244">ana@icesi.edu.co</text><text x="206" y="456" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="244">authorities: read</text></g>
  <rect x="404" y="146" width="240" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="524" y="163" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="224">ABC123XYZ456</text><text x="524" y="182" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="224">SecurityContext de ana</text>
  <rect x="656" y="146" width="240" height="52" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text class="mono" x="776" y="163" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="224">QRS789LMN012</text><text x="776" y="182" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="224">SecurityContext de luis</text>
  <path class="ar-teal" d="M350,228 H386"/><path class="ar-green" d="M386,248 H350"/>
  <rect x="404" y="300" width="200" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="504" y="318" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="184">CoursesController</text>
  <rect x="404" y="380" width="200" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="504" y="398" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="184">CourseService</text>
  <rect x="404" y="460" width="200" height="36" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text class="mono" x="504" y="478" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="184">CourseRepository</text>
  <path class="ar-teal" d="M350,311 H402"/><path class="ar-green" d="M402,325 H350"/>
  <path class="ar-teal" d="M412,338 V378"/><path class="ar-green" d="M428,378 V338"/>
  <path class="ar-teal" d="M412,418 V458"/><path class="ar-green" d="M428,458 V418"/>
  <text class="h" x="720" y="428">TABLA COURSES</text>
  <rect x="720" y="438" width="180" height="72" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>
  <path d="M720,462 H900 V446 A8,8 0 0 0 892,438 H728 A8,8 0 0 0 720,446 Z" fill="#EFF1F5"/>
  <path d="M720,462 H900 M720,486 H900 M760,438 V510" stroke="#D9DEE8" stroke-width="1.25" fill="none"/>
  <text class="mono" x="730" y="450" dy="0.35em" font-size="10.5" font-weight="700" fill="#556074">id</text><text class="mono" x="770" y="450" dy="0.35em" font-size="10.5" font-weight="700" fill="#556074">name</text>
  <text class="mono" x="730" y="474" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">1</text><text class="mono" x="770" y="474" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">Computación II</text>
  <text class="mono" x="730" y="498" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">2</text><text class="mono" x="770" y="498" dy="0.35em" font-size="10.5" font-weight="400" fill="#161A26">Apps Móviles</text>
  <path class="ar-teal" d="M606,470 H718"/><path class="ar-green" d="M718,482 H606"/>
  <g class="an a13"><rect x="389" y="285" width="302" height="238" rx="11" fill="#FBFBFD" fill-opacity=".82"/><rect x="709" y="285" width="202" height="238" rx="11" fill="#FBFBFD" fill-opacity=".82"/><text x="540" y="358" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#C2354F">El request no llega hasta aquí</text><text x="810" y="358" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#C2354F">No se consulta</text></g>
  <rect class="an aN" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#0F8478" stroke-width="3"/>
  <rect class="an a3" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a9" x="60" y="136" width="292" height="44" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an aS" x="60" y="216" width="292" height="44" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a23" x="60" y="296" width="292" height="44" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a6" x="60" y="296" width="292" height="44" rx="12" fill="none" stroke="#4453C9" stroke-width="3"/>
  <rect class="an a2" x="60" y="388" width="292" height="96" rx="12" fill="none" stroke="#C2354F" stroke-width="3"/>
  <rect class="an a56" x="60" y="388" width="292" height="96" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an a5" x="400" y="142" width="248" height="60" rx="12" fill="none" stroke="#3A8235" stroke-width="3"/>
  <rect class="an aC" x="400" y="296" width="208" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a7" x="400" y="376" width="208" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a7" x="400" y="456" width="208" height="44" rx="12" fill="none" stroke="#A96C05" stroke-width="3"/>
  <rect class="an a7" x="720" y="462" width="180" height="48" fill="#0F8478" fill-opacity=".12" stroke="#0F8478" stroke-width="2"/>
  <g class="an hp0"><rect x="62" y="168" width="195" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="178" r="5" fill="#0F8478"/><text class="mono" x="83" y="178" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /courses · sin cookie</text></g>
  <g class="an hp1"><rect x="62" y="248" width="155" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="258" r="5" fill="#0F8478"/><text class="mono" x="83" y="258" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">request sin usuario</text></g>
  <g class="an hp2"><rect x="78" y="288" width="175" height="20" rx="10" fill="#FFFFFF" stroke="#C2354F" stroke-width="1.5"/><circle cx="88" cy="298" r="5" fill="#C2354F"/><text class="mono" x="99" y="298" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">302 · Location: /login</text></g>
  <g class="an hp3"><rect x="78" y="208" width="175" height="20" rx="10" fill="#FFFFFF" stroke="#C2354F" stroke-width="1.5"/><circle cx="88" cy="218" r="5" fill="#C2354F"/><text class="mono" x="99" y="218" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">302 · Location: /login</text></g>
  <g class="an hp4"><rect x="62" y="168" width="248" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="178" r="5" fill="#0F8478"/><text class="mono" x="83" y="178" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /courses · JSESSIONID=ABC123…</text></g>
  <g class="an hp5"><rect x="344" y="218" width="182" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="354" cy="228" r="5" fill="#0F8478"/><text class="mono" x="365" y="228" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">JSESSIONID=ABC123XYZ456</text></g>
  <g class="an hp6"><rect x="382" y="238" width="175" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="392" cy="248" r="5" fill="#3A8235"/><text class="mono" x="403" y="248" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">SecurityContext de ana</text></g>
  <g class="an hp7"><rect x="62" y="248" width="122" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="72" cy="258" r="5" fill="#0F8478"/><text class="mono" x="83" y="258" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">request de ana</text></g>
  <g class="an hp8"><rect x="342" y="273" width="109" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="352" cy="283" r="5" fill="#0F8478"/><text class="mono" x="363" y="283" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">GET /courses</text></g>
  <g class="an hp9"><rect x="402" y="328" width="89" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="412" cy="338" r="5" fill="#0F8478"/><text class="mono" x="423" y="338" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">findAll()</text></g>
  <g class="an hp10"><rect x="402" y="408" width="89" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="412" cy="418" r="5" fill="#0F8478"/><text class="mono" x="423" y="418" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">findAll()</text></g>
  <g class="an hp11"><rect x="606" y="460" width="70" height="20" rx="10" fill="#FFFFFF" stroke="#0F8478" stroke-width="1.5"/><circle cx="616" cy="470" r="5" fill="#0F8478"/><text class="mono" x="627" y="470" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">SELECT</text></g>
  <g class="an hp12"><rect x="666" y="472" width="63" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="676" cy="482" r="5" fill="#3A8235"/><text class="mono" x="687" y="482" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">filas</text></g>
  <g class="an hp13"><rect x="418" y="448" width="109" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="428" cy="458" r="5" fill="#3A8235"/><text class="mono" x="439" y="458" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">List&lt;Course&gt;</text></g>
  <g class="an hp14"><rect x="418" y="368" width="109" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="428" cy="378" r="5" fill="#3A8235"/><text class="mono" x="439" y="378" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">List&lt;Course&gt;</text></g>
  <g class="an hp15"><rect x="388" y="273" width="162" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="398" cy="283" r="5" fill="#3A8235"/><text class="mono" x="409" y="283" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">vista courses (HTML)</text></g>
  <g class="an hp16"><rect x="78" y="288" width="116" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="298" r="5" fill="#3A8235"/><text class="mono" x="99" y="298" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">200 OK · HTML</text></g>
  <g class="an hp17"><rect x="78" y="208" width="116" height="20" rx="10" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/><circle cx="88" cy="218" r="5" fill="#3A8235"/><text class="mono" x="99" y="218" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">200 OK · HTML</text></g>
  <rect x="48" y="540" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <g class="an a1"><circle cx="76" cy="568" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">1</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 1 · Llega GET /courses sin la cookie JSESSIONID.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">SecurityContextPersistenceFilter no tiene con qué buscar una sesión.</text></g>
  <g class="an a2"><circle cx="76" cy="568" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">2</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El SecurityContextHolder queda vacío: para Spring Security, este request no es de nadie.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">AuthorizationFilter lo consulta para decidir si la ruta se puede atender.</text></g>
  <g class="an a3"><circle cx="76" cy="568" r="12" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">3</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Como /courses exige un usuario autenticado, AuthorizationFilter corta el request.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">El navegador recibe una redirección a /login; ni los beans ni la base de datos se enteran.</text></g>
  <g class="an a4"><circle cx="76" cy="568" r="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">4</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Caso 2 · Después del login, el mismo GET /courses lleva la cookie JSESSIONID.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">El navegador la envía automáticamente en cada request.</text></g>
  <g class="an a5"><circle cx="76" cy="568" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">5</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">SecurityContextPersistenceFilter busca esa sesión entre las HTTP Sessions y recupera su SecurityContext.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">Lo carga en el SecurityContextHolder: mientras dure este request, el usuario es ana.</text></g>
  <g class="an a6"><circle cx="76" cy="568" r="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9">6</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">AuthorizationFilter verifica que ana puede acceder a /courses y deja pasar el request.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">Solo ahora llega al controller.</text></g>
  <g class="an a7"><circle cx="76" cy="568" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">7</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">El controller usa el service, y este el repository, que consulta la base de datos.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">Son los beans del Application Context, como en cualquier request.</text></g>
  <g class="an a8"><circle cx="76" cy="568" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">8</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">Los datos vuelven por el mismo camino hasta el controller.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">Con ellos arma la vista.</text></g>
  <g class="an a9"><circle cx="76" cy="568" r="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="76" y="568" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">9</text><text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">La respuesta atraviesa los filtros de regreso y llega al navegador.</text><text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">Al terminar se limpia el SecurityContextHolder: el siguiente request vuelve a empezar por la cookie.</text></g>
  <g class="st"><text x="68" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Sin sesión, el request muere en los filtros; con sesión, llega a los beans y a la base de datos.</text><text x="68" y="581" font-size="13" fill="#454C61" data-fit="820">La animación recorre los dos casos.</text></g>
  <text class="foot" x="48" y="628" data-fit="860">El SecurityContext vive en la sesión HTTP; el SecurityContextHolder solo lo sostiene mientras dura el request.</text>
</svg>
```

El request, ahora lleva la cookie `JSESSIONID`. Esta cookie es verificada por `SecurityContextPersistenceFilter`.

Si el request se mantiene, el filtro recupera la HTTPSession de Tomcat. Por debajo la HTTPSession tiene un objeto llamado `SecurityContext` que se carga en el `SecurityContextHolder`. Esto se mantiene almacenado de forma estática durante el proceso de request-response. Una vez ha terminado al transacción, se limpia el `SecurityContext`

Posteriomente, el `AuthorizationFilter` verifica permisos de esa sesión verificando si la ruta que se solicita en el `request` si es accesible por el usuario con la sesión identificada con `JSESSIONID`
