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

function mostrarApartamentos(listaDeApartamentos) {
  let htmlGenerado = "";

  for (const carta of listaDeApartamentos) {
    if (carta.superHost) {
      htmlGenerado += ` <article class="flex flex-col gap-2 relative z-10">
     <span class="flex px-6"
          ><img
            src="${carta.photo}"
            alt="${carta.city}"
            class="rounded-3xl w-80 h-50 object-fill cursor-pointer active:scale-90 active:transition active:duration-200 hover:scale-105 hover:transition hover:ease-out hover:duration-250"
        /></span>
        <div class="w-full flex justify-between px-8 py-1 lg:justify-even">
        <p class="border border-gray-700 p-2 rounded-2xl text-[12px]">SUPERHOST</p>
          <p class="text-gray-600 pt-1.5">${carta.type}</p>
          <p class="flex pt-1"><img
            src="./designs/icons/star.svg"
            alt="rating"
            class="w-5 pb-1.5"/> ${carta.rating}</p>
        </div>
        <div class="px-8">
          <p class="font-semibold">${carta.title}</p>
        </div>
        </article>`;
    } else {
      htmlGenerado += ` <article class="flex flex-col gap-2 relative z-10">
     <span class="flex px-6"
          ><img
            src="${carta.photo}"
            alt="${carta.city}"
            class="rounded-3xl w-80 h-50 object-fill cursor-pointer active:scale-90 active:transition active:duration-200 hover:scale-105 hover:transition hover:ease-out hover:duration-250"
        /></span>
        <div class="w-full flex justify-between px-8 py-1 lg:justify-even">
          <p class="text-gray-600 pt-1.5">${carta.type}</p>
          <p class="flex pt-1"><img
            src="./designs/icons/star.svg"
            alt="rating"
            class="w-5 pb-1.5"/> ${carta.rating}</p>
        </div>
        <div class="px-8">
          <p class="font-semibold">${carta.title}</p>
        </div>
        </article>`;
    }
    cardsApartamentos.innerHTML = htmlGenerado;
  }
}

let filtros = document.querySelector("#filters");

let contendorFiltros = document.querySelector("#filter-container");

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

function mostrarFiltros(e) {
  if (e) e.stopPropagation();

  filtros.classList.toggle("hidden");
  cambioFondo.classList.toggle("hidden");
}

function mostrarContadores(e) {
  if (e) e.stopPropagation();

  contendorFiltros.classList.toggle("lg:hidden");
}

let inputHuespedesFiltro = document.querySelector("#input-guests");
inputHuespedesFiltro.addEventListener("click", mostrarContadores);

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

let totalHuespedes = 0;
/**Esta función cuenta los dos botones y los junta para saber cuantos huespedes hay en total y buscar los
 * apartamentos en base a eso. */

function contadorBotones() {
  numeroContador.textContent = contadorAdultos;
  numeroContador2.textContent = contadorNinos;

  totalHuespedes = contadorAdultos + contadorNinos;

  if (totalHuespedes <= 1 && totalHuespedes > 0) {
    inputHuespedesFiltro.value = `${totalHuespedes} guest`;
  } else {
    inputHuespedesFiltro.value = `${totalHuespedes} guests`;
  }
  buscadorDeLugares();
}

let contenedorSugerencias = document.querySelector("#suggestions-container");

let sugerencias = document.querySelector("#suggestions");

let filtroLugares = document.querySelector("#place-filter");

filtroLugares.addEventListener("input", () => {
  let texto = filtroLugares.value.toLowerCase();

  if (texto === "") {
    contenedorSugerencias.classList.toggle("hidden");
    sugerencias.innerHTML = "";
    return;
  }

  let apartamentosFiltrados = cartas.filter((apartamento) => {
    return apartamento.city.toLowerCase().includes(texto);
  });
  mostrarSugerencias(apartamentosFiltrados);
});

function mostrarSugerencias(listaFiltrada) {
  sugerencias.innerHTML = "";

  if (listaFiltrada.length === 0) {
    sugerencias.textContent = "No matches found";
    contenedorSugerencias.classList.remove("hidden");
    return;
  }
  contenedorSugerencias.classList.remove("hidden");

  listaFiltrada.forEach((apartamento) => {
    let item = sugerencias;

    let textoCompleto = `${apartamento.city}, ${apartamento.country}`;
    item.textContent = textoCompleto;
    item.addEventListener("click", () => {
      filtroLugares.value = textoCompleto;
      contenedorSugerencias.classList.add("hidden");
      sugerencias.textContent = "";
    });
  });
}

let botonSearch = document.querySelector("#btn-search");

/**Esta función lo que hace es filtrar por lugares y también por cantidad de huespedes que el usuario ingresa */
function buscadorDeLugares() {
  let nombre = filtroLugares.value.toLowerCase();
  cardsApartamentos.innerHTML = "";

  let apartamentoFiltrados = cartas.filter((apartamento) => {
    let ubicacionApartamento =
      `${apartamento.city}, ${apartamento.country}`.toLowerCase();

    let coincideCiudad = ubicacionApartamento.includes(nombre);
    let coincideHuespedes = apartamento.maxGuests >= totalHuespedes;

    return coincideCiudad && coincideHuespedes;
  });

  actualizarContador(apartamentoFiltrados);
  mostrarApartamentos(apartamentoFiltrados);
}

filtroLugares.addEventListener("input", buscadorDeLugares);
inputHuespedesFiltro.addEventListener("input", buscadorDeLugares);
botonSearch.addEventListener("click", (e) => {
  e.preventDefault();
  mostrarFiltros();
  buscadorDeLugares();
});

let apartamentosDisponibles = document.querySelector("#total-stays");

function actualizarContador(listaDeApartamentos) {
  const total = listaDeApartamentos.length;

  apartamentosDisponibles.textContent = `${total} stays`;
}

export {
  compilarDatos,
  mostrarApartamentos,
  mostrarFiltros,
  buscadorDeLugares,
  cartas,
};
