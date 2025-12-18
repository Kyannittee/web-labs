
window.selectedDishes = window.selectedDishes || {
    soup: null,
    main: null,
    drink: null,
    salad: null,    
    dessert: null 
};

document.addEventListener('DOMContentLoaded', async function() {
    console.log('order-manager.js загружен');
    
    // ЖДЕМ загрузки блюд из API
    if (!window.dishes || window.dishes.length === 0) {
        console.log('Ждем загрузки блюд...');
        
        // Создаем обещание для ожидания загрузки
        await new Promise(resolve => {
            const checkDishes = setInterval(() => {
                if (window.dishes && window.dishes.length > 0) {
                    clearInterval(checkDishes);
                    resolve();
                }
            }, 100);
        });
    }
    
    console.log('Блюда загружены, продолжаем...');
    
    // Теперь можно загружать заказ
    loadOrderFromLocalStorage();
    syncOrderFromLocalStorage();
    
    // Инициализируем отображение
    updateOrderDisplay();
    updateCheckoutPanel();
    
    // Обновляем состояние карточек
    setTimeout(() => {
        updateAllDishCardsSelection();
    }, 500);
    
    // Обработчик кликов по карточкам
    document.addEventListener('click', function(e) {
        if (e.target.closest('.dish-card')) {
            const dishCard = e.target.closest('.dish-card');
            const dishKeyword = dishCard.getAttribute('data-dish');
            const dish = window.dishes.find(d => d.keyword === dishKeyword);
            
            if (dish) {
                selectDish(dish);
            }
        }
    });
});

const selectedDishes = window.selectedDishes;

function updateAllDishCardsSelection() {
    const allDishCards = document.querySelectorAll('.dish-card');
    
    // Получаем актуальный заказ из localStorage
    const savedOrder = localStorage.getItem('lunchOrder');
    let selectedKeywords = [];
    
    if (savedOrder) {
        try {
            const orderData = JSON.parse(savedOrder);
            selectedKeywords = Object.values(orderData);
        } catch (error) {
            console.error('Ошибка чтения заказа:', error);
        }
    }
    
    // Обновляем каждую карточку
    allDishCards.forEach(card => {
        const dishKeyword = card.getAttribute('data-dish');
        const addBtn = card.querySelector('.add-btn');
        
        if (addBtn) {
            const isSelected = selectedKeywords.includes(dishKeyword);
            
            if (isSelected) {
                card.classList.add('selected');
                addBtn.textContent = '✓ Выбрано';
            } else {
                card.classList.remove('selected');
                addBtn.textContent = 'Добавить';
            }
        }
    });
}

function calculateTotalPrice() {
    return Object.values(selectedDishes).reduce((total, dish) => {
        return total + (dish ? dish.price : 0);
    }, 0);
}

// ========== ФУНКЦИИ ДЛЯ LOCALSTORAGE ==========

function saveOrderToLocalStorage() {
    const orderData = {};
    
    Object.entries(selectedDishes).forEach(([category, dish]) => {
        if (dish) {
            orderData[category] = dish.keyword;
        }
    });
    
    localStorage.setItem('lunchOrder', JSON.stringify(orderData));
    console.log('Заказ сохранен в localStorage:', orderData);
}

function loadOrderFromLocalStorage() {
    const savedOrder = localStorage.getItem('lunchOrder');
    
    if (savedOrder) {
        try {
            const orderData = JSON.parse(savedOrder);
            console.log('Загружен заказ из localStorage:', orderData);
            
            Object.entries(orderData).forEach(([category, keyword]) => {
                const dish = window.dishes.find(d => d.keyword === keyword);
                if (dish) {
                    selectedDishes[category] = dish;
                }
            });
            
            window.selectedDishes = selectedDishes;
            
        } catch (error) {
            console.error('Ошибка загрузки заказа:', error);
        }
    }
}

function syncOrderFromLocalStorage() {
    const savedOrder = localStorage.getItem('lunchOrder');
    
    if (savedOrder) {
        try {
            const orderData = JSON.parse(savedOrder);
            
            // (удаляем только те категории, которых нет в сохраненном заказе)
            Object.keys(selectedDishes).forEach(category => {
                if (orderData[category]) {
                    const dish = window.dishes.find(d => d.keyword === orderData[category]);
                    if (dish) {
                        selectedDishes[category] = dish;
                    }
                } else {
                    selectedDishes[category] = null;
                }
            });
            
            window.selectedDishes = selectedDishes;
            console.log('Синхронизировано с localStorage:', selectedDishes);
            
            // Обновляем карточки
            updateAllDishCardsSelection();
            
        } catch (error) {
            console.error('Ошибка синхронизации:', error);
        }
    } else {
        // Если в localStorage нет заказа, очищаем все
        Object.keys(selectedDishes).forEach(category => {
            selectedDishes[category] = null;
        });
        window.selectedDishes = selectedDishes;
    }
}

