// Clase que representa un Combo de Hamburguesa
class ComboHamburguesa {
  constructor(id, nombre, ingredientes) {
    this.id = id;
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.precio = 0; // Inicializamos el precio en 0
  }
}

// Clase que representa un producto individual
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}

// Combos de hamburguesa disponibles en la hamburguesería
const combosHamburguesa = [
  new ComboHamburguesa(1, "TheAsyncBurger", ["Carne", "Cebolla caramelizada", "Bacon", "Salsa especial", "Aros de pimiento."]),
  new ComboHamburguesa(2, "TheVanillaClassic", ["Carne", "Lechuga", "Tomate", "Cebolla", "Salsa de vainilla."]),
  new ComboHamburguesa(3, "TheES6Supreme", ["Carne de res y cerdo sazonada con hierbas", "Aguacate", "Queso cheddar", "Mayonesa."])
];

// Productos individuales disponibles en la hamburguesería
const productos = [
  new Producto("Hamburguesa Simple", 0),
  new Producto("Hamburguesa Doble", 500),
  new Producto("Papas", 300)
];

// Funciones para obtener las selecciones del formulario
function obtenerComboSeleccionado() {
  const comboId = document.querySelector('input[name="combo"]:checked').value;
  return parseInt(comboId);
}

function obtenerHamburguesaDoble() {
  const hamburguesaDoble = document.querySelector('input[name="doble"]:checked').value;
  return hamburguesaDoble === "si";
}

function obtenerOrdenPapas() {
  const ordenarPapas = document.querySelector('input[name="papas"]:checked').value;
  return ordenarPapas === "si";
}

// Función para mostrar el total a pagar en la página
function mostrarTotalAPagar(totalAPagar) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `<p>El total a pagar es de $${totalAPagar}</p>`;
  resultadoDiv.style.display = "block";
}

// Función para mostrar el pedido actual del cliente
function mostrarPedidoActual() {
  const pedidoDiv = document.getElementById("pedido");
  pedidoDiv.innerHTML = "<h3>Pedido actual:</h3>";

  const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidosGuardados.forEach((pedido, index) => {
    const hamburguesaDobleMsg = pedido.hamburguesaDoble ? "Hamburguesa doble" : "";
    const papasMsg = pedido.ordenarPapas ? "Papas" : "";

    const fechaFormateada = luxon.DateTime.fromFormat(pedido.fecha, "dd/MM/yyyy HH:mm:ss").toFormat("dd/MM/yyyy HH:mm:ss");

    pedidoDiv.innerHTML += `
      <div class="pedido-item">
        <p><strong>Combo ${index + 1}: ${pedido.combo.nombre}</strong></p>
        <p>${hamburguesaDobleMsg}</p>
        <p>${papasMsg}</p>
        <p>Total a pagar: $${pedido.total}</p>
        <p>Fecha y hora: ${fechaFormateada}</p>
        <button class="btn btn-secondary" onclick="borrarProducto(${index})">Borrar</button>      </div>
    `;
  });

  pedidoDiv.style.display = "block";
}

// Función para calcular el total a pagar por el pedido actual
function calcularTotalAPagar(comboHamburguesa, hamburguesaDoble, ordenarPapas) {
  let totalAPagar = comboHamburguesa.precio;

  if (hamburguesaDoble) {
    const hamburguesaDoblePrecio = productos.find(producto => producto.nombre === "Hamburguesa Doble").precio;
    totalAPagar += hamburguesaDoblePrecio;
  }

  if (ordenarPapas) {
    const papasPrecio = productos.find(producto => producto.nombre === "Papas").precio;
    totalAPagar += papasPrecio;
  }

  return totalAPagar;
}

// Función asincrónica para calcular el descuento
async function calcularDescuento(totalPedido) {
  return new Promise(resolve => {
    setTimeout(() => {
      let descuento = 0;

      if (totalPedido > 5000) {
        descuento = totalPedido * 0.2; 
      }

      resolve(descuento);
    }, 1000); 
  });
}

// Función para agregar el pedido actual a la lista de pedidos y mostrarlo en la página
async function agregarAlPedido() {
  const comboId = obtenerComboSeleccionado();
  const comboHamburguesaSeleccionado = combosHamburguesa.find(combo => combo.id === comboId);
  const hamburguesaDoble = obtenerHamburguesaDoble();
  const ordenarPapas = obtenerOrdenPapas();
  const totalAPagar = calcularTotalAPagar(comboHamburguesaSeleccionado, hamburguesaDoble, ordenarPapas);

  const fechaActual = luxon.DateTime.local(); 
  const fechaFormateada = fechaActual.toFormat("dd/MM/yyyy HH:mm:ss"); 

  const descuento = await calcularDescuento(totalAPagar);

  const pedido = {
    combo: comboHamburguesaSeleccionado,
    hamburguesaDoble: hamburguesaDoble,
    ordenarPapas: ordenarPapas,
    total: totalAPagar - descuento, 
    fecha: fechaFormateada 
  };

  let pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidosGuardados.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

  mostrarTotalAPagar(calcularTotalPedido());
  mostrarPedidoActual();

  limpiarFormulario();

  const btnFinalizar = document.getElementById("btn-finalizar");
  btnFinalizar.style.display = "block";
  btnFinalizar.addEventListener("click", finalizarPedido);

  const btnLimpiar = document.getElementById("btn-limpiar");
  btnLimpiar.style.display = "block";
  btnLimpiar.addEventListener("click", limpiarPedido);
}

