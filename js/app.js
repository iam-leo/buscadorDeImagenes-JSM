const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas,
    iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarForm);
}

function validarForm(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarAlerta('Todos los campos son obligatorios');
        return
    }

    buscarImagenes(terminoBusqueda);
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.bg-red-600');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-600', 'border-2', 'border-red-700', 'text-white', 'uppercase', 'text-center', 'px-4', 'py-3', 'rounded-lg', 'max-w-lg', 'mx-auto', 'mt-6');
        alerta.textContent = mensaje;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value;
    const key = '25871517-1ca6146daadb5c04771da5e25',
          url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            console.log(totalPaginas);
            mostrarImagenes(resultado.hits);
        })
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre el array de imagenes y construir el html

    imagenes.forEach(imagen => {
        const { previewURL, largeImageURL, views, downloads, likes, user,  } = imagen

        //Div contenedor de las cards
        const divCards = document.createElement('div');
        divCards.classList.add('w-1/2', 'md:w-1/3', 'lg:w-1/4', 'p-3', 'mb-4');

        //Cards
        const card = document.createElement('div');
        card.classList.add('bg-white', 'rounded-lg', 'overflow-hidden', 'relative', 'h-full', 'max-h-96');

        //img
        const img = document.createElement('img');
        img.classList.add('w-full', 'h-48', 'object-cover');
        img.src = previewURL;

        //div contenedor info
        const divInfo = document.createElement('div');
        divInfo.classList.add('p-4');

        //Info
        const meGusta = document.createElement('p');
        const vistas = document.createElement('p');
        const descargas = document.createElement('p');
        const usuario = document.createElement('p');
        const imgHD = document.createElement('a');

        meGusta.classList.add('likes', 'flex', 'justify-center', 'items-center', 'absolute', 'text-white', 'font-semibold');
        meGusta.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart mr-2" width="20" height="20" viewBox="0 0 24 24" stroke-width="3.0" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
            <span>${likes}</span>
        `;

        vistas.innerHTML = `<span class="font-semibold">Visitas:</span> ${views}`;
        descargas.innerHTML = `<span class="font-semibold"> Descargas: </span> ${downloads}`;
        usuario.innerHTML = `<span class="font-semibold"> Autor: </span> ${user}`;
        imgHD.innerHTML = `
            Ver en HD
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download ml-2 width="20" height="20" viewBox="0 0 24 24" stroke-width="3" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <polyline points="7 11 12 16 17 11" />
                <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
        `;
        imgHD.classList.add('bg-indigo-600', 'hover:bg-indigo-700', 'shadow-lg','shadow-indigo-500/50', 'flex', 'justify-center', 'items-center', 'px-3', 'py-2', 'mt-2', 'text-white', 'rounded-lg')
        imgHD.setAttribute('href', largeImageURL);
        imgHD.setAttribute('target', '_blank');
        imgHD.setAttribute('rel', 'noopener noreferrer');

        // divInfo.appendChild(meGusta);
        divInfo.appendChild(vistas);
        divInfo.appendChild(descargas);
        divInfo.appendChild(usuario);
        divInfo.appendChild(imgHD);

        card.appendChild(img);
        card.appendChild(meGusta);
        card.appendChild(divInfo);

        divCards.appendChild(card);

        resultado.appendChild(divCards);
    });

    //Limpiar paginador previo
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    }

    //Generar nuevo HTML paginador
    imprimirPaginador();
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true){
        const { value, done } = iterador.next();

        if(done) return;

        //Generar un boton por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'py-1', 'px-3', 'mr-2', 'mb-4', 'font-bold', 'rounded-md');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginacion.appendChild(boton);

    }
}