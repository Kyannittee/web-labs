// orders.js
const API_KEY = 'ecaca6c4-5c79-478d-93ec-9dd4b70763ce';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';

let orders = [];
let allDishes = []; // Для сопоставления ID блюд с названиями

document.addEventListener('DOMContentLoaded', async function() {
    console.log('orders.js загружен');
    
    // Сначала загружаем блюда для отображения названий
    await loadDishesForOrders();
    
    // Затем загружаем заказы
    await loadOrders();
    
    // Настраиваем модальные окна
    setupModals();
});

async function loadDishesForOrders() {
    console.log('Загружаем блюда для отображения...');
    
    try {
        // Загружаем блюда напрямую, без зависимости от window.dishes
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (response.ok) {
            allDishes = await response.json();
            console.log('Блюда загружены:', allDishes.length);
        } else {
            console.warn('Не удалось загрузить блюда, используем только ID');
        }
    } catch (error) {
        console.warn('Ошибка загрузки блюд:', error.message);
    }
}

async function loadOrders() {
    const loadingEl = document.getElementById('orders-loading');
    const emptyEl = document.getElementById('orders-empty');
    const tableEl = document.getElementById('orders-table-container');
    
    console.log('Загружаем заказы...');
    
    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        console.log('Ответ API получен, статус:', response.status);
        
        // ОБРАБОТКА ОШИБКИ АВТОРИЗАЦИИ
        if (response.status === 401) {
            const errorData = await response.json();
            console.error('Ошибка авторизации:', errorData);
            
            loadingEl.style.display = 'none';
            emptyEl.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Ошибка авторизации</h4>
                    <p><strong>${errorData.error || 'Неверный API ключ'}</strong></p>
                    <p>Пожалуйста, проверьте настройки API.</p>
                    <button class="btn" onclick="window.location.reload()">Обновить страницу</button>
                </div>
            `;
            emptyEl.style.display = 'block';
            return;
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка сервера:', response.status, errorText);
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }
        
        orders = await response.json();
        console.log('Загружено заказов:', orders.length);
        
        if (orders.length > 0) {
            console.log('Пример заказа:', orders[0]);
        }
        
        // Сортируем по дате (новые сначала)
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Скрываем загрузку
        loadingEl.style.display = 'none';
        
        if (orders.length === 0) {
            emptyEl.style.display = 'block';
            console.log('Нет заказов, показываем сообщение');
            return;
        }
        
        // ПРОВЕРКА ЛИМИТА 10 ЗАКАЗОВ
        if (orders.length >= 10) {
            showLimitWarning();
        }
        
        // Показываем таблицу
        tableEl.style.display = 'block';
        displayOrders(orders);
        console.log('Таблица заказов отображена');
        
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        loadingEl.style.display = 'none';
        
        emptyEl.innerHTML = `
            <div class="alert alert-danger">
                <h4>Ошибка загрузки</h4>
                <p><strong>${error.message}</strong></p>
                <p>Проверьте подключение к интернету и попробуйте снова.</p>
                <button class="btn" onclick="window.location.reload()">Обновить страницу</button>
            </div>
        `;
        emptyEl.style.display = 'block';
    }
}

// функция для показа предупреждения о лимите
function showLimitWarning() {
    // Добавляем предупреждение в начало таблицы
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    
    const warningRow = document.createElement('tr');
    warningRow.className = 'limit-warning-row';
    warningRow.innerHTML = `
        <td colspan="6">
            <div class="alert alert-warning">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">⚠️</span>
                    <div>
                        <strong>Внимание: достигнут лимит заказов</strong>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em;">
                            У вас 10 заказов (максимальный лимит). 
                            Чтобы создать новый заказ, сначала удалите один из существующих.
                        </p>
                    </div>
                </div>
            </div>
        </td>
    `;
    
    tbody.insertBefore(warningRow, tbody.firstChild);
    
    // Также показываем всплывающее уведомление
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('Достигнут лимит в 10 заказов', 'warning');
        } else {
            // Альтернатива, если showNotification не определена
            const notification = document.createElement('div');
            notification.className = 'limit-notification';
            notification.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: #ffc107; color: #856404; padding: 15px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1001;">
                     Достигнут лимит в 10 заказов
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
        }
    }, 1000);
}

function displayOrders(ordersList) {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';
    
    ordersList.forEach((order, index) => {
        const row = createOrderRow(order, index + 1);
        tbody.appendChild(row);
    });
}

function createOrderRow(order, number) {
    const tr = document.createElement('tr');
    
    // Форматируем дату
    const orderDate = new Date(order.created_at);
    const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}.${(orderDate.getMonth() + 1).toString().padStart(2, '0')}.${orderDate.getFullYear()} ${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Состав заказа
    const composition = getOrderComposition(order);
    
    // Стоимость заказа
    const totalPrice = calculateOrderTotal(order);
    
    // Время доставки
    const deliveryTime = formatDeliveryTime(order);
    
    tr.innerHTML = `
        <td>${number}</td>
        <td>${formattedDate}</td>
        <td class="order-composition">${composition}</td>
        <td>${totalPrice}₽</td>
        <td>${deliveryTime}</td>
        <td class="actions">
            <button class="action-btn view-btn" title="Подробнее" data-order-id="${order.id}">
                <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn edit-btn" title="Редактировать" data-order-id="${order.id}">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn delete-btn" title="Удалить" data-order-id="${order.id}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    return tr;
}

function getOrderComposition(order) {
    const dishes = [];
    
    // Функция для добавления блюда по ID
    const addDish = (dishId, category) => {
        if (dishId) {
            const dish = allDishes.find(d => d.id === dishId);
            if (dish) {
                dishes.push(dish.name);
            } else {
                // Если блюдо не найдено, показываем ID
                dishes.push(`${category} #${dishId}`);
            }
        }
    };
    
    // Добавляем все блюда из заказа
    if (order.soup_id) addDish(order.soup_id, 'Суп');
    if (order.main_course_id) addDish(order.main_course_id, 'Основное');
    if (order.salad_id) addDish(order.salad_id, 'Салат');
    if (order.drink_id) addDish(order.drink_id, 'Напиток');
    if (order.dessert_id) addDish(order.dessert_id, 'Десерт');
    
    return dishes.length > 0 ? dishes.join(', ') : 'Блюда не указаны';
}

function calculateOrderTotal(order) {
    let total = 0;
    
    // Функция для добавления цены блюда
    const addPrice = (dishId) => {
        if (dishId) {
            const dish = allDishes.find(d => d.id === dishId);
            if (dish && dish.price) {
                total += dish.price;
            }
        }
    };
    
    addPrice(order.soup_id);
    addPrice(order.main_course_id);
    addPrice(order.salad_id);
    addPrice(order.drink_id);
    addPrice(order.dessert_id);
    
    return total > 0 ? total : '—';
}

function formatDeliveryTime(order) {
    if (order.delivery_type === 'now') {
        return 'Как можно скорее (с 7:00 до 23:00)';
    } else if (order.delivery_type === 'by_time' && order.delivery_time) {
        const time = order.delivery_time;
        // Форматируем время: "14:30" → "14:30"
        return time.length === 5 ? time : time.substring(0, 5);
    }
    return 'Не указано';
}

function setupModals() {
    // Обработчики для кнопок в таблице
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        const orderId = button.dataset?.orderId;
        if (!orderId) return;
        
        const order = orders.find(o => o.id == orderId);
        if (!order) return;
        
        if (button.classList.contains('view-btn') || e.target.closest('.view-btn')) {
            showOrderDetails(order);
        } else if (button.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
            showEditModal(order);
        } else if (button.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            showDeleteModal(order);
        }
    });
    
    // Закрытие модальных окон
    document.querySelectorAll('.modal-close, #close-details-btn, #cancel-edit-btn, #cancel-delete-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Сохранение изменений
    document.getElementById('save-edit-btn').addEventListener('click', saveOrderChanges);
    
    // Подтверждение удаления
    document.getElementById('confirm-delete-btn').addEventListener('click', deleteOrder);
    
    // Переключение видимости поля времени в форме редактирования
    document.querySelectorAll('#edit-order-form input[name="delivery_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const timeGroup = document.getElementById('edit-time-group');
            timeGroup.style.display = this.value === 'by_time' ? 'block' : 'none';
            
            // Если выбрано "by_time", делаем поле времени обязательным
            const timeInput = document.getElementById('edit-delivery-time');
            if (timeInput) {
                timeInput.required = this.value === 'by_time';
            }
        });
    });
    
    // Закрытие по клику на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAllModals();
            }
        });
    });
}

