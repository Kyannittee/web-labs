let dishes = []; // Глобальная переменная для хранения всех блюд из API

// Карта соответствия ID секций и категорий API
const CATEGORY_MAP = {
    'soups': 'soup',
    'main-dishes': 'main-course',  // Главные блюда в API
    'drinks': 'drink',
    'salads': 'salad',
    'desserts': 'dessert'
};

async function loadDishes() { // Основная функция для загрузки блюд с сервера
    try {
        console.log('Загрузка данных с API...');
        
        // URL API 
        const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        
        // Запрос к API
        const response = await fetch(apiUrl, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json' // Сообщаем серверу, что хотим получить JSON
            }
        });
        
        if (!response.ok) { // Если статус не ок (404, 500 и т.д.), выбрасываем ошибку
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        dishes = await response.json();
        
        console.log(`Загружено ${dishes.length} блюд`);
        console.log('Карта категорий:', CATEGORY_MAP);
        
        // Сохраняем глобально для других файлов
        window.dishes = dishes;
        window.CATEGORY_MAP = CATEGORY_MAP;
        
        // Возвращаем массив блюд для использования в месте вызова функции
        return dishes;
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        
        // Показываем сообщение пользователю
        const errorDiv = document.createElement('div');
        errorDiv.className = 'api-error';
        errorDiv.innerHTML = `
            <p>Не удалось загрузить меню. Ошибка: ${error.message}</p>
            <p>Попробуйте обновить страницу позже.</p>
        `;
        
        const main = document.querySelector('main');
        if (main) main.prepend(errorDiv); // Если тег main найден, вставляем сообщение об ошибке В начало main
        
        return [];
    }
}

window.loadDishes = loadDishes; // Делаем функцию loadDishes доступной глобально