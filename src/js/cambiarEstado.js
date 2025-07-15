(function(){
    const cambiarEstadoBtn = document.querySelectorAll(".cambiarEstado");
    const token = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    //añadir evento
    cambiarEstadoBtn.forEach( boton => {
        boton.addEventListener("click", cambiarEstadoValor)
    })

    async function cambiarEstadoValor(e) {
        const { valorId: id } = e.target.dataset;
        try {
            const url = `/perfil/${id}`
            const respuesta = await fetch(url, {
                method: "PUT",
                headers: {
                    "CSRF-Token": token
                }
            })
            const { resultado } =  await respuesta.json();
            if (resultado) {
                if( e.target.classList.contains("publico") ) {
                    e.target.classList.add("no-publico");
                    e.target.classList.remove("publico");
                    e.target.textContent = "No publicado";
                } else {
                    e.target.textContent = "Publicado";
                    e.target.classList.add("publico");
                    e.target.classList.remove("no-publico");
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
})()