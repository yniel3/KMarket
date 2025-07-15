(function() {

    const lat = document.querySelector("#lat").value || -30.042410548413173;
    const lng = document.querySelector("#lng").value || -51.19064480171507;
    const mapa = L.map('mapa').setView([lat, lng ], 9);
    let marker;
    // utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // colocar el pin 
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)
    // detectar movimiento del pin
    marker.on("moveend", function( event ) {
        marker = event.target;

        const posicion = marker.getLatLng();
        //agregamos la posicion del pin a ubicacion del mapa
        mapa.panTo( new L.LatLng(posicion.lat, posicion.lng));
        //mostrar el nombre de la calle al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {
            // console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel);
            // llenar los campos con los datos
            document.querySelector(".calle").textContent = resultado?.address?.Address ?? "";
            document.querySelector("#calle").value = resultado?.address?.Address ?? "";
            document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
            document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
        })
    })

})()