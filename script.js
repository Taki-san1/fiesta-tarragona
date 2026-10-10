// Fiestas y Eventos Tarragona - lógica de la aplicación

var fiestas = [];

// ---------- Reglas de negocio ----------

function obtenerValorInvitado(invitados) {
  if (invitados <= 100) {
    return 8000;
  } else if (invitados <= 500) {
    return 6000;
  } else {
    return 4000;
  }
}

function obtenerCuotaAdicional(horas) {
  if (horas <= 3) {
    return 100000;
  } else if (horas <= 6) {
    return 200000;
  } else {
    return 300000;
  }
}

// ---------- Utilidades ----------

function formatoPesos(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

function guardar() {
  try {
    localStorage.setItem("tarragona_fiestas", JSON.stringify(fiestas));
  } catch (e) {
    // si el navegador no permite guardar, la app sigue funcionando
  }
}

function cargar() {
  try {
    var datos = localStorage.getItem("tarragona_fiestas");
    if (datos) {
      fiestas = JSON.parse(datos);
    }
  } catch (e) {
    fiestas = [];
  }
}

// ---------- Validación ----------

function validar(cedula, invitados, horas) {
  if (cedula === "") {
    return "Debe ingresar la cédula del contratante.";
  }
  if (!/^\d{5,12}$/.test(cedula)) {
    return "La cédula debe tener solo números (entre 5 y 12 dígitos).";
  }
  if (invitados === "") {
    return "Debe ingresar la cantidad de invitados.";
  }
  if (horas === "") {
    return "Debe ingresar el número de horas.";
  }
  if (isNaN(invitados) || isNaN(horas)) {
    return "Invitados y horas deben ser números.";
  }
  if (Number(invitados) <= 0 || Number(horas) <= 0) {
    return "Invitados y horas deben ser mayores a cero.";
  }
  if (!Number.isInteger(Number(invitados)) || !Number.isInteger(Number(horas))) {
    return "Invitados y horas deben ser números enteros.";
  }
  return "";
}

// ---------- Pantalla ----------

function mostrarResultado(f) {
  document.getElementById("r-cedula").textContent = f.cedula;
  document.getElementById("r-invitados").textContent = f.invitados;
  document.getElementById("r-horas").textContent = f.horas;
  document.getElementById("r-valor").textContent = formatoPesos(f.valorInvitado);
  document.getElementById("r-costo").textContent = formatoPesos(f.costoInvitados);
  document.getElementById("r-cuota").textContent = formatoPesos(f.cuota);
  document.getElementById("r-total").textContent = formatoPesos(f.total);
  document.getElementById("resultado").hidden = false;
}

function actualizarAcumulados() {
  var totalInvitados = 0;
  var totalHoras = 0;
  var rango1 = 0, rango2 = 0, rango3 = 0;

  for (var i = 0; i < fiestas.length; i++) {
    totalInvitados += fiestas[i].invitados;
    totalHoras += fiestas[i].horas;

    if (fiestas[i].horas <= 3) {
      rango1++;
    } else if (fiestas[i].horas <= 6) {
      rango2++;
    } else {
      rango3++;
    }
  }

  document.getElementById("m-fiestas").textContent = fiestas.length;
  document.getElementById("m-invitados").textContent = totalInvitados;
  document.getElementById("m-horas").textContent = totalHoras;
  document.getElementById("m-rango1").textContent = rango1;
  document.getElementById("m-rango2").textContent = rango2;
  document.getElementById("m-rango3").textContent = rango3;
}

function actualizarTabla() {
  var cuerpo = document.querySelector("#historial tbody");
  cuerpo.innerHTML = "";

  for (var i = 0; i < fiestas.length; i++) {
    var fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + fiestas[i].cedula + "</td>" +
      "<td>" + fiestas[i].invitados + "</td>" +
      "<td>" + fiestas[i].horas + "</td>" +
      "<td>" + formatoPesos(fiestas[i].total) + "</td>";
    cuerpo.appendChild(fila);
  }

  var hayDatos = fiestas.length > 0;
  document.getElementById("historial").hidden = !hayDatos;
  document.getElementById("vacio").hidden = hayDatos;
  document.getElementById("reiniciar").hidden = !hayDatos;
}

function refrescar() {
  actualizarAcumulados();
  actualizarTabla();
}

// ---------- Eventos ----------

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  var cedula = document.getElementById("cedula").value.trim();
  var invitados = document.getElementById("invitados").value.trim();
  var horas = document.getElementById("horas").value.trim();
  var error = document.getElementById("error");

  var mensaje = validar(cedula, invitados, horas);
  if (mensaje !== "") {
    error.textContent = mensaje;
    document.getElementById("resultado").hidden = true;
    return;
  }
  error.textContent = "";

  invitados = Number(invitados);
  horas = Number(horas);

  var valorInvitado = obtenerValorInvitado(invitados);
  var cuota = obtenerCuotaAdicional(horas);
  var costoInvitados = invitados * valorInvitado;

  var fiesta = {
    cedula: cedula,
    invitados: invitados,
    horas: horas,
    valorInvitado: valorInvitado,
    costoInvitados: costoInvitados,
    cuota: cuota,
    total: costoInvitados + cuota
  };

  fiestas.push(fiesta);
  guardar();
  mostrarResultado(fiesta);
  refrescar();

  document.getElementById("formulario").reset();
});

document.getElementById("reiniciar").addEventListener("click", function () {
  if (confirm("¿Seguro que desea borrar todas las fiestas del mes?")) {
    fiestas = [];
    guardar();
    document.getElementById("resultado").hidden = true;
    refrescar();
  }
});

// ---------- Inicio ----------

cargar();
refrescar();
