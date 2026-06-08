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

function mostrarApartamentos() {
  let htmlGenerado = "";
  for (const carta of cartas) {
    htmlGenerado += ` <article class="flex flex-col gap-2">
     <span class="flex px-6"
          ><img
            src="${carta.photo}"
            alt="${carta.city}"
            class="rounded-3xl w-80 h-50 object-fill"
        /></span>
        <div class="flex justify-between px-5 py-1 lg:justify-even">
          <p class="text-gray-600">${carta.type}</p>
          <p class="pr-3">⭐ ${carta.rating}</p>
        </div>
        <div class="px-5">
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

let cerrarFiltros = document.querySelector("#close-button");
cerrarFiltros.addEventListener("click", mostrarFiltros);

function mostrarFiltros() {
  filtros.classList.toggle("hidden");
}

export { compilarDatos, mostrarApartamentos };
