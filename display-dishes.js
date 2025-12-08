document.addEventListener('DOMContentLoaded', function() {//Чтобы скрипт не пытался работать с элементами, которых еще нет на странице
    // Сортируем блюда по алфавиту
    const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));//функция сравнения
    
    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        drink: sortedDishes.filter(dish => dish.category === 'drink'),
        salad: sortedDishes.filter(dish => dish.category === 'salad'),
        dessert: sortedDishes.filter(dish => dish.category === 'dessert')
    };
    
    // Отображаем блюда в соответствующих секциях
    displayDishesInSection('soups', dishesByCategory.soup);
    displayDishesInSection('main-dishes', dishesByCategory.main);
    displayDishesInSection('drinks', dishesByCategory.drink);
    displayDishesInSection('salads', dishesByCategory.salad);
    displayDishesInSection('desserts', dishesByCategory.dessert);
});

function displayDishesInSection(sectionId, dishesArray) {
    const section = document.getElementById(sectionId);//ищет на странице элемент с указанным ID
    if (!section) return;
    
    const grid = section.querySelector('.dishes-grid');//ищет внутри секции элемент с классом dishes-grid
    if (!grid) return;
    
    // Очищаем сетку
    grid.innerHTML = '';
    
    // Создаем карточки для каждого блюда
    dishesArray.forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);//добавляет атрибут к элементу

    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/placeholder.jpg'">
        <p class="dish-price">${dish.price}₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="dish-weight">${dish.count}</p>
        <button class="add-btn">Добавить</button>
    `;
    
    return card;
}//вставляет изображение блюда если картинка не загрузится, подставит заглушку