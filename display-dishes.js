
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM загружен, загружаем блюда...');
    
    // Ждем загрузки данных из API
    const loadedDishes = await loadDishes();
    
    if (!loadedDishes || loadedDishes.length === 0) {
        console.error('Нет данных о блюдах');
        showErrorMessage('Не удалось загрузить меню. Пожалуйста, обновите страницу.');
        return;
    }
    
    console.log('Блюда загружены, группируем по категориям...');
    
    // Сортируем блюда по алфавиту
    const sortedDishes = loadedDishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям используя CATEGORY_MAP
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === CATEGORY_MAP['soups']),
        main: sortedDishes.filter(dish => dish.category === CATEGORY_MAP['main-dishes']),
        drink: sortedDishes.filter(dish => dish.category === CATEGORY_MAP['drinks']),
        salad: sortedDishes.filter(dish => dish.category === CATEGORY_MAP['salads']),
        dessert: sortedDishes.filter(dish => dish.category === CATEGORY_MAP['desserts'])
    };
    
    console.log('Результат группировки:');
    console.log('- Супы:', dishesByCategory.soup.length, 'блюд');
    console.log('- Главные:', dishesByCategory.main.length, 'блюд');
    console.log('- Напитки:', dishesByCategory.drink.length, 'блюд');
    console.log('- Салаты:', dishesByCategory.salad.length, 'блюд');
    console.log('- Десерты:', dishesByCategory.dessert.length, 'блюд');
    
    // Отображаем блюда в соответствующих секциях
    displayDishesInSection('soups', dishesByCategory.soup);
    displayDishesInSection('main-dishes', dishesByCategory.main);
    displayDishesInSection('drinks', dishesByCategory.drink);
    displayDishesInSection('salads', dishesByCategory.salad);
    displayDishesInSection('desserts', dishesByCategory.dessert);
    
    console.log('Все блюда отображены!');
});

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<p>${message}</p>`;
    document.querySelector('main').prepend(errorDiv);
}

function displayDishesInSection(sectionId, dishesArray) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Секция ${sectionId} не найдена`);
        return;
    }
    
    const grid = section.querySelector('.dishes-grid');
    if (!grid) {
        console.warn(`Сетка в секции ${sectionId} не найдена`);
        return;
    }
    
    // Очищаем сетку
    grid.innerHTML = '';
    
    if (!dishesArray || dishesArray.length === 0) {
        grid.innerHTML = '<p class="no-dishes">Блюда временно отсутствуют</p>';
        return;
    }
    
    // Создаем карточки для каждого блюда
    dishesArray.forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-category', dish.category);
    card.setAttribute('data-kind', dish.kind);
    
    // Проверяем, выбрано ли это блюдо
    const isSelected = isDishSelected(dish.keyword);
    if (isSelected) {
        card.classList.add('selected');
    }
    
    // Обработка изображения
    let imageSrc = dish.image;
    
    card.innerHTML = `
        <img src="${imageSrc}" alt="${dish.name}" 
             onerror="this.onerror=null; this.src='images/placeholder.jpg';">
        <p class="dish-price">${dish.price}₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="dish-weight">${dish.count}</p>
        <button class="add-btn">${isSelected ? '✓ Выбрано' : 'Добавить'}</button>
    `;
    
    return card;
}

function isDishSelected(keyword) {
    // Проверяем глобальный объект selectedDishes
    if (!window.selectedDishes) return false;
    
    // Ищем блюдо во всех категориях
    return Object.values(window.selectedDishes).some(dish => 
        dish && dish.keyword === keyword
    );
}

function displayCombos() {
    const combosSection = document.getElementById('combo-section');
    if (!combosSection) return;
    
    const combosGrid = combosSection.querySelector('.combos-grid');
    if (!combosGrid) return;
    
    // Проверяем, загружены ли блюда
    if (!window.dishes || window.dishes.length === 0) {
        console.warn('Блюда не загружены для отображения комбо');
        return;
    }
    
    // Берем по 1 примеру блюда из каждой категории для демонстрации
    const exampleDishes = {
        soup: window.dishes.find(d => d.category === 'soup'),
        main: window.dishes.find(d => d.category === 'main-course'),
        salad: window.dishes.find(d => d.category === 'salad'),
        drink: window.dishes.find(d => d.category === 'drink'),
        dessert: window.dishes.find(d => d.category === 'dessert')
    };
    
    // Если не нашли примеры, выходим
    if (!exampleDishes.soup || !exampleDishes.main || !exampleDishes.drink) {
        console.warn('Не найдены примеры блюд для комбо');
        return;
    }
    
    // 5 комбинаций согласно требованиям
    const combos = [
        {
            id: 1,
            name: 'Полный обед',
            items: ['soup', 'main', 'salad', 'drink'],
            description: 'Самый сытный вариант'
        },
        {
            id: 2,
            name: 'Классический ланч',
            items: ['soup', 'main', 'drink'],
            description: 'Без салата'
        },
        {
            id: 3,
            name: 'Легкий вариант',
            items: ['soup', 'salad', 'drink'],
            description: 'Без главного блюда'
        },
        {
            id: 4,
            name: 'Основной + салат',
            items: ['main', 'salad', 'drink'],
            description: 'Без супа'
        },
        {
            id: 5,
            name: 'Базовый',
            items: ['main', 'drink'],
            description: 'Минимальный набор'
        }
    ];
    
    // Очищаем и заполняем сетку
    combosGrid.innerHTML = '';
    
    combos.forEach(combo => {
        const comboCard = createComboCard(combo, exampleDishes);
        combosGrid.appendChild(comboCard);
    });
    
    console.log(`Отображено ${combos.length} комбо`);
}

function createComboCard(combo, exampleDishes) {
    const card = document.createElement('div');
    card.className = 'combo-card';
    card.setAttribute('data-combo-id', combo.id);
    
    // Вычисляем примерную стоимость
    let estimatedPrice = 0;
    combo.items.forEach(itemType => {
        if (exampleDishes[itemType]) {
            estimatedPrice += exampleDishes[itemType].price;
        }
    });
    
    // Создаем HTML для карточки комбо
    card.innerHTML = `
        <h4>${combo.name}</h4>
        <div class="combo-items-container">
            ${combo.items.map(itemType => {
                const dish = exampleDishes[itemType];
                if (!dish) return '';
                
                return `
                    <div class="combo-item">
                        <img src="${dish.image}" alt="${dish.name}" 
                             onerror="this.src='images/placeholder.jpg'">
                        <span>${getCategoryName(itemType)}</span>
                    </div>
                `;
            }).join('')}
        </div>
        <p class="combo-description">${combo.description}</p>
        <p class="combo-price">≈ ${estimatedPrice}₽</p>
        <button class="combo-select-btn" data-combo-id="${combo.id}">
            Выбрать этот набор
        </button>
    `;
    
    return card;
}

function getCategoryName(categoryKey) {
    const categoryNames = {
        'soup': 'Суп',
        'main': 'Главное',
        'salad': 'Салат',
        'drink': 'Напиток',
        'dessert': 'Десерт'
    };
    
    return categoryNames[categoryKey] || categoryKey;
}