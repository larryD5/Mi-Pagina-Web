/* la estructura mas reciente que debo usar siempre para funciones */
/* funciones anonimas de tipo flecha */

/* --- OBTENEMOS LOS ELEMENTOS DEL HTML QUE VAMOS A USAR UNA SOLA VEZ --- */

/* seccionLogin es para el formulario de inicio de sesion */
const seccionLogin = document.getElementById("seccion-login");

/* panelPrincipal es la seccion que se muestra despues de iniciar sesion */
const panelPrincipal = document.getElementById("panel-principal");

/* formularioLogin para identificar el formulario en javascript */
const formularioLogin = document.getElementById("formulario-login");

/* seccionPrincipal donde va el contenido segun el rol del usuario */
const seccionPrincipal = document.getElementById("seccion-principal");

/* --- FUNCIONES PARA MOSTRAR EL CONTENIDO DE CADA ROL --- */

/* Esta funcion prepara y muestra el contenido para el Donante */
function mostrarContenidoDonante() {
  let contenidoHTML = `
        <h2 class="subtitulo">Panel del Donante</h2>
        <h3>¿Qué puedes hacer aquí?</h3>
        <p>Bienvenido. Aquí puedes ofrecer artículos que ya no usas y ver el estado de tus donaciones.</p>
        <br>
        <h4>Ofrecer un Nuevo Artículo</h4>
        <form><input type="text" placeholder="Ej: Ventilador" style="padding: 10px; width: 300px;"><button type="button" class="boton-principal">Ofrecer Donación</button></form>
        <br>
        <h3>Historial de Mis Donaciones</h3>
        <table id="tabla-donante"></table>
    `;
  seccionPrincipal.innerHTML = contenidoHTML;

  /* Cargamos los datos para la tabla del donante */
  fetch("json/mis_donaciones.json")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      let tablaHTML = "<tr><th>Artículo</th><th>Estado</th></tr>";
      for (let item of datos) {
        tablaHTML += `<tr><td>${item.articulo}</td><td>${item.estado}</td></tr>`;
      }
      document.getElementById("tabla-donante").innerHTML = tablaHTML;
    });
}

/* Esta funcion prepara y muestra el contenido para el Administrador */
function mostrarContenidoAdmin() {
  let contenidoHTML = `
        <h2 class="subtitulo">Panel de Administración</h2>
        <h3>¿Qué puedes hacer aquí?</h3>
        <p>Este es el centro de control para revisar y gestionar todas las donaciones.</p>
        <br>
        <h3>Nuevas Ofertas por Revisar</h3>
        <table id="tabla-admin"></table>
    `;
  seccionPrincipal.innerHTML = contenidoHTML;

  fetch("json/admin_donaciones.json")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      let tablaHTML =
        "<tr><th>Artículo</th><th>Donante</th><th>Estado</th><th>Acción</th></tr>";
      for (let item of datos) {
        tablaHTML += `<tr><td>${item.articulo}</td><td>${item.donante}</td><td>${item.estado}</td><td><button>Revisar</button></td></tr>`;
      }
      document.getElementById("tabla-admin").innerHTML = tablaHTML;
    });
}

/* Esta funcion prepara y muestra el contenido para el Beneficiario */
function mostrarContenidoBeneficiario() {
  let contenidoHTML = `
        <h2 class="subtitulo">Catálogo de Artículos Disponibles</h2>
        <h3>¿Qué puedes hacer aquí?</h3>
        <p>Aquí puedes ver los artículos que están disponibles para ser solicitados.</p>
        <br>
        <h3>Artículos Disponibles</h3>
        <table id="tabla-beneficiario"></table>
    `;
  seccionPrincipal.innerHTML = contenidoHTML;

  fetch("json/catalogo.json")
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      let tablaHTML =
        "<tr><th>Artículo</th><th>Descripción</th><th>Disponibilidad</th></tr>";
      for (let item of datos) {
        tablaHTML += `<tr><td>${item.articulo}</td><td>${item.descripcion}</td><td>${item.disponibilidad}</td></tr>`;
      }
      document.getElementById("tabla-beneficiario").innerHTML = tablaHTML;
    });
}

/* --- FUNCIONES PRINCIPALES DE LA APLICACIÓN --- */

/* Esta funcion se ejecuta cuando se presiona el boton "Ingresar" */
function iniciarSesion(evento) {
  evento.preventDefault(); /* Esta linea detiene cualquier comportamiento por defecto del formulario */

  let user = document.getElementById("usuario").value;
  let pass = document.getElementById("clave").value;

  fetch("json/usuarios.json")
    .then((respuesta) => respuesta.json())
    .then((usuarios) => {
      let usuarioEncontrado = null;
      for (let u of usuarios) {
        if (u.usuario === user && u.clave === pass) {
          usuarioEncontrado = u;
          break;
        }
      }

      if (usuarioEncontrado) {
        localStorage.setItem(
          "usuarioActual",
          JSON.stringify(usuarioEncontrado)
        );
        mostrarPanelPrincipal(usuarioEncontrado);
      } else {
        document.getElementById("mensaje-error").innerHTML =
          "Usuario o clave incorrecta";
      }
    });
}

/* Esta funcion muestra el panel principal correcto segun el rol del usuario */
function mostrarPanelPrincipal(usuario) {
  seccionLogin.classList.add("oculto");
  panelPrincipal.classList.remove("oculto");

  document.getElementById("titulo-panel").innerHTML = "Panel de " + usuario.rol;
  document.getElementById("nombre-usuario").innerHTML =
    "Usuario: " + usuario.nombre;

  if (usuario.rol === "donante") {
    mostrarContenidoDonante();
  } else if (usuario.rol === "admin") {
    mostrarContenidoAdmin();
  } else if (usuario.rol === "beneficiario") {
    mostrarContenidoBeneficiario();
  }
}

/* Esta funcion es para cerrar la sesion */
function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  panelPrincipal.classList.add("oculto");
  seccionLogin.classList.remove("oculto");
  formularioLogin.reset();
}

/* Esta funcion se ejecuta apenas carga la pagina para ver si ya hay una sesion iniciada */
function verificarSesion() {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    mostrarPanelPrincipal(usuario);
  }
}

/* Ejecutamos la verificacion de sesion al cargar la pagina */
verificarSesion();
