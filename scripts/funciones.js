async function compilarDatos() {
  try {
    let datos = await fetch("./stays.json");
    let respuesta = await datos.json();
    return respuesta;
  } catch (error) {
    console.error(`No se pudo compilar la informacion correctamente ${error}`);
  }
}

let cartas = await compilarDatos();

let cardsApartamentos = document.querySelector("#cards-apartamentos");

/**
 * Esta función lo que hace es mostrar cada una de las cartas en el html usando el stays.json
 */

function mostrarApartamentos() {
  let htmlGenerado = "";
  for (const carta of cartas) {
    htmlGenerado += ` <article class="flex flex-col gap-2 relative z-10">
     <span class="flex px-6"
          ><img
            src="${carta.photo}"
            alt="${carta.city}"
            class="rounded-3xl w-80 h-50 object-fill"
        /></span>
        <div class="flex justify-between px-8 py-1 lg:justify-even">
          <p class="text-gray-600">${carta.type}</p>
          <p class="pr-1 flex"><img
            src="./designs/icons/star.svg"
            alt="rating"
            class="w-5"/> ${carta.rating}</p>
        </div>
        <div class="px-8">
          <p class="font-semibold">${carta.title}</p>
        </div>
        </article>`;
  }
  cardsApartamentos.innerHTML = htmlGenerado;
}

let filtros = document.querySelector("#filters");

let inputUbicacion = document.querySelector("#input-location");
inputUbicacion.addEventListener("click", mostrarFiltros);

let inputHuespedes = document.querySelector("#input-guest");
inputHuespedes.addEventListener("click", mostrarFiltros);

let iconoSearch = document.querySelector("#search-icon");
iconoSearch.addEventListener("click", mostrarFiltros);

let cerrarFiltros = document.querySelector("#close-button");
cerrarFiltros.addEventListener("click", mostrarFiltros);

const cambioFondo = document.querySelector("#background-opacity");

/**Esta función hace que el section con la clase "hidden" cambie y aparezcan los filtros que queremos utilizar */

function mostrarFiltros() {
  filtros.classList.toggle("hidden");
  cambioFondo.classList.toggle("hidden");
}

let contendorFiltros = document.querySelector("#filter-container");
let inputHuespedesFiltro = document.querySelector("#input-guests");

let contadorAdultos = 0;
let contadorNinos = 0;

let descontar = document.querySelector("#decrease-button");

//este addEventListener lo que hace es verificar si el numero que está dentro es positivo, si no lanza un mensaje que dice error. También descuenta del número actual
descontar.addEventListener("click", () => {
  if (contadorAdultos <= 0) {
    return (numeroContador.textContent = `Error`);
  }
  contadorAdultos--;
  contadorBotones();
});

let sumar = document.querySelector("#increase-btn");
sumar.addEventListener("click", () => {
  contadorAdultos++;
  contadorBotones();
});

let numeroContador = document.querySelector("#number");

let numeroContador2 = document.querySelector("#number1");

let descontar2 = document.querySelector("#decrease-btn2");

descontar2.addEventListener("click", () => {
  if (contadorNinos <= 0) {
    return (numeroContador2.textContent = `Error`);
  }
  contadorNinos--;
  contadorBotones();
});

let aumentar = document.querySelector("#increase-btn2");

aumentar.addEventListener("click", () => {
  contadorNinos++;
  contadorBotones();
});

/**Esta función cuenta los dos botones y los junta para saber cuantos huespedes hay en total y buscar los
 * apartamentos en base a eso. */

function contadorBotones() {
  numeroContador.textContent = contadorAdultos;
  numeroContador2.textContent = contadorNinos;

  let totalHuespedes = contadorAdultos + contadorNinos;

  if (totalHuespedes <= 1) {
    inputHuespedesFiltro.value = `${totalHuespedes} guest`;
  } else {
    inputHuespedesFiltro.value = `${totalHuespedes} guests`;
  }
}

export { compilarDatos, mostrarApartamentos, mostrarFiltros };
