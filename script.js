console.log('Script chargé');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé');

    // État global
    const state = {
        wishlist: [],
        cart: [],
        wishlistCount: 0,
        cartCount: 0
    };

    // Créer le conteneur de notifications
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    // Fonction pour afficher les notifications
    function showNotification(message, icon) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        notificationContainer.appendChild(notification);

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const sideMenu = document.querySelector('.side-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const wishlistCounter = document.querySelector('a[href="#wishlist"] .count');
    const cartCounter = document.querySelector('a[href="#cart"] .count');
    const wishlistModal = document.querySelector('.wishlist-modal');
    const cartModal = document.querySelector('.cart-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sideMenu.classList.add('active');
            menuOverlay.classList.add('active');
        });
    }

    // Close Menu
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Close on overlay click
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Fermer les modales
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            wishlistModal.classList.remove('active');
            cartModal.classList.remove('active');
        });
    });

    // Wishlist Buttons
    document.querySelectorAll('.wishlist-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                button.classList.toggle('active');
                
                if (button.classList.contains('active')) {
                    state.wishlistCount++;
                    state.wishlist.push({ name: productName, price: productPrice, image: productImage });
                    showNotification('Produit ajouté à votre wishlist', 'fa-heart');
                } else {
                    state.wishlistCount--;
                    state.wishlist = state.wishlist.filter(item => item.name !== productName);
                    showNotification('Produit retiré de votre wishlist', 'fa-heart-broken');
                }
                updateWishlist();
            }
        });
    });

    // Ajouter au panier
    document.querySelectorAll('.product-card').forEach(card => {
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Ajouter au panier';
        card.querySelector('.product-info').appendChild(addToCartBtn);

        addToCartBtn.addEventListener('click', function() {
            const productName = card.querySelector('h3').textContent;
            const productPrice = parseFloat(card.querySelector('.price').textContent.replace('€', ''));
            const productImage = card.querySelector('img').src;
            
            addToCart({ name: productName, price: productPrice, image: productImage });
            showNotification('Produit ajouté au panier', 'fa-shopping-bag');
        });
    });

    // Ouvrir Wishlist
    document.querySelector('a[href="#wishlist"]').addEventListener('click', function(e) {
        e.preventDefault();
        wishlistModal.classList.add('active');
        updateWishlist();
    });

    // Ouvrir Panier
    document.querySelector('a[href="#cart"]').addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
        updateCart();
    });

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (state.cart.length === 0) {
                showNotification('Votre panier est vide', 'fa-exclamation-circle');
                return;
            }
            showNotification('Commande validée ! Merci de votre achat', 'fa-check-circle');
            state.cart = [];
            state.cartCount = 0;
            updateCart();
            cartModal.classList.remove('active');
        });
    }

    // Fonctions utilitaires
    function addToCart(product) {
        const existingProduct = state.cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity = (existingProduct.quantity || 1) + 1;
            showNotification('Quantité mise à jour dans le panier', 'fa-plus-circle');
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }
        state.cartCount++;
        updateCart();
    }

    function updateWishlist() {
        if (wishlistCounter) {
            wishlistCounter.textContent = state.wishlistCount;
        }

        const wishlistItems = document.querySelector('.wishlist-items');
        if (wishlistItems) {
            wishlistItems.innerHTML = state.wishlist.map(item => `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-price">${item.price}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromWishlist('${item.name}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    function updateCart() {
        if (cartCounter) {
            cartCounter.textContent = state.cartCount;
        }

        const cartItems = document.querySelector('.cart-items');
        if (cartItems) {
            cartItems.innerHTML = state.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-price">${item.price}€</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span class="quantity-value">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }

        const totalAmount = document.querySelector('.total-amount');
        if (totalAmount) {
            const total = state.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            totalAmount.textContent = `${total.toFixed(2)}€`;
        }
    }

    // Fonctions globales pour les événements inline
    window.removeFromWishlist = function(productName) {
        state.wishlist = state.wishlist.filter(item => item.name !== productName);
        state.wishlistCount--;
        updateWishlist();
        showNotification('Produit retiré de votre wishlist', 'fa-heart-broken');
    };

    window.removeFromCart = function(productName) {
        const item = state.cart.find(item => item.name === productName);
        if (item) {
            state.cartCount -= (item.quantity || 1);
            state.cart = state.cart.filter(item => item.name !== productName);
            updateCart();
            showNotification('Produit retiré du panier', 'fa-trash-alt');
        }
    };

    window.updateQuantity = function(productName, change) {
        const item = state.cart.find(item => item.name === productName);
        if (item) {
            const newQuantity = (item.quantity || 1) + change;
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                state.cartCount += change;
                updateCart();
                showNotification('Quantité mise à jour', 'fa-sync-alt');
            }
        }
    };
});
