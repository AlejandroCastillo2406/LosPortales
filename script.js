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
                mostrarProductos(productos);
                actualizarContadorProductos(productos.length);
                inicializarFeaturedSlider();
            }, 500); // Pequeño retraso para mostrar el loader
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            document.querySelector('.loader').style.display = 'none';
            document.getElementById('productosContainer').innerHTML = `
                <div class="col-12 text-center">
                    <p>Ha ocurrido un error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">Reintentar</button>
                </div>
            `;
        });

    // Inicializar eventos
    inicializarEventos();
    inicializarBotonesFlotantes();
});

// Función para mostrar productos
function mostrarProductos(productosFiltrados) {
    const productosContainer = document.getElementById('productosContainer');
    productosContainer.innerHTML = '';

    if (productosFiltrados.length === 0) {
        productosContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>No se encontraron productos con los criterios seleccionados.</p>
            </div>
        `;
        return;
    }

    productosFiltrados.forEach((producto, index) => {
        const esFavorito = favoritos.includes(producto.id);
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="card" data-id="${producto.id}">
                <span class="category-badge">${producto.categoria}</span>
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" loading="lazy">
                <div class="hover-overlay">
                    <button class="view-details">Ver detalles</button>
                </div>
                <div class="product-info">
                    <h3 class="card-title">${producto.nombre}</h3>
                    <p class="product-price">${producto.precio}</p>
                </div>
                <div class="product-actions">
                    <button class="action-btn favorite-btn" data-id="${producto.id}">
                        <i class="fas ${esFavorito ? 'fa-heart' : 'fa-heart-o'}"></i> Favorito
                    </button>
                    <button class="action-btn share-btn" data-id="${producto.id}">
                        <i class="fas fa-share-alt"></i> Compartir
                    </button>
                </div>
            </div>
        `;
        productosContainer.appendChild(card);
    });

    // Agregar evento click a las tarjetas
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Si el click fue en un botón de acción, no abrir el modal
            if (e.target.closest('.favorite-btn') || e.target.closest('.share-btn')) {
                return;
            }
            
            const id = this.getAttribute('data-id');
            abrirModalProducto(id);
        });
    });

    // Agregar evento click a los botones de favorito
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            toggleFavorito(id, this);
        });
    });

    // Agregar evento click a los botones de compartir
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            compartirProducto(id);
        });
    });
}

// Función para inicializar el slider de productos destacados
function inicializarFeaturedSlider() {
    const featuredContainer = document.getElementById('featuredProducts');
    // Mostrar solo productos de ropa como destacados
    const destacados = productos.filter(p => p.categoria === 'Ropa').slice(0, 3);
    
    if (destacados.length > 0) {
        featuredContainer.innerHTML = `
            <h2 class="text-center mb-4">Productos Destacados</h2>
            <div class="row">
                ${destacados.map(producto => `
                    <div class="col-md-4 mb-4">
                        <div class="card featured-card" data-id="${producto.id}">
                            <div class="featured-badge">Destacado</div>
                            <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                            <div class="product-info">
                                <h3 class="card-title">${producto.nombre}</h3>
                                <p class="product-price">${producto.precio}</p>
                                <button class="btn btn-primary view-details-btn">Ver detalles</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Agregar eventos a productos destacados
        document.querySelectorAll('.featured-card').forEach(card => {
            card.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                abrirModalProducto(id);
            });
        });
    } else {
        featuredContainer.style.display = 'none';
    }
}

// Función para abrir el modal de producto
function abrirModalProducto(id) {
    const producto = productos.find(p => p.id == id);
    if (!producto) return;
    
    productoSeleccionado = producto;
    
    document.getElementById('productModalLabel').textContent = producto.nombre;
    document.getElementById('productDescription').textContent = producto.descripcion;
    document.getElementById('productPrice').textContent = producto.precio;
    document.getElementById('productCategory').textContent = producto.categoria;
    
    // Actualizar el mensaje de contacto con el nombre del producto
    document.getElementById('contactMessage').value = `Hola, estoy interesado/a en el producto: ${producto.nombre}`;

    // Carousel de imágenes
    const carouselImages = document.getElementById('carouselImages');
    const carouselIndicators = document.querySelector('.carousel-indicators');
    carouselImages.innerHTML = '';
    carouselIndicators.innerHTML = '';
    
    producto.imagenes.forEach((img, index) => {
        // Agregar slide
        const div = document.createElement('div');
        div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        div.innerHTML = `<img src="${img}" alt="${producto.nombre} - Imagen ${index + 1}">`;
        carouselImages.appendChild(div);
        
        // Agregar indicador
        const indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('data-bs-target', '#productCarousel');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) indicator.classList.add('active');
        carouselIndicators.appendChild(indicator);
    });

    // Mostrar u ocultar botones del carrusel
    const prevButton = document.querySelector('.carousel-control-prev');
    const nextButton = document.querySelector('.carousel-control-next');
    if (producto.imagenes.length > 1) {
        prevButton.style.display = 'flex';
        nextButton.style.display = 'flex';
        carouselIndicators.style.display = 'flex';
    } else {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        carouselIndicators.style.display = 'none';
    }

    // Configurar botones de compartir
    document.getElementById('shareWhatsapp').addEventListener('click', function() {
        const url = window.location.href.split('?')[0] + '?producto=' + producto.id;
        const text = `¡Mira este producto en Los Portales! ${producto.nombre}: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    });

    document.getElementById('shareFacebook').addEventListener('click', function() {
        const url = window.location.href.split('?')[0] + '?producto=' + producto.id;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    });

    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Función para inicializar eventos
function inicializarEventos() {
    // Filtrado por categoría
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', aplicarFiltros);
    
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', aplicarFiltros);
    
    // Ordenamiento
    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', aplicarFiltros);
    
    // Botón de contacto en modal
    document.getElementById('contactButton').addEventListener('click', function() {
        const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        contactModal.show();
    });
    
    // Formulario de contacto
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('contactName').value;
        const telefono = document.getElementById('contactPhone').value;
        const mensaje = document.getElementById('contactMessage').value;
        
        // Aquí normalmente enviarías el formulario a un backend
        // En este caso, simulamos y redirigimos a WhatsApp
        const whatsappMessage = `Nombre: ${nombre}%0ATel: ${telefono}%0A%0A${mensaje}`;
        window.open(`https://wa.me/TUNUMERO?text=${whatsappMessage}`, '_blank');
        
        bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
        mostrarNotificacion('¡Gracias por contactarnos! Te responderemos a la brevedad.');
    });
    
    // Verificar si hay un producto en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('producto');
    if (productoId) {
        // Esperar a que se carguen los productos
        const checkProductos = setInterval(() => {
            if (productos.length > 0) {
                clearInterval(checkProductos);
                abrirModalProducto(productoId);
            }
        }, 100);
    }
}