function showOrderDetails(order) {
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    // Форматируем дату
    const orderDate = new Date(order.created_at);
    const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}.${(orderDate.getMonth() + 1).toString().padStart(2, '0')}.${orderDate.getFullYear()} ${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Получаем блюда заказа с ценами
    const orderDishes = [];
    const addDishInfo = (dishId, categoryName) => {
        if (dishId) {
            const dish = allDishes.find(d => d.id === dishId);
            if (dish) {
                orderDishes.push({
                    name: dish.name,
                    price: dish.price,
                    category: categoryName
                });
            } else {
                // Если блюдо не найдено
                orderDishes.push({
                    name: `ID: ${dishId}`,
                    price: 0,
                    category: categoryName
                });
            }
        }
    };
    
    addDishInfo(order.soup_id, 'Суп');
    addDishInfo(order.main_course_id, 'Основное блюдо');
    addDishInfo(order.salad_id, 'Салат');
    addDishInfo(order.drink_id, 'Напиток');
    addDishInfo(order.dessert_id, 'Десерт');
    
    // Форматируем время доставки
    const deliveryTimeText = formatDeliveryTime(order);
    
    // Считаем итоговую стоимость
    const totalPrice = calculateOrderTotal(order);
    
    // Создаем HTML
    content.innerHTML = `
        <div class="order-details-grid">
            <div class="detail-group">
                <label>Дата оформления</label>
                <p>${formattedDate}</p>
            </div>
            <div class="detail-group">
                <label>Имя получателя</label>
                <p>${order.full_name || 'Не указано'}</p>
            </div>
            <div class="detail-group">
                <label>Email</label>
                <p>${order.email || 'Не указано'}</p>
            </div>
            <div class="detail-group">
                <label>Телефон</label>
                <p>${order.phone || 'Не указано'}</p>
            </div>
            <div class="detail-group">
                <label>Адрес доставки</label>
                <p>${order.delivery_address || 'Не указано'}</p>
            </div>
            <div class="detail-group">
                <label>Время доставки</label>
                <p>${deliveryTimeText}</p>
            </div>
            ${order.subscribe ? `<div class="detail-group">
                <label>Подписка</label>
                <p>Подписан на рассылку</p>
            </div>` : ''}
        </div>
        
        ${order.comment ? `
        <div class="detail-group">
            <label>Комментарий</label>
            <p>${order.comment}</p>
        </div>
        ` : ''}
        
        <div class="detail-group">
            <label>Состав заказа</label>
            ${orderDishes.length > 0 ? `
            <ul class="order-dishes-list">
                ${orderDishes.map(dish => `
                    <li>
                        <span>${dish.category}</span>
                        <span>${dish.name} ${dish.price > 0 ? `(${dish.price}₽)` : ''}</span>
                    </li>
                `).join('')}
            </ul>
            ` : '<p>Блюда не указаны</p>'}
        </div>
        
        <div class="order-total-display">
            <strong>Стоимость: ${totalPrice}₽</strong>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
}

function showEditModal(order) {
    const modal = document.getElementById('order-edit-modal');
    const form = document.getElementById('edit-order-form');
    
    // Заполняем форму данными заказа
    document.getElementById('edit-order-id').value = order.id;
    document.getElementById('edit-full-name').value = order.full_name || '';
    document.getElementById('edit-email').value = order.email || '';
    document.getElementById('edit-phone').value = order.phone || '';
    document.getElementById('edit-address').value = order.delivery_address || '';
    document.getElementById('edit-comment').value = order.comment || '';
    
    // Устанавливаем тип доставки
    const timeGroup = document.getElementById('edit-time-group');
    const timeInput = document.getElementById('edit-delivery-time');
    
    if (order.delivery_type === 'by_time') {
        document.getElementById('edit-delivery-by-time').checked = true;
        timeGroup.style.display = 'block';
        timeInput.value = order.delivery_time || '';
        timeInput.required = true;
    } else {
        document.getElementById('edit-delivery-now').checked = true;
        timeGroup.style.display = 'none';
        timeInput.required = false;
    }
    
    // ОТОБРАЖАЕМ СОСТАВ ЗАКАЗА
    displayOrderCompositionInEditForm(order);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Новая функция для отображения состава заказа в форме редактирования
function displayOrderCompositionInEditForm(order) {
    const container = document.getElementById('edit-order-composition');
    
    // Получаем блюда заказа с ценами
    const orderDishes = [];
    const addDishInfo = (dishId, categoryName) => {
        if (dishId) {
            const dish = allDishes.find(d => d.id === dishId);
            if (dish) {
                orderDishes.push({
                    name: dish.name,
                    price: dish.price,
                    category: categoryName
                });
            } else {
                // Если блюдо не найдено
                orderDishes.push({
                    name: `ID: ${dishId}`,
                    price: 0,
                    category: categoryName
                });
            }
        }
    };
    
    addDishInfo(order.soup_id, 'Суп');
    addDishInfo(order.main_course_id, 'Основное блюдо');
    addDishInfo(order.salad_id, 'Салат');
    addDishInfo(order.drink_id, 'Напиток');
    addDishInfo(order.dessert_id, 'Десерт');
    
    // Считаем итоговую стоимость
    const totalPrice = orderDishes.reduce((sum, dish) => sum + dish.price, 0);
    
    // Создаем HTML
    if (orderDishes.length === 0) {
        container.innerHTML = '<p class="no-dishes">Блюда не указаны</p>';
        return;
    }
    
    let html = '';
    
    orderDishes.forEach(dish => {
        html += `
            <div class="dish-item">
                <span class="dish-category">${dish.category}</span>
                <span class="dish-name">${dish.name}</span>
                <span class="dish-price">${dish.price > 0 ? `${dish.price}₽` : '—'}</span>
            </div>
        `;
    });
    
    // Добавляем итоговую строку
    html += `
        <div class="dish-item total-row">
            <span class="dish-category">Итого:</span>
            <span class="dish-name"></span>
            <span class="dish-price">${totalPrice}₽</span>
        </div>
    `;
    
    container.innerHTML = html;
}

async function saveOrderChanges() {
    const form = document.getElementById('edit-order-form');
    const orderId = document.getElementById('edit-order-id').value;
    
    // Собираем данные
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Проверка обязательных полей
    if (!data.full_name || !data.email || !data.phone || !data.delivery_address || !data.delivery_type) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }
    
    // Проверка времени доставки
    if (data.delivery_type === 'by_time' && !data.delivery_time) {
        alert('Пожалуйста, укажите время доставки.');
        return;
    }
    
    // Убираем скрытое поле id из данных для отправки
    delete data['']; // если есть пустое имя
    
    // Добавляем subscribe (если нужно)
    const order = orders.find(o => o.id == orderId);
    if (order && order.subscribe !== undefined) {
        data.subscribe = order.subscribe;
    }
    
    console.log('Обновляем заказ:', data);
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка ${response.status}`);
        }
        
        const updatedOrder = await response.json();
        
        // Обновляем заказ в локальном массиве
        const index = orders.findIndex(o => o.id == orderId);
        if (index !== -1) {
            orders[index] = updatedOrder;
        }
        
        // Обновляем таблицу
        displayOrders(orders);
        
        // Закрываем модальное окно
        closeAllModals();
        
        // Показываем уведомление
        showSuccessMessage('Заказ успешно изменён');
        
    } catch (error) {
        console.error('Ошибка обновления заказа:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

function showDeleteModal(order) {
    const modal = document.getElementById('order-delete-modal');
    modal.dataset.orderId = order.id;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function deleteOrder() {
    const modal = document.getElementById('order-delete-modal');
    const orderId = modal.dataset.orderId;
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Ошибка ${response.status}`);
        }
        
        // Удаляем заказ из локального массива
        orders = orders.filter(o => o.id != orderId);
        
        // Обновляем таблицу
        displayOrders(orders);
        
        // Закрываем модальное окно
        closeAllModals();
        
        // Показываем уведомление
        showSuccessMessage('Заказ успешно удалён');
        
        // Если заказов не осталось, показываем сообщение
        if (orders.length === 0) {
            document.getElementById('orders-table-container').style.display = 'none';
            document.getElementById('orders-empty').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Ошибка удаления заказа:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = ''; // Восстанавливаем скролл
}

function showSuccessMessage(message) {
    // Используем существующую функцию showNotification или alert
    if (typeof showNotification === 'function') {
        showNotification(message, 'success');
    } else {
        alert(` ${message}`);
    }
}

// Экспортируем функции для отладки
window.loadOrders = loadOrders;
window.showOrderDetails = showOrderDetails;
window.orders = orders;