// Función para calcular el total a pagar de todos los pedidos realizados
function calcularTotalPedido() {
  const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
  return pedidosGuardados.reduce((total, pedido) => total + pedido.total, 0);
}

// Función para mostrar el resultado final del pedido
function mostrarResultado(total) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `<p>El total a pagar es de $${total}</p>`;
  resultadoDiv.style.display = "block";
}

// Función para simular el tiempo de preparación
async function prepararPedido() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 5000); 
  });
}

// Función para finalizar el pedido
async function finalizarPedido() {
  const totalPedido = calcularTotalPedido();

  // Mostrar notificación de Toastify
  Toastify({
    text: "Realizando el pedido...",
    duration: 3000,
    gravity: "bottom",
    position: "left",
    style: {
      background: "linear-gradient(to right, #F0DB4F, #323330)"
    },
  }).showToast();

  // Simular la preparación del pedido
  await prepararPedido();

  // Calcular el descuento asincrónico
  const descuento = await calcularDescuento(totalPedido);

  // Mostrar notificación de descuento si aplica
  if (descuento > 0) {
    Toastify({
      text: `¡Descuento aplicado: $${descuento.toFixed(2)}!`,
      duration: 3000,
      gravity: "bottom",
      position: "left",
      style: {
        background: "linear-gradient(to right, #F0DB4F, #323330)"
      },
    }).showToast();
  }

  // Mostrar notificación de Toastify cuando el pedido está listo
  Toastify({
    text: "¡Pedido realizado con éxito!",
    duration: 3000,
    gravity: "bottom",
    position: "left",
    style: {
      background: "linear-gradient(to right, #F0DB4F, #323330)"
    },
  }).showToast();

  mostrarResultado(totalPedido - descuento);

  document.getElementById("btn-agregar").style.display = "none";
  document.getElementById("btn-finalizar").style.display = "none";
  document.getElementById("btn-limpiar").style.display = "none";
  document.getElementById("pedido").style.display = "none";
}

// Función para limpiar el pedido y el formulario
function limpiarPedido() {
  localStorage.removeItem("pedidos");
  limpiarFormulario();
  document.getElementById("resultado").style.display = "none";
  document.getElementById("pedido").style.display = "none";
  document.getElementById("btn-finalizar").style.display = "none";
  document.getElementById("btn-limpiar").style.display = "none";
  document.getElementById("btn-agregar").style.display = "block";
}

// Función para limpiar el formulario
function limpiarFormulario() {
  document.querySelectorAll('input[name="combo"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="doble"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="papas"]').forEach(input => (input.checked = false));
}

// Función para borrar un producto del carrito
function borrarProducto(index) {
  const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidosGuardados.splice(index, 1);
  localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

  mostrarTotalAPagar(calcularTotalPedido());
  mostrarPedidoActual();
}

// Función para actualizar los precios de los combos según el valor del dólar blue
async function actualizarPreciosDolarBlue() {
  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest');
    const data = await response.json();
    const valorDolarBlue = data.blue.value_sell;

    const preciosEnDolares = {
      TheAsyncBurger: 2,
      TheVanillaClassic: 2.5,
      TheES6Supreme: 3
    };

    combosHamburguesa.forEach(combo => {
      if (preciosEnDolares.hasOwnProperty(combo.nombre)) {
        combo.precio = Math.round(preciosEnDolares[combo.nombre] * valorDolarBlue);
      }
    });

    mostrarCombos();
  } catch (error) {
    console.error('Error al obtener los datos del dólar blue:', error);
  }
}

// Función para mostrar los combos actualizados en la página
function mostrarCombos() {
  const combosContainer = document.getElementById("combos");
  combosContainer.innerHTML = '<h3 style="color: #6A782C;">// Combos Actualizados:</h3>';

  combosHamburguesa.forEach(combo => {
    combosContainer.innerHTML += `
      <div class="combo-item">
        <h5><strong>${combo.nombre}</strong></h5>
        <p><span class="highlight">Precio:</span> $<span class="number-highlight">${combo.precio}</span></p>
        <p><span class="highlight">Ingredientes:</span> ${combo.ingredientes.join(", ")}</p>
      </div>
    `;
  });
}

// Función para cargar los precios actualizados al inicio y luego cada una hora
async function cargarPreciosActualizados() {
  await actualizarPreciosDolarBlue();
  // Configurar el intervalo para actualizar los precios cada una hora
  setInterval(actualizarPreciosDolarBlue, 3600000); // 1 hora = 60 minutos * 60 segundos * 1000 milisegundos
}

// Mostrar los combos inicialmente
cargarPreciosActualizados();

// Borrar LocalStorage al recargar la pagina
window.addEventListener("unload", function() {
  localStorage.removeItem("pedidos");
});

// Event Listener para el botón de agregar al pedido
document.getElementById("btn-agregar").addEventListener("click", agregarAlPedido);

// Mostrar los combos inicialmente
mostrarCombos();