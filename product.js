document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Données des produits (à remplacer par une vraie base de données)
    const products = {
        '1': {
            name: 'KIT EXTENSIONS DE CILS – VOLUME LÉGER',
            price: '29.99',
            description: 'Notre kit d\'extensions de cils Volume Léger est parfait pour obtenir un regard naturellement intensifié. Idéal pour les débutantes, ce kit contient tout le nécessaire pour une pose professionnelle.',
            features: [
                'Extensions de cils en soie synthétique premium',
                'Colle professionnelle longue tenue',
                'Applicateurs de précision',
                'Guide d\'utilisation détaillé',
                'Durée de pose : 1h30-2h'
            ],
            images: [
                'newimage.png',
                
            ]
        },
       
        '3': {
            name: 'GEL ADHÉSIF',
            price: '14.99',
            description: 'Notre gel adhésif professionnel assure une tenue optimale de vos extensions. Sa formule unique garantit un maintien longue durée tout en préservant le confort de vos clientes.',
            features: [
                'Séchage rapide en 1-2 secondes',
                'Tenue jusqu\'à 6 semaines',
                'Sans odeur',
                'Formule hypoallergénique',
                'Compatible tous types de cils'
            ],
            images: [
                '0A6F3EFC-C21C-4876-B2D8-3DB5AA718523.PNG',
            ]
        }
    };

    // Récupérer les informations du produit
    const product = products[productId];
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Mettre à jour les informations du produit
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = product.price + '€';
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productImage').src = product.images[0];
    document.getElementById('productImage').alt = product.name;

    // Créer la liste des caractéristiques
    const featuresList = document.getElementById('productFeatures');
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Créer les miniatures
    const thumbnailList = document.querySelector('.thumbnail-list');
    product.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = product.name;
        img.addEventListener('click', () => {
            document.getElementById('productImage').src = image;
        });
        thumbnailList.appendChild(img);
    });

    // Gestion de la quantité
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // Gestion de l'accordéon
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            // Fermer tous les contenus actifs
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Ouvrir le contenu cliqué s'il n'était pas déjà actif
            if (!isActive) {
                content.classList.add('active');
            }
        });
    });
});
