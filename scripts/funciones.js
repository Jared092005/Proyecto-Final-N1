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
    htmlGenerado += `
      <article class="flex flex-col group gap-3 cursor-pointer bg-white rounded-3xl overflow-hidden pb-2 px-6">
        
        <div class="w-full aspect-4/3 rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
          <img 
            src="${carta.photo}" 
            alt="${carta.city}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div class="w-full flex justify-between items-center text-sm px-2 mt-1">
          <div class="flex items-center gap-2">
            ${
              carta.superHost
                ? `
              <span class="text-[10px] font-bold text-[#4f4f4f] uppercase border-2 border-[#4f4f4f] rounded-full px-2 py-0.5 tracking-wider shrink-0">
                SUPERHOST
              </span>
            `
                : ""
            }
            
            <span class="text-gray-500 font-medium line-clamp-1">
              ${carta.type}
            </span>
          </div>
          
          <div class="flex items-center gap-1 shrink-0">
            <img src="./designs/icons/star.svg" alt="rating" class="w-4 h-4" />
            <span class="text-gray-700 font-semibold">${carta.rating.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="px-2">
          <h2 class="text-base font-semibold text-[#333333] line-clamp-1 group-hover:text-gray-500 transition-colors">
            ${carta.title}
          </h2>
        </div>

      </article>
    `;
  }

  // Se asigna al contenedor una sola vez AL FINAL del bucle por rendimiento
  cardsApartamentos.innerHTML = htmlGenerado;
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

function mostrarFiltros() {
  filtros.classList.toggle("hidden");
  cambioFondo.classList.toggle("hidden");
}

/** Esta función lo que hace es mostrar los contadores cuando le damos click al input para que de esa manera podamos sumar*/
function mostrarContadores() {
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
