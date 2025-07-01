document.addEventListener('DOMContentLoaded', function() {
    // Элементы корзины
    const cartLink = document.querySelector('.cart-link');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Данные корзины
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    // Инициализация корзины
    function initCart() {
        updateCart();
        setupEventListeners();
        setupAddToCartButtons();
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Открытие/закрытие корзины
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', closeCart);
        }

        // Закрытие при клике вне корзины
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCart();
            }
        });

        // Оформление заказа
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }
    }

    // Настройка кнопок "В корзину"
    function setupAddToCartButtons() {
        document.querySelectorAll('.product-btn').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.card');
                const product = {
                    id: card.getAttribute('data-id'),
                    name: card.getAttribute('data-name'),
                    price: parseInt(card.getAttribute('data-price')),
                    image: card.querySelector('img').src
                };
                
                addToCart(product);
                animateButton(this);
            });
        });
    }

    // Добавление товара в корзину
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCart();
        animateCartIcon();
    }

    // Обновление отображения корзины
    function updateCart() {
        // Очищаем контейнер
        cartItemsContainer.innerHTML = '';
        totalPrice = 0;
        
        // Добавляем товары
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)} ₸</div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-btn minus-btn" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-item-btn plus-btn" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">${formatPrice(itemTotal)} ₸</div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Обновляем счетчик и общую сумму
        updateCartCounter();
        totalPriceElement.textContent = `${formatPrice(totalPrice)} ₸`;
        
        // Добавляем обработчики для кнопок +/-
        addQuantityEventListeners();
    }

    // Форматирование цены
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Обновление счетчика товаров
    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    // Добавление обработчиков для кнопок +/-
    function addQuantityEventListeners() {
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }
                
                saveCart();
                updateCart();
            });
        });
        
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                item.quantity++;
                saveCart();
                updateCart();
            });
        });
    }

    // Анимация иконки корзины
    function animateCartIcon() {
        cartLink.classList.add('animate');
        setTimeout(() => {
            cartLink.classList.remove('animate');
        }, 500);
    }

    // Анимация кнопки "В корзину"
    function animateButton(button) {
        button.textContent = 'Добавлено!';
        button.classList.add('added-to-cart');
        setTimeout(() => {
            button.textContent = 'В корзину';
            button.classList.remove('added-to-cart');
        }, 1000);
    }

    // Сохранение корзины в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Закрытие корзины
    function closeCart() {
        const cartModal = document.getElementById('cartModal');
        document.body.style.overflow = '';
        cartModal.classList.remove('show');
    }
    // Открытие корзины
    function openCart() {
        const cartModal = document.getElementById('cartModal');
        document.body.style.overflow = 'hidden';
        cartModal.classList.add('show');
    }

    // Оформление заказа
    function checkout() {
        if (cart.length === 0) {
            alert('Ваша корзина пуста!');
            return;
        }
        
        // Здесь можно добавить логику оформления заказа
        alert(`Заказ оформлен! Сумма: ${formatPrice(totalPrice)} ₸`);
        cart = [];
        saveCart();
        updateCart();
        closeCart();
    }

    // Инициализация корзины при загрузке страницы
    initCart();
});