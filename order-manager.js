let selectedDishes = {//объект для хранения выбранных блюд
        soup: null,
        main: null,
        drink: null,
        salad: null,    
        dessert: null 
    };

document.addEventListener('DOMContentLoaded', function() {
    
    
    // Инициализируем отображение заказа
    updateOrderDisplay();
    
    // Добавляем обработчики событий для карточек блюд
    document.addEventListener('click', function(e) {//слушаем событие клика по всей странице
        if (e.target.closest('.dish-card')) {//если кликнули куда-то внутри карточки - условие true
            const dishCard = e.target.closest('.dish-card');
            const dishKeyword = dishCard.getAttribute('data-dish');
            const dish = dishes.find(d => d.keyword === dishKeyword);//ищет в массиве dishes первый элемент, подходящий под условие
            
            if (dish) {
                selectDish(dish);
            }
        }
    });
    
    function selectDish(dish) {//Обновляет выбранное блюдо и перерисовывает интерфейс.
        selectedDishes[dish.category] = dish;//записывает блюдо в соответствующую категорию
        updateOrderDisplay();//обновляет отображение заказа на странице
    }
    
    function updateOrderDisplay() {
        const orderContainer = document.querySelector('.order-column');//Находит контейнер заказа на странице
        if (!orderContainer) return;
        
        // Находим или создаем блок для отображения заказа
        let orderDisplay = orderContainer.querySelector('.order-display');
        if (!orderDisplay) {
            orderDisplay = document.createElement('div');
            orderDisplay.className = 'order-display';
            orderContainer.insertBefore(orderDisplay, orderContainer.querySelector('.form-group'));
        }
        
        // Подсчитываем общую стоимость
        const totalPrice = calculateTotalPrice();
        const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
        
        // Обновляем отображение
        orderDisplay.innerHTML = generateOrderHTML(hasSelectedDishes, totalPrice);
    }
    
    function calculateTotalPrice() {
        return Object.values(selectedDishes).reduce((total, dish) => {
            return total + (dish ? dish.price : 0);
        }, 0);
    }
    
    function generateOrderHTML(hasSelectedDishes, totalPrice) {//Генерирует HTML-код для отображения заказа
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
    
    
});