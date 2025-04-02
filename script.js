const data = [
    {
        "id": 1,
        "nombre": "Tops Básicos",
        "descripcion": "Tops versátiles para cualquier ocasión.",
        "precio": "$10",
        "imagenes": ["images/tops.jpeg"],
        "categoria": "Ropa"
    },
    {
        "id": 2,
        "nombre": "Blusa para Gimnasio",
        "descripcion": "Blusa cómoda y transpirable para entrenar.",
        "precio": "$15",
        "imagenes": ["images/blusagym.jpeg"],
        "categoria": "Ropa"
    },
    {
        "id": 3,
        "nombre": "Combo de 3 Tops",
        "descripcion": "Pack de 3 tops a un precio especial.",
        "precio": "$25",
        "imagenes": ["images/combo3tops.jpeg"],
        "categoria": "Ropa"
    },
    {
        "id": 4,
        "nombre": "Conjunto Completo",
        "descripcion": "Conjunto de top y pantalón a juego.",
        "precio": "$30",
        "imagenes": ["images/conjunto.jpeg"],
        "categoria": "Ropa"
    },
    {
        "id": 5,
        "nombre": "Falda Casual",
        "descripcion": "Falda ligera y moderna para el día a día.",
        "precio": "$20",
        "imagenes": ["images/falda.jpeg"],
        "categoria": "Ropa"
    },
    {
        "id": 6,
        "nombre": "Pestañas",
        "descripcion": "Accesorio único para complementar tu look.",
        "precio": "$5",
        "imagenes": ["images/pestaña.jpeg","images/pestaña.jpeg"],
        "categoria": "Accesorios"
    },
    {
        "id": 7,
        "nombre": "Top Elegante",
        "descripcion": "Top ideal para salidas nocturnas.",
        "precio": "$12",
        "imagenes": ["images/top.jpeg"],
        "categoria": "Ropa"
    },
    {
        "id": 8,
        "nombre": "Top Deportivo",
        "descripcion": "Top cómodo para actividades deportivas.",
        "precio": "$15",
        "imagenes": ["images/top3.jpeg"],
        "categoria": "Ropa"
    }
];

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
    }
});