// Función para inicializar botones flotantes
function inicializarBotonesFlotantes() {
    // Botón volver arriba
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // Efecto en la barra de filtros
        const filtersNav = document.getElementById('nav-filters');
        if (window.pageYOffset > 150) {
            filtersNav.classList.add('scrolled');
        } else {
            filtersNav.classList.remove('scrolled');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Función para aplicar filtros
function aplicarFiltros() {
    const categoria = document.getElementById('categoryFilter').value;
    const busqueda = document.getElementById('searchInput').value.toLowerCase();
    const orden = document.getElementById('sortFilter').value;
    
    let productosFiltrados = [...productos];
    
    // Filtrar por categoría
    if (categoria !== 'Todos') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
    }
    
    // Filtrar por búsqueda
    if (busqueda.trim() !== '') {
        productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) || 
            p.descripcion.toLowerCase().includes(busqueda)
        );
    }
    
    // Aplicar ordenamiento
    switch (orden) {
        case 'price-low':
            productosFiltrados.sort((a, b) => {
                const precioA = parseFloat(a.precio.replace('$', ''));
                const precioB = parseFloat(b.precio.replace('$', ''));
                return precioA - precioB;
            });
            break;
        case 'price-high':
            productosFiltrados.sort((a, b) => {
                const precioA = parseFloat(a.precio.replace('$', ''));
                const precioB = parseFloat(b.precio.replace('$', ''));
                return precioB - precioA;
            });
            break;
        case 'name':
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
    }
    
    mostrarProductos(productosFiltrados);
    actualizarContadorProductos(productosFiltrados.length);
}

// Función para actualizar contador de productos
function actualizarContadorProductos(cantidad) {
    document.getElementById('totalProducts').textContent = `Mostrando ${cantidad} producto${cantidad !== 1 ? 's' : ''}`;
}

// Función para alternar favoritos
function toggleFavorito(id, btn) {
    const index = favoritos.indexOf(id);
    
    if (index === -1) {
        // Agregar a favoritos
        favoritos.push(id);
        btn.innerHTML = '<i class="fas fa-heart"></i> Favorito';
        mostrarNotificacion('¡Producto agregado a favoritos!');
    } else {
        // Quitar de favoritos
        favoritos.splice(index, 1);
        btn.innerHTML = '<i class="fas fa-heart-o"></i> Favorito';
        mostrarNotificacion('Producto eliminado de favoritos');
    }
    
    // Guardar en localStorage
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Función para compartir producto
function compartirProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    if (navigator.share) {
        navigator.share({
            title: `Los Portales - ${producto.nombre}`,
            text: `Mira este producto: ${producto.nombre} en Los Portales`,
            url: window.location.href.split('?')[0] + '?producto=' + id
        })
        .then(() => console.log('Contenido compartido'))
        .catch((error) => console.error('Error al compartir', error));
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const shareURL = window.location.href.split('?')[0] + '?producto=' + id;
        const textarea = document.createElement('textarea');
        textarea.value = shareURL;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        mostrarNotificacion('Enlace copiado al portapapeles');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Arreglo para iconos de corazón
document.addEventListener('DOMContentLoaded', function() {
    // Reemplazar fa-heart-o por fa-regular fa-heart si es necesario
    // FontAwesome 6 usa fa-regular fa-heart en lugar de fa-heart-o
    setTimeout(() => {
        document.querySelectorAll('.fa-heart-o').forEach(icon => {
            icon.classList.remove('fa-heart-o');
            icon.classList.add('fa-regular', 'fa-heart');
        });
    }, 1000);
});
