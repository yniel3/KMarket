/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\n(function(){\r\n    const lat = -30.042410548413173;\r\n    const lng = -51.19064480171507;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 9);\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n    let publicaciones = [];\r\n    //selecciona los elementos\r\n    const categoriaSelect = document.querySelector(\"#categorias\");\r\n    const precioSelect = document.querySelector(\"#precios\");\r\n    //Filtros\r\n    const filtros = {\r\n        categoria: \"\",\r\n        precio: \"\"\r\n    }\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n    //filtrado de categorias y precios\r\n    categoriaSelect.addEventListener(\"change\", (event) => {\r\n        filtros.categoria = +event.target.value;\r\n        filtrarArticulos();\r\n    })\r\n    precioSelect.addEventListener(\"change\", (event) => {\r\n        filtros.precio = +event.target.value;\r\n        filtrarArticulos();\r\n    })\r\n\r\n    async function obtenerPublicaciones() {\r\n        try {\r\n            const url = \"/api/publicaciones\";\r\n            const respuesta = await fetch(url);\r\n            publicaciones = await respuesta.json();\r\n            mostrarPublicaciones(publicaciones);\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n    function mostrarPublicaciones(publaciones) {\r\n        //limpiar markers previos\r\n        markers.clearLayers();\r\n        publaciones.forEach(publicacion => {\r\n            //agregar pines\r\n            const marker = new L.marker([publicacion?.lat,publicacion?.lng], {\r\n                autoPan: true\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(`\r\n                <h3 class=\"tituloMapa\">${publicacion?.titulo}</h3>\r\n                <img class=\"imgMapa\" src=\"/uploads/${publicacion?.imagen}\" alt=\"${publicacion.titulo}\"/>\r\n                <p class=\"precioMapa\">Rango de precio: ${publicacion?.precio?.nombre}</p>\r\n                <p class=\"categoriaMapa\">Categoria: ${publicacion?.categoria?.nombre}</p>\r\n                <a href=\"/mostrar/${publicacion?.id}\" class=\"enlaceMapa\">Ver articulo</a>\r\n            `)\r\n\r\n            markers.addLayer(marker)\r\n        });\r\n    }\r\n\r\n    function filtrarArticulos() {\r\n        const resultado = publicaciones.filter( filtrarCategoria ).filter( filtrarPrecio );\r\n        mostrarPublicaciones(resultado)\r\n    }\r\n    function filtrarCategoria(articulo) {\r\n        return filtros.categoria ? articulo.categoriaId === filtros.categoria : articulo;\r\n    }\r\n    function filtrarPrecio(articulo) {\r\n        return filtros.precio ? articulo.precioId === filtros.precio : articulo;\r\n    }\r\n    obtenerPublicaciones();\r\n})()\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;