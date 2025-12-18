
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('lunch-order-form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isValid = validateLunchCombo();
            
            if (isValid) {
                this.submit();
            }
        });
    }
});


function validateLunchCombo() {
    // Проверяем, что selectedDishes существует
    const selectedDishes = window.selectedDishes || {};
    
    // Проверяем, что выбраны блюда
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasSelectedDishes) {
        showNotification('Ничего не выбрано. Выберите блюда для заказа');
        return false;
    }
    
    // Определяем, какие категории выбраны
    const hasSoup = selectedDishes.soup !== null;
    const hasMain = selectedDishes.main !== null;
    const hasSalad = selectedDishes.salad !== null;
    const hasDrink = selectedDishes.drink !== null;
    const hasDessert = selectedDishes.dessert !== null;
    
    // 1. Проверка: Выбран салат, но нет супа или главного
    if (hasSalad && !hasSoup && !hasMain) {
        showNotification('Выберите суп или главное блюдо');
        return false;
    }
    
    // 2. Проверка: Выбран суп, но нет главного или салата
    if (hasSoup && !hasMain && !hasSalad) {
        showNotification('Выберите главное блюдо/салат/стартер');
        return false;
    }
    
    // 3. Проверка: Выбраны напиток ИЛИ десерт, но нет главного
    if ((hasDrink || hasDessert) && !hasMain && !hasSoup && !hasSalad) {
        showNotification('Выберите главное блюдо');
        return false;
    }
    
    // 4. Проверяем допустимые комбинации (5 вариантов)
    const hasAnyMainDish = hasSoup || hasMain || hasSalad;
    
    if (hasAnyMainDish) {
        const isValidCombo = checkValidCombinations(hasSoup, hasMain, hasSalad, hasDrink);
        
        if (!isValidCombo) {
            // Возможно, не хватает напитка
            if (hasSoup || hasMain || hasSalad) {
                if (!hasDrink) {
                    showNotification('Выберите напиток');
                    return false;
                }
            }
            
            // Если с напитком всё ок, но комбо всё равно не валидно
            showNotification('Выбранные блюда не соответствуют ни одному из доступных комбо');
            return false;
        }
        
        // Если комбо валидно, проверяем наличие напитка
        if (!hasDrink) {
            showNotification('Выберите напиток');
            return false;
        }
        
        return true;
    }
    
    // Если нет основных блюд вообще
    showNotification('Выберите главное блюдо');
    return false;
}

function checkValidCombinations(hasSoup, hasMain, hasSalad, hasDrink) {
    // Проверяем 5 допустимых комбинаций
    
    // 1. Суп + Главное + Салат + Напиток
    if (hasSoup && hasMain && hasSalad && hasDrink) return true;
    
    // 2. Суп + Главное + Напиток
    if (hasSoup && hasMain && hasDrink && !hasSalad) return true;
    
    // 3. Суп + Салат + Напиток
    if (hasSoup && hasSalad && hasDrink && !hasMain) return true;
    
    // 4. Главное + Салат + Напиток
    if (hasMain && hasSalad && hasDrink && !hasSoup) return true;
    
    // 5. Главное + Напиток
    if (hasMain && hasDrink && !hasSoup && !hasSalad) return true;
    
    return false;
}

function showNotification(message) {
    // Удаляем существующее уведомление
    const existingNotification = document.querySelector('.notification-overlay');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Создаем само уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <p>${message}</p>
        <button class="notification-btn">Окей</button>
    `;
    
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
    
    // Добавляем обработчик для кнопки
    const okBtn = notification.querySelector('.notification-btn');
    okBtn.addEventListener('click', function() {
        overlay.remove();
    });
    
    // Добавляем hover эффект для кнопки
    okBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#2c3e50';
        this.style.color = 'white';
    });
    
    okBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#3498db';
        this.style.color = 'white';
    });
}

// ДЕЛАЕМ ФУНКЦИИ ДОСТУПНЫМИ ГЛОБАЛЬНО
window.validateLunchCombo = validateLunchCombo;
window.showNotification = showNotification;
window.checkValidCombinations = checkValidCombinations;