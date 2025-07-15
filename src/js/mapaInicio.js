

(function(){
    const lat = -30.042410548413173;
    const lng = -51.19064480171507;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 9);

    let markers = new L.FeatureGroup().addTo(mapa);
    let publicaciones = [];
    //selecciona los elementos
    const categoriaSelect = document.querySelector("#categorias");
    const precioSelect = document.querySelector("#precios");
    //Filtros
    const filtros = {
        categoria: "",
        precio: ""
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    //filtrado de categorias y precios
    categoriaSelect.addEventListener("change", (event) => {
        filtros.categoria = +event.target.value;
        filtrarArticulos();
    })
    precioSelect.addEventListener("change", (event) => {
        filtros.precio = +event.target.value;
        filtrarArticulos();
    })

    async function obtenerPublicaciones() {
        try {
            const url = "/api/publicaciones";
            const respuesta = await fetch(url);
            publicaciones = await respuesta.json();
            mostrarPublicaciones(publicaciones);
        } catch (error) {
            console.log(error)
        }
    }
    function mostrarPublicaciones(publaciones) {
        //limpiar markers previos
        markers.clearLayers();
        publaciones.forEach(publicacion => {
            //agregar pines
            const marker = new L.marker([publicacion?.lat,publicacion?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <h3 class="tituloMapa">${publicacion?.titulo}</h3>
                <img class="imgMapa" src="/uploads/${publicacion?.imagen}" alt="${publicacion.titulo}"/>
                <p class="precioMapa">Rango de precio: ${publicacion?.precio?.nombre}</p>
                <p class="categoriaMapa">Categoria: ${publicacion?.categoria?.nombre}</p>
                <a href="/mostrar/${publicacion?.id}" class="enlaceMapa">Ver articulo</a>
            `)

            markers.addLayer(marker)
        });
    }

    function filtrarArticulos() {
        const resultado = publicaciones.filter( filtrarCategoria ).filter( filtrarPrecio );
        mostrarPublicaciones(resultado)
    }
    function filtrarCategoria(articulo) {
        return filtros.categoria ? articulo.categoriaId === filtros.categoria : articulo;
    }
    function filtrarPrecio(articulo) {
        return filtros.precio ? articulo.precioId === filtros.precio : articulo;
    }
    obtenerPublicaciones();
})()