fetch('data/ropa.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el JSON: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const productosDiv = document.getElementById('productos');
        const categoryFilter = document.getElementById('categoryFilter');
        let productos = data;

        function mostrarProductos(productosFiltrados) {
            productosDiv.innerHTML = '';
            productosFiltrados.forEach(producto => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                    <div class="card" data-bs-toggle="modal" data-bs-target="#productModal" data-id="${producto.id}">
                        <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                        <h5 class="card-title">${producto.nombre}</h5>
                    </div>
                `;
                productosDiv.appendChild(card);
            });
        }

        mostrarProductos(productos);

        categoryFilter.addEventListener('change', (e) => {
            const categoriaSeleccionada = e.target.value;
            if (categoriaSeleccionada === 'Todos') {
                mostrarProductos(productos);
            } else {
                const productosFiltrados = productos.filter(producto => producto.categoria === categoriaSeleccionada);
                mostrarProductos(productosFiltrados);
            }
        });

        productosDiv.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                const id = card.getAttribute('data-id');
                const producto = productos.find(p => p.id == id);

                document.getElementById('productModalLabel').textContent = producto.nombre;
                document.getElementById('productDescription').textContent = producto.descripcion;
                document.getElementById('productPrice').textContent = producto.precio;

                const carouselImages = document.getElementById('carouselImages');
                carouselImages.innerHTML = '';
                producto.imagenes.forEach((img, index) => {
                    const div = document.createElement('div');
                    div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                    div.innerHTML = `<img src="${img}" alt="${producto.nombre}">`;
                    carouselImages.appendChild(div);
                });

                // Mostrar u ocultar los botones del carrusel según la cantidad de imágenes
                const carouselPrev = document.querySelector('.carousel-control-prev');
                const carouselNext = document.querySelector('.carousel-control-next');
                if (producto.imagenes.length > 1) {
                    carouselPrev.style.display = 'block';
                    carouselNext.style.display = 'block';
                } else {
                    carouselPrev.style.display = 'none';
                    carouselNext.style.display = 'none';
                }
            }
        });
    })
    .catch(error => console.error('Error al cargar el JSON:', error));