// ========== ФУНКЦИИ ДЛЯ ПАНЕЛИ CHECKOUT ==========

function updateCheckoutPanel() {
    const panel = document.getElementById('checkout-panel');
    if (!panel) return;
    
    const totalPrice = calculateTotalPrice();
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (hasSelectedDishes) {
        panel.style.display = 'block';
        
        const totalDisplay = document.getElementById('total-price-display');
        if (totalDisplay) {
            totalDisplay.textContent = `Итого: ${totalPrice}₽`;
        }
        
        const checkoutLink = document.getElementById('checkout-link');
        if (checkoutLink) {
            const isValidCombo = validateCurrentCombo();
            
            if (isValidCombo) {
                checkoutLink.classList.remove('disabled');
                checkoutLink.style.pointerEvents = 'auto';
            } else {
                checkoutLink.classList.add('disabled');
                checkoutLink.style.pointerEvents = 'none';
            }
        }
        
    } else {
        panel.style.display = 'none';
    }
}

function validateCurrentCombo() {
    const hasSoup = selectedDishes.soup !== null;
    const hasMain = selectedDishes.main !== null;
    const hasSalad = selectedDishes.salad !== null;
    const hasDrink = selectedDishes.drink !== null;
    
    const validCombos = [
        hasSoup && hasMain && hasSalad && hasDrink,
        hasSoup && hasMain && hasDrink && !hasSalad,
        hasSoup && hasSalad && hasDrink && !hasMain,
        hasMain && hasSalad && hasDrink && !hasSoup,
        hasMain && hasDrink && !hasSoup && !hasSalad
    ];
    
    return validCombos.some(combo => combo === true);
}


function selectDish(dish) {
    console.log('Выбираем блюдо:', dish.name);
    
    // Конвертация категории
    let ourCategory = dish.category;
    if (dish.category === 'main-course') {
        ourCategory = 'main';
    }
    
    //если блюдо этой категории уже выбрано, то заменяем его
    selectedDishes[ourCategory] = dish;
    window.selectedDishes = selectedDishes;
    
    // Сохраняем и обновляем
    saveOrderToLocalStorage();
    updateCheckoutPanel();
    updateOrderDisplay();
    
    // Обновляем ВСЕ карточки
    updateAllDishCardsSelection();
}

function updateOrderDisplay() {
    const orderContainer = document.querySelector('.order-column');
    if (!orderContainer) return;
    
    let orderDisplay = orderContainer.querySelector('.order-display');
    if (!orderDisplay) {
        orderDisplay = document.createElement('div');
        orderDisplay.className = 'order-display';
        orderContainer.insertBefore(orderDisplay, orderContainer.querySelector('.form-group'));
    }
    
    const totalPrice = calculateTotalPrice();
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    
    orderDisplay.innerHTML = generateOrderHTML(hasSelectedDishes, totalPrice);
}

function generateOrderHTML(hasSelectedDishes, totalPrice) {
    if (!hasSelectedDishes) {
        return `
            <div class="order-summary">
                <p class="no-selection">Ничего не выбрано</p>
            </div>
        `;
    }
    
    return `
        <div class="order-summary">
            <div class="order-category">
                <strong>Суп</strong>
                <p>${selectedDishes.soup ? `${selectedDishes.soup.name} - ${selectedDishes.soup.price}₽` : 'Блюдо не выбрано'}</p>
            </div>
            <div class="order-category">
                <strong>Главное блюдо</strong>
                <p>${selectedDishes.main ? `${selectedDishes.main.name} - ${selectedDishes.main.price}₽` : 'Блюдо не выбрано'}</p>
            </div>
            <div class="order-category">
                <strong>Напиток</strong>
                <p>${selectedDishes.drink ? `${selectedDishes.drink.name} - ${selectedDishes.drink.price}₽` : 'Напиток не выбран'}</p>
            </div>
            <div class="order-category">
                <strong>Салат или стартер</strong>
                <p>${selectedDishes.salad ? `${selectedDishes.salad.name} - ${selectedDishes.salad.price}₽` : 'Блюдо не выбрано'}</p>
            </div>
            <div class="order-category">
                <strong>Десерт</strong>
                <p>${selectedDishes.dessert ? `${selectedDishes.dessert.name} - ${selectedDishes.dessert.price}₽` : 'Блюдо не выбрано'}</p>
            </div>
            ${totalPrice > 0 ? `
            <div class="order-total">
                <strong>Стоимость заказа</strong>
                <p>${totalPrice}₽</p>
            </div>
            ` : ''}
        </div>
    `;
}


// Делаем функцию глобально доступной
window.selectDish = selectDish;
window.updateAllDishCardsSelection = updateAllDishCardsSelection;