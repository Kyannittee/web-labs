
document.addEventListener('DOMContentLoaded', async function() {
    console.log('checkout.js загружен');
    
    // Ждем загрузки блюд из API
    await loadDishes();
    
    // Загружаем и отображаем заказ
    displayCurrentOrder();
    
    // Настраиваем обработчики
    setupEventListeners();

    setupDeliveryTimeVisibility();
});

function getOrderFromStorage() {
    const savedOrder = localStorage.getItem('lunchOrder');
    if (!savedOrder) return {};
    
    try {
        const orderData = JSON.parse(savedOrder);
        console.log('Заказ из localStorage:', orderData);
        
        // Восстанавливаем полные объекты блюд
        const fullOrder = {};
        Object.entries(orderData).forEach(([category, keyword]) => {
            // Ищем блюдо по keyword 
            const dish = window.dishes.find(d => d.keyword === keyword);
            if (dish) {
                fullOrder[category] = dish;
            }
        });
        
        return fullOrder;
        
    } catch (error) {
        console.error('Ошибка загрузки заказа:', error);
        return {};
    }
}

function displayCurrentOrder() {
    const order = getOrderFromStorage();
    const container = document.getElementById('order-items-container'); // Карточки
    const summary = document.getElementById('order-summary'); // Итог под карточками
    const formDisplay = document.getElementById('order-display-checkout'); // В левой колонке
    const orderTotal = document.getElementById('order-total-checkout'); // Итог в левой колонке
    
    if (!container) return;
    
    const hasOrder = Object.values(order).some(dish => dish !== null);
    
    if (!hasOrder) {
        container.innerHTML = `
            <div class="no-order">
                <p>Ничего не выбрано.</p>
                <p>Чтобы добавить блюда в заказ, перейдите на страницу 
                   <a href="pack.html">Собрать ланч</a>.
                </p>
            </div>
        `;
        
        if (summary) summary.innerHTML = '';
        if (formDisplay) formDisplay.innerHTML = '<p>Заказ пуст</p>';
        if (orderTotal) orderTotal.innerHTML = '';
        return;
    }
    
    // 1. Отображаем карточки блюд (вверху)
    let cardsHtml = '';
    let totalPrice = 0;
    
    const categories = [
        { key: 'soup', title: 'Суп' },
        { key: 'main', title: 'Главное блюдо' },
        { key: 'drink', title: 'Напиток' },
        { key: 'salad', title: 'Салат' },
        { key: 'dessert', title: 'Десерт' }
    ];
    
    categories.forEach(({ key, title }) => {
        const dish = order[key];
        
        if (dish) {
            totalPrice += dish.price;
            
            cardsHtml += `
                <div class="dish-card" data-category="${key}" data-keyword="${dish.keyword}">
                    <img src="${dish.image}" alt="${dish.name}" 
                         onerror="this.src='images/placeholder.jpg'">
                    <p class="dish-price">${dish.price}₽</p>
                    <p class="dish-name">${dish.name}</p>
                    <p class="dish-weight">${dish.count}</p>
                    <button class="remove-btn" data-category="${key}">Удалить</button>
                </div>
            `;
        }
    });
    
    container.innerHTML = cardsHtml;
    
    // 2. Итог под карточками
    if (summary) {
    summary.innerHTML = ''; // Пусто - убираем итог
}
    
    // 3. Отображаем в левой колонке (форма)
    updateFormDisplay(order, totalPrice);
    
    // 4. Итог в левой колонке
    if (orderTotal) {
        orderTotal.innerHTML = `<strong>Итого к оплате: ${totalPrice}₽</strong>`;
    }
}

function updateFormDisplay(order, totalPrice) {
    const formDisplay = document.getElementById('order-display-checkout');
    if (!formDisplay) return;
    
    let html = '';
    
    const categories = [
        { key: 'soup', title: 'Суп' },
        { key: 'main', title: 'Главное блюдо' },
        { key: 'drink', title: 'Напиток' },
        { key: 'salad', title: 'Салат или стартер' },
        { key: 'dessert', title: 'Десерт' }
    ];
    
    categories.forEach(({ key, title }) => {
        const dish = order[key];
        
        html += `
            <div class="form-category-block" data-category="${key}">
                <div class="category-title">${title}</div>
                <div class="category-content">
                    ${dish ? `
                        <div class="dish-line">
                            <span class="dish-name-left">${dish.name}</span>
                            <span class="dish-price-right">${dish.price}₽</span>
                        </div>
                    ` : `
                        <div class="dish-line">
                            <span class="dish-not-selected">Не выбрано</span>
                        </div>
                    `}
                </div>
            </div>
        `;
    });
    
    // итоговая строка
    html += `
        <div class="form-order-total-bottom">
            <div class="total-label-bottom">Стоимость заказа</div>
            <div class="total-value-bottom">${totalPrice}₽</div>
        </div>
    `;
    
    formDisplay.innerHTML = html;
}

function setupEventListeners() {
    // Удаление блюд
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const category = e.target.getAttribute('data-category');
            removeDishFromOrder(category);
        }
    });
    
    // Отправка формы
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder(this);
        });
    }
}

function setupDeliveryTimeVisibility() {
    const deliveryType = document.getElementById('delivery-type');
    const timeGroup = document.getElementById('delivery-time-group');
    
    if (deliveryType && timeGroup) {
        // Обработчик изменения типа доставки
        deliveryType.addEventListener('change', function() {
            if (this.value === 'by_time') {
                timeGroup.style.display = 'block';
            } else {
                timeGroup.style.display = 'none';
            }
        });
        
        // Инициализация при загрузке
        if (deliveryType.value === 'by_time') {
            timeGroup.style.display = 'block';
        }
    }
}


function removeDishFromOrder(category) {
    const savedOrder = localStorage.getItem('lunchOrder');
    if (!savedOrder) return;
    
    try {
        const orderData = JSON.parse(savedOrder);
        delete orderData[category];
        
        localStorage.setItem('lunchOrder', JSON.stringify(orderData));
        console.log(`Удалено блюдо из категории: ${category}`);
        
        // ОБНОВЛЯЕМ глобальный selectedDishes
        if (window.selectedDishes) {
            window.selectedDishes[category] = null;
        }
        
        // Обновляем отображение
        displayCurrentOrder();
        
    } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить блюдо. Попробуйте еще раз.');
    }
}

function validateOrderCombo(order) {
    if (!order || typeof order !== 'object') {
        console.log('Нет данных заказа');
        return false;
    }
    
    // Проверяем, что это объект с блюдами
    console.log('Проверяем заказ:', order);
    
    const hasSoup = order.soup !== null && order.soup !== undefined;
    const hasMain = order.main !== null && order.main !== undefined;
    const hasSalad = order.salad !== null && order.salad !== undefined;
    const hasDrink = order.drink !== null && order.drink !== undefined;
    
    console.log('Категории:', { hasSoup, hasMain, hasSalad, hasDrink });
    
    // 5 допустимых комбинаций из ЛР6
    const isValid = (
        (hasSoup && hasMain && hasSalad && hasDrink) ||      // 1. Суп + Главное + Салат + Напиток
        (hasSoup && hasMain && hasDrink && !hasSalad) ||     // 2. Суп + Главное + Напиток
        (hasSoup && hasSalad && hasDrink && !hasMain) ||     // 3. Суп + Салат + Напиток
        (hasMain && hasSalad && hasDrink && !hasSoup) ||     // 4. Главное + Салат + Напиток
        (hasMain && hasDrink && !hasSoup && !hasSalad)       // 5. Главное + Напиток
    );
    
    console.log(isValid ? 'Комбо валидно' : 'Не соответствует комбо');
    return isValid;
}

async function submitOrder(form) {
    console.log('=== НАЧАЛО ОФОРМЛЕНИЯ ЗАКАЗА ===');
    
    const order = getOrderFromStorage();
    console.log('Заказ из хранилища:', order);
    
    // Проверка комбо
    const isValid = validateLunchComboForCheckout(order);
    
    if (!isValid) {
        return;
    }
    
    // Проверяем обязательные поля формы
    const name = form.querySelector('#checkout-name').value.trim();
    const phone = form.querySelector('#checkout-phone').value.trim();
    const address = form.querySelector('#checkout-address').value.trim();
    const email = form.querySelector('#checkout-email').value.trim();

    // Получаем значение выбранной радиокнопки
    const deliveryTypeRadio = document.querySelector('input[name="delivery_type"]:checked');
    const deliveryType = deliveryTypeRadio ? deliveryTypeRadio.value : '';

    const comment = form.querySelector('#checkout-comment').value.trim();
    
    // Получаем чекбокс подписки
    const subscribeCheckbox = document.querySelector('#subscribe');
    const subscribe = subscribeCheckbox && subscribeCheckbox.checked ? 1 : 0;

    // Простая проверка полей
    if (!name || !phone || !address || !email || !deliveryType) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }
    
    // Проверка времени доставки
    let deliveryTime = '';
    if (deliveryType === 'by_time') {
        const deliveryTimeInput = document.querySelector('#delivery-time');
        if (!deliveryTimeInput) {
            alert('Ошибка: поле времени доставки не найдено.');
            return;
        }
        
        deliveryTime = deliveryTimeInput.value.trim();
        if (!deliveryTime) {
            alert('Пожалуйста, укажите время доставки.');
            return;
        }
        
        // ВАЛИДАЦИЯ ВРЕМЕНИ ПО ТРЕБОВАНИЯМ
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!timeRegex.test(deliveryTime)) {
            alert('Время должно быть в формате HH:MM (например, 14:30)');
            return;
        }
        
        const [hours, minutes] = deliveryTime.split(':').map(Number);
        
        // Проверка диапазона 7:00-23:00
        if (hours < 7 || hours > 23 || (hours === 23 && minutes > 0)) {
            alert('Время доставки должно быть с 7:00 до 23:00');
            return;
        }
        
        // Проверка шага 5 минут
        if (minutes % 5 !== 0) {
            alert('Время доставки должно быть кратно 5 минутам (например, 14:00, 14:05, 14:10)');
            return;
        }
        
        // Проверка, что время не в прошлом
        const now = new Date();
        const deliveryDate = new Date();
        deliveryDate.setHours(hours, minutes, 0, 0);
        
        // Сравниваем только если сегодня
        if (deliveryDate.getDate() === now.getDate() && 
            deliveryDate.getMonth() === now.getMonth() && 
            deliveryDate.getFullYear() === now.getFullYear()) {
            
            if (deliveryDate < now) {
                alert('Время доставки не может быть раньше текущего времени');
                return;
            }
        }
    }
    
    // ПРОВЕРКА ЛИМИТА 10 ЗАКАЗОВ
    const API_KEY = 'ecaca6c4-5c79-478d-93ec-9dd4b70763ce';
    const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
    
    try {
        console.log('Проверяем количество существующих заказов...');
        const checkResponse = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        
        if (checkResponse.status === 401) {
            const errorData = await checkResponse.json();
            throw new Error(errorData.error || 'Ошибка авторизации');
        }
        
        if (checkResponse.ok) {
            const existingOrders = await checkResponse.json();
            console.log(`У пользователя уже ${existingOrders.length} заказов`);
            
            if (existingOrders.length >= 10) {
                const shouldGoToOrders = confirm(
                    'Вы достигли максимального лимита в 10 заказов.\n\n' +
                    'Чтобы создать новый заказ, нужно удалить старые.\n\n' +
                    'Перейти к управлению заказами?'
                );
                
                if (shouldGoToOrders) {
                    window.location.href = 'orders.html';
                }
                return;
            }
        }
    } catch (error) {
        console.error('Ошибка проверки лимита:', error);
        // Продолжаем, даже если проверка не удалась
    }
    
    // Собираем данные заказа
    const orderData = {
        full_name: name,
        email: email,
        phone: phone,
        delivery_address: address,
        delivery_type: deliveryType,
        subscribe: subscribe,
        comment: comment
    };
    
    // Добавляем время доставки если нужно
    if (deliveryType === 'by_time' && deliveryTime) {
        orderData.delivery_time = deliveryTime;
    }
    
    // Добавляем ID блюд
    if (order.soup) orderData.soup_id = order.soup.id;
    if (order.main) orderData.main_course_id = order.main.id;
    if (order.drink) orderData.drink_id = order.drink.id;
    if (order.salad) orderData.salad_id = order.salad.id;
    if (order.dessert) orderData.dessert_id = order.dessert.id;
    
    console.log('Отправляем заказ на сервер:', orderData);
    
    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('Ответ сервера:', response.status);
        
        // Обработка ошибки авторизации
        if (response.status === 401) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка авторизации. Проверьте API ключ.');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Текст ошибки:', errorText);
            
            let errorMessage = `Ошибка сервера: ${response.status}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // Если не JSON, используем текст как есть
                if (errorText) errorMessage = errorText;
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('Заказ успешно создан:', result);
        
        // Очищаем localStorage
        localStorage.removeItem('lunchOrder');
        if (window.selectedDishes) {
            window.selectedDishes = {
                soup: null,
                main: null,
                drink: null,
                salad: null,
                dessert: null
            };
        }
        
        // Показываем успешное сообщение
        alert(`Заказ успешно оформлен!\n\nНомер заказа: ${result.id || 'не указан'}\nСумма: ${calculateOrderTotal(order)}₽`);
        
        // Перенаправляем на страницу заказов
        window.location.href = 'orders.html';
        
    } catch (error) {
        console.error('Ошибка отправки заказа:', error);
        alert(`Ошибка оформления заказа:\n\n${error.message}\n\nПопробуйте еще раз.`);
    }
    
    console.log('=== КОНЕЦ ОФОРМЛЕНИЯ ЗАКАЗА ===');
}

// Вспомогательная функция для расчета суммы
function calculateOrderTotal(order) {
    let total = 0;
    if (order.soup && order.soup.price) total += order.soup.price;
    if (order.main && order.main.price) total += order.main.price;
    if (order.drink && order.drink.price) total += order.drink.price;
    if (order.salad && order.salad.price) total += order.salad.price;
    if (order.dessert && order.dessert.price) total += order.dessert.price;
    return total;
}
       
// ПРОСТАЯ проверка комбо для checkout
function validateLunchComboForCheckout(order) {
    console.log('=== НАЧАЛО ПРОВЕРКИ КОМБО ===');
    console.log('Полученный заказ:', order);
    
    if (!order || Object.keys(order).length === 0) {
        console.log('Нет заказа');
        showNotification('Ничего не выбрано. Выберите блюда для заказа');
        return false;
    }
    
    // Преобразуем в формат для validateLunchCombo
    const selectedDishes = {
        soup: order.soup || null,
        main: order.main || null,
        salad: order.salad || null,
        drink: order.drink || null,
        dessert: order.dessert || null
    };
    
    console.log('Преобразованные блюда:', selectedDishes);
    
    // Проверяем вручную для отладки
    const hasSoup = selectedDishes.soup !== null;
    const hasMain = selectedDishes.main !== null;
    const hasSalad = selectedDishes.salad !== null;
    const hasDrink = selectedDishes.drink !== null;
    const hasDessert = selectedDishes.dessert !== null;
    
    console.log('Категории:', { hasSoup, hasMain, hasSalad, hasDrink, hasDessert });
    
    // 1. Ничего не выбрано
    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
        showNotification('Ничего не выбрано. Выберите блюда для заказа');
        return false;
    }
    
    // 2. Выбран салат, но нет супа или главного
    if (hasSalad && !hasSoup && !hasMain) {
        showNotification('Выберите суп или главное блюдо');
        return false;
    }
    
    // 3. Выбран суп, но нет главного или салата
    if (hasSoup && !hasMain && !hasSalad) {
        showNotification('Выберите главное блюдо/салат/стартер');
        return false;
    }
    
    // 4. Выбраны напиток/десерт, но нет главного
    if ((hasDrink || hasDessert) && !hasMain && !hasSoup && !hasSalad) {
        showNotification('Выберите главное блюдо');
        return false;
    }
    
    // 5. Проверяем 5 комбинаций
    const hasAnyMainDish = hasSoup || hasMain || hasSalad;
    
    if (hasAnyMainDish) {
        const isValidCombo = checkValidCombinations(hasSoup, hasMain, hasSalad, hasDrink);
        
        if (!isValidCombo) {
            // Если комбо не валидно, проверяем что именно не так
            if (hasSoup || hasMain || hasSalad) {
                if (!hasDrink) {
                    showNotification('Выберите напиток');
                    return false;
                }
            }
            
            showNotification('Выбранные блюда не соответствуют ни одному из доступных комбо');
            return false;
        }
        
        // Если комбо валидно, проверяем наличие напитка
        if (!hasDrink) {
            showNotification('Выберите напиток');
            return false;
        }
        
        console.log('Комбо валидно!');
        return true;
    }
    
    // Если нет основных блюд вообще
    showNotification('Выберите главное блюдо');
    return false;
}