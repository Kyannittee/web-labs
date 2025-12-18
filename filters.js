
document.addEventListener('DOMContentLoaded', function() {
    // Даем время на загрузку блюд
    setTimeout(() => {
        if (window.dishes) {
            console.log('Фильтры готовы. Блюд загружено:', window.dishes.length);
        }
    }, 1000);
    
    // Обработчик кликов по фильтрам
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const filterBtn = e.target;
            const section = filterBtn.closest('section');
            const category = section.id;
            
            handleFilterClick(filterBtn, category);
        }
    });
});

function handleFilterClick(clickedFilter, category) {
    const filtersContainer = clickedFilter.closest('.filters');
    const allFilterBtns = filtersContainer.querySelectorAll('.filter-btn');
    const dishesGrid = filtersContainer.nextElementSibling;
    
    // Проверяем, была ли кнопка уже активной
    const wasActive = clickedFilter.classList.contains('active');
    
    // Снимаем активный класс со всех кнопок
    allFilterBtns.forEach(btn => btn.classList.remove('active'));
    
    if (!wasActive) {
        // Если не была активной - делаем активной и применяем фильтр
        clickedFilter.classList.add('active');
        const filterKind = clickedFilter.getAttribute('data-kind');
        applyFilter(category, filterKind, dishesGrid);
    } else {
        // Если была активной - снимаем активность и показываем все блюда
        applyFilter(category, 'all', dishesGrid);
    }
}

function applyFilter(category, filterKind, dishesGrid) {
    console.log(`Применяем фильтр: ${category} -> ${filterKind}`);
    
    // Проверяем, загружены ли блюды
    if (!window.dishes || window.dishes.length === 0) {
        console.error('Блюда не загружены для фильтрации');
        dishesGrid.innerHTML = '<p class="no-dishes">Блюда не загружены</p>';
        return;
    }
    
    // Получаем категорию API для этой секции
    let apiCategory = '';
    if (window.CATEGORY_MAP && window.CATEGORY_MAP[category]) {
        apiCategory = window.CATEGORY_MAP[category];
    } else {
        // Fallback на старые названия
        switch(category) {
            case 'soups': apiCategory = 'soup'; break;
            case 'main-dishes': apiCategory = 'main_course'; break;
            case 'drinks': apiCategory = 'drink'; break;
            case 'salads': apiCategory = 'salad'; break;
            case 'desserts': apiCategory = 'dessert'; break;
            default: apiCategory = category;
        }
    }
    
    console.log(`Категория API для ${category}: ${apiCategory}`);
    
    // Получаем все блюда этой категории
    let categoryDishes = window.dishes.filter(dish => dish.category === apiCategory);
    
    console.log(`Найдено блюд в категории: ${categoryDishes.length}`);
    
    // Фильтруем блюда по kind, если фильтр не 'all'
    let filteredDishes = categoryDishes;
    if (filterKind !== 'all') {
        filteredDishes = categoryDishes.filter(dish => dish.kind === filterKind);
        console.log(`После фильтрации по kind=${filterKind}: ${filteredDishes.length} блюд`);
    }
    
    // Сортируем отфильтрованные блюда по алфавиту
    const sortedDishes = filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // Очищаем и обновляем сетку
    dishesGrid.innerHTML = '';
    
    if (sortedDishes.length === 0) {
        dishesGrid.innerHTML = `<p class="no-dishes">Нет блюд по выбранному фильтру</p>`;
        return;
    }
    
    sortedDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        dishesGrid.appendChild(dishCard);
    });
}