//Defino los precios de las láminas
const precioPolarizado = 20000;
const precioAntiBandalico = 25000;
let resultado = 0;
let vclo = [];

//Defino un vclo con los tamaños de vehículos permitidos
const tamaniosVehiculos = [
  "Pequeño",
  "Mediano",
  "Grande",
  "Grande+",
  "Camiones",
];

//Defino un vclo con los tipos de láminas permitidos
const tiposLaminas = ["Polarizado", "Anti-bandálico"];

//Función para obtener fecha
function obtenerFecha() {
  let fecha = new Date();
  const opciones = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  };
  fecha = fecha.toLocaleDateString("es-AR", opciones);
  return fecha;
}

//Función para mostrar resultados y storage
function refrescar() {
  ulLista.textContent = "";
  for (const iterator of vclo) {
    t = iterator.tamanio;
    v = iterator.ventanas;
    l = iterator.lamina;
    f = iterator.fecha;
    p = iterator.precio;
    p = new Intl.NumberFormat("es-AR").format(p);
    liVehiculo = document.createElement("li");
    liVehiculo.innerHTML = `Fecha: ${f}</br> Tamaño del Vehículo: ${t}</br> Cantidad de Ventanas: ${v}</br> Tipo de Lámina: ${l} </br> Precio: ARS ${p} + IVA`;
    ulLista.appendChild(liVehiculo);
  }
  pCotizacion.innerHTML = `Fecha: ${f}</br> Tamaño del Vehículo: ${t}</br> Cantidad de Ventanas: ${v}</br> Tipo de Lámina: ${l}  </br> <strong>Precio: ARS ${p} + IVA</strong>`;
}

//Defino una clase para representar un vehículo
class Vehiculo {
  constructor(tamanio, ventanas, lamina, fecha, precio) {
    this.tamanio = tamanio;
    this.ventanas = ventanas;
    this.lamina = lamina;
    this.fecha = fecha;
    this.precio = precio;
  }

  //Calcula el precio final y devuelve el resultado/mensaje
  calcularPrecio() {
    let precioLamina = this.lamina;
    let tl = tiposLaminas.indexOf(precioLamina);
    if (tiposLaminas[tl] == "Polarizado") {
      precioLamina = precioPolarizado;
    } else {
      precioLamina = precioAntiBandalico;
    }
    let tam = tamaniosVehiculos.indexOf(this.tamanio);
    if (tamaniosVehiculos[tam] == "Mediano") {
      precioLamina += (precioLamina * 5) / 100;
    } else if (tamaniosVehiculos[tam] == "Grande") {
      precioLamina += (precioLamina * 7) / 100;
    }
    //Calculamos el precio final
    resultado = this.ventanas * precioLamina;
    //Devolvemos el precio final
    return resultado;
  }
}

const jsonAlmacenados = localStorage.getItem("vclo");
console.log(jsonAlmacenados);
if (jsonAlmacenados) {
  vclo = JSON.parse(jsonAlmacenados);
}

//Pido al usuario que ingrese los datos
const formCotizador = document.querySelector("#formCotizador");
const inputVehiculo = document.querySelector("#inputVehiculo");
const inputVentanas = document.querySelector("#inputVentanas");
const inputLamina = document.querySelector("#inputLamina");
const pCotizacion = document.querySelector("#pCotizacion");
const ulLista = document.querySelector("#ulLista");

formCotizador.addEventListener("submit", (e) => {
  e.preventDefault();
  //Instancio el objeto vehiculo
  const vehiculo = new Vehiculo(
    inputVehiculo.value,
    inputVentanas.value,
    inputLamina.value,
    obtenerFecha()
  );

  vehiculo.precio = vehiculo.calcularPrecio();

  vclo.push(vehiculo);
  localStorage.setItem("vclo", JSON.stringify(vclo));
  ulLista.innerHTML = "";

  refrescar();

  //Cambio el mensaje si el tamaño es Grande+ o Camiones
  if (vehiculo.tamanio == "Grande+" || vehiculo.tamanio == "Camiones") {
    pCotizacion.textContent =
      "Para este tamaño, por favor comunicarse a ventas@hyperion.com.ar";
  }
});

//Resetear el formulario
inputVehiculo.value = "";
inputVentanas.value = "";
inputLamina.value = "";
