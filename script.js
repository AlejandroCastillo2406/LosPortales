document.addEventListener('DOMContentLoaded', function() {
    let productos = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Definir las categorías por sexo con imágenes
    const categoriasPorSexo = {
        mujer: [
            { nombre: 'Top', imagen: 'images/mujer-top.jpg', categoria: 'top' },
            { nombre: 'Blusa', imagen: 'images/mujer-blusa.jpg', categoria: 'blusa' },
            { nombre: 'Falda', imagen: 'images/mujer-falda.jpg', categoria: 'falda' },
            { nombre: 'Short', imagen: 'images/mujer-short.jpg', categoria: 'short' }
        ],
        hombre: [
            { nombre: 'Camisa', imagen: 'images/hombre-camisa.jpg', categoria: 'camisa' },
            { nombre: 'Short', imagen: 'images/hombre-short.jpg', categoria: 'short' }
        ],
        unisex: [
            { nombre: 'Sudadera', imagen: 'images/unisex-sudadera.jpg', categoria: 'sudadera' },
            { nombre: 'Pantalón', imagen: 'images/unisex-pantalon.jpeg', categoria: 'pantalon' },
            { nombre: 'Accesorio', imagen: 'images/unisex-accesorio.jpg', categoria: 'accesorio' }
        ]
    };

    // Función para mostrar categorías
    function mostrarCategorias(sexo) {
        const categoryGrid = document.getElementById('category-grid');
        categoryGrid.innerHTML = '';
        const categorias = categoriasPorSexo[sexo] || [];
        categorias.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.innerHTML = `
                <img src="${cat.imagen}" alt="Categoría ${cat.nombre}">
                <div class="category-info">
                    <h3>${cat.nombre}</h3>
                </div>
            `;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.categoria === cat.categoria);
                mostrarProductos(filtered);
            });
            categoryGrid.appendChild(item);
        });
    }

    // Función para mostrar productos
    function mostrarProductos(productosFiltrados) {
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = '';
        productosFiltrados.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const isFavorite = favorites.includes(producto.id);
            card.innerHTML = `
                <div class="product-image">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${producto.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <div class="product-actions">
                        <button class="view-details" data-id="${producto.id}">Detalles</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);

            // Añadir evento al botón de favoritos
            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', () => {
                const id = parseInt(favoriteBtn.getAttribute('data-id'));
                if (favorites.includes(id)) {
                    favorites = favorites.filter(favId => favId !== id);
                    favoriteBtn.classList.remove('active');
                } else {
                    favorites.push(id);
                    favoriteBtn.classList.add('active');
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
            });

            // Añadir evento al botón "Detalles"
            card.querySelector('.view-details').addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const producto = productos.find(p => p.id == id);

                document.getElementById('productModalLabel').textContent = producto.nombre;
                document.getElementById('productDescription').textContent = producto.descripcion;
                document.getElementById('productPrice').textContent = producto.precio;

                const whatsappLink = document.getElementById('whatsappLink');
                const mensaje = `Hola, estoy interesado/a en la prenda "${producto.nombre}" que cuesta ${producto.precio}. ¿Tienes más información?`;
                whatsappLink.href = `https://wa.me/+527822920667?text=${encodeURIComponent(mensaje)}`;

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

    // Función para mostrar favoritos
    function mostrarFavoritos() {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = '';
        const favoritosProductos = productos.filter(p => favorites.includes(p.id));
        if (favoritosProductos.length === 0) {
            favoritesList.innerHTML = '<p>No tienes productos favoritos.</p>';
        } else {
            favoritosProductos.forEach(producto => {
                const item = document.createElement('div');
                item.className = 'favorite-item';
                item.innerHTML = `
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                `;
                favoritesList.appendChild(item);
            });

            const whatsappFavoritesLink = document.getElementById('whatsappFavoritesLink');
            const nombresFavoritos = favoritosProductos.map(p => `${p.nombre} (${p.precio})`).join(', ');
            const mensaje = `Hola, estoy interesado/a en estas prendas favoritas: ${nombresFavoritos}. ¿Tienes más información?`;
            whatsappFavoritesLink.href = `https://wa.me/+527822920667?text=${encodeURIComponent(mensaje)}`;
        }
        document.getElementById('favoritesModal').style.display = 'flex';
    }

    // Cargar productos desde ropa.json
    fetch('data/ropa.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarProductos(productos); // Mostrar todos por defecto
            mostrarCategorias('mujer'); // Mostrar categorías de mujer por defecto

            // Filtrar por sexo
            document.getElementById('filter-all').addEventListener('click', (e) => {
                e.preventDefault();
                mostrarProductos(productos);
                mostrarCategorias('mujer');
            });

            document.getElementById('filter-mujer').addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.sexo === 'mujer');
                mostrarProductos(filtered);
                mostrarCategorias('mujer');
            });

            document.getElementById('filter-hombre').addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.sexo === 'hombre');
                mostrarProductos(filtered);
                mostrarCategorias('hombre');
            });

            document.getElementById('filter-unisex').addEventListener('click', (e) => {
                e.preventDefault();
                const filtered = productos.filter(p => p.sexo === 'unisex');
                mostrarProductos(filtered);
                mostrarCategorias('unisex');
            });

            // Mostrar modal de favoritos
            document.getElementById('favorites-icon').addEventListener('click', (e) => {
                e.preventDefault();
                mostrarFavoritos();
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));

    // Cerrar modales
    const productModal = document.getElementById('productModal');
    const favoritesModal = document.getElementById('favoritesModal');
    const productModalClose = document.getElementById('modalClose');
    const favoritesModalClose = document.getElementById('favoritesModalClose');

    productModalClose.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    favoritesModalClose.addEventListener('click', () => {
        favoritesModal.style.display = 'none';
    });

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    favoritesModal.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            favoritesModal.style.display = 'none';
        }
    });
});
