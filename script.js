// Variables globales
let productos = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
let productoSeleccionado = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos
    fetch('data/ropa.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            setTimeout(() => {
                document.querySelector('.loader').style.display = 'none';
                mostrarProductos(
