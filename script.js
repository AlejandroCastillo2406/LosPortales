document.addEventListener('DOMContentLoaded', function() {
    let productos = [];

    // Función para mostrar productos
    function mostrarProductos(productosFiltrados) {
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = '';
        productosFiltrados.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                </div>
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <div class="product-actions">
                        <button class="view-details" data-id="${producto.id}">Detalles</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);

            // Añadir evento al botón "Detalles"
            card.querySelector('.view-details').addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const producto = productos.find(p => p.id == id);

                document.getElementById('productModalLabel').textContent = producto.nombre;
                document.getElementById('productDescription').textContent = producto.descripcion;
                document.getElementById('productPrice').textContent = producto.precio;

                const carouselImages = document.getElementById('carouselImages');
                carouselImages.innerHTML = '';
                producto.imagenes.forEach((img, index) => {
                    const div = document.createElement('div');
                    div.className = 'carousel-item';
                    div.style.transform = `translateX(${index * 100}%)`;
                    div.innerHTML = `<img src="${img}" alt="${producto.nombre}">`;
                    carouselImages.appendChild(div);
                });

                const prevButton = document.getElementById('carouselPrev');
                const nextButton = document.getElementById('carouselNext');
                if (producto.imagenes.length > 1) {
                    prevButton.style.display = 'block';
                    nextButton.style.display = 'block';
                } else {
                    prevButton.style.display = 'none';
                    nextButton.style.display = 'none';
                }

                let currentIndex = 0;
                const items = document.querySelectorAll('.carousel-item');
                function updateCarousel() {
                    items.forEach((item, idx) => {
                        item.style.transform = `translateX(${(idx - currentIndex) * 100}%)`;
                    });
                }

                prevButton.onclick = () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateCarousel();
                    }
                };

                nextButton.onclick = () => {
                    if (currentIndex < producto.imagenes.length - 1) {
                        currentIndex++;
                        updateCarousel();
                    }
                };

                document.getElementById('productModal').style.display = 'flex';
            });
        });
    }

    // Cargar productos desde ropa.json
    fetch('data/ropa.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarProductos(productos); // Mostrar todos por defecto

            // Filtrar por sexo
            document.getElementById('filter-all').addEventListener('click', (e) => {
                e.preventDefault();
                mostrarProductos(productos);
            });

            document.getElementById('filter-mujer').addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.sexo === 'mujer');
                mostrarProductos(filtered);
            });

            document.getElementById('filter-hombre').addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.sexo === 'hombre');
                mostrarProductos(filtered);
            });

            document.getElementById('filter-unisex').addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.sexo === 'unisex');
                mostrarProductos(filtered);
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));

    // Cerrar modal
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
