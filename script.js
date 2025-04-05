// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Fetch products from ropa.json
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterAll = document.getElementById('filter-all');
    const filterMujer = document.getElementById('filter-mujer');
    const filterHombre = document.getElementById('filter-hombre');
    const filterUnisex = document.getElementById('filter-unisex');
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const favoritesModal = document.getElementById('favoritesModal');
    const favoritesModalClose = document.getElementById('favoritesModalClose');
    const favoritesIcon = document.getElementById('favorites-icon');
    const favoritesList = document.getElementById('favoritesList');
    const whatsappFavoritesLink = document.getElementById('whatsappFavoritesLink');
    let products = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Load products
    fetch('data/ropa.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts(products);
            loadFavorites();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<p>Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>';
        });

    // Display products
    function displayProducts(productsToDisplay) {
        productsGrid.innerHTML = '';
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="favorite-btn ${favorites.some(fav => fav.id === product.id) ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                </div>
            `;

            // Add event listener for favorite button
            const favoriteBtn = productCard.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the modal
                toggleFavorite(product);
                favoriteBtn.classList.toggle('active');
            });

            // Add event listener for product card click
            productCard.addEventListener('click', () => openProductModal(product));
            productsGrid.appendChild(productCard);
        });
    }

    // Toggle favorite
    function toggleFavorite(product) {
        const index = favorites.findIndex(fav => fav.id === product.id);
        if (index === -1) {
            favorites.push(product);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites();
    }

    // Load favorites in modal
    function loadFavorites() {
        favoritesList.innerHTML = '';
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No tienes productos favoritos.</p>';
            whatsappFavoritesLink.style.display = 'none';
        } else {
            favorites.forEach(fav => {
                const favoriteItem = document.createElement('div');
                favoriteItem.classList.add('favorite-item');
                favoriteItem.innerHTML = `
                    <img src="${fav.image}" alt="${fav.name}">
                    <h3>${fav.name}</h3>
                `;
                favoritesList.appendChild(favoriteItem);
            });
            whatsappFavoritesLink.style.display = 'block';
            const message = favorites.map(fav => `${fav.name} - ${fav.price}`).join('\n');
            whatsappFavoritesLink.href = `https://wa.me/+527821152503?text=Hola, estoy interesado en los siguientes productos:\n${encodeURIComponent(message)}`;
        }
    }

    // Open product modal
    function openProductModal(product) {
        document.getElementById('productModalLabel').textContent = product.name;
        document.getElementById('productDescription').textContent = product.description || 'Sin descripción disponible.';
        document.getElementById('productPrice').textContent = product.price;
        const carouselImages = document.getElementById('carouselImages');
        carouselImages.innerHTML = '';
        product.images.forEach((img, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) carouselItem.classList.add('active');
            carouselItem.innerHTML = `<img src="${img}" alt="${product.name} ${index + 1}">`;
            carouselImages.appendChild(carouselItem);
        });

        // WhatsApp and Facebook share links
        const whatsappLink = document.getElementById('whatsappLink');
        const whatsappShare = document.getElementById('whatsappShare');
        const facebookShare = document.getElementById('facebookShare');
        whatsappLink.href = `https://wa.me/+527821152503?text=Hola, estoy interesado en ${encodeURIComponent(product.name)} - ${encodeURIComponent(product.price)}`;
        whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(`Mira este producto: ${product.name} - ${product.price} ${window.location.href}`)}`;
        facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`Mira este producto: ${product.name} - ${product.price}`)}`;

        productModal.style.display = 'flex';
        initializeCarousel();
    }

    // Initialize carousel
    function initializeCarousel() {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        let currentIndex = 0;

        function showSlide(index) {
            carouselItems.forEach((item, i) => {
                item.style.transform = `translateX(${(i - index) * 100}%)`;
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? carouselItems.length - 1 : currentIndex - 1;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === carouselItems.length - 1) ? 0 : currentIndex + 1;
            showSlide(currentIndex);
        });

        showSlide(currentIndex);
    }

    // Close modals
    modalClose.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    favoritesModalClose.addEventListener('click', () => {
        favoritesModal.style.display = 'none';
    });

    // Open favorites modal
    favoritesIcon.addEventListener('click', () => {
        favoritesModal.style.display = 'flex';
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Sort functionality
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        let sortedProducts = [...products];
        if (sortValue === 'price-asc') {
            sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortValue === 'price-desc') {
            sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        displayProducts(sortedProducts);
    });

    // Filter functionality
    filterAll.addEventListener('click', (e) => {
        e.preventDefault();
        displayProducts(products);
    });

    filterMujer.addEventListener('click', (e) => {
        e.preventDefault();
        const filteredProducts = products.filter(product => product.category === 'Mujer');
        displayProducts(filteredProducts);
    });

    filterHombre.addEventListener('click', (e) => {
        e.preventDefault();
        const filteredProducts = products.filter(product => product.category === 'Hombre');
        displayProducts(filteredProducts);
    });

    filterUnisex.addEventListener('click', (e) => {
        e.preventDefault();
        const filteredProducts = products.filter(product => product.category === 'Unisex');
        displayProducts(filteredProducts);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
        if (e.target === favoritesModal) {
            favoritesModal.style.display = 'none';
        }
    });
});
