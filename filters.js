document.addEventListener('DOMContentLoaded', function() {
    // Обработчик кликов по фильтрам
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const filterBtn = e.target;
            const section = filterBtn.closest('section');
            const category = section.id;
            
            handleFilterClick(filterBtn, category);
        }
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
        // Получаем все блюда этой категории
        let categoryDishes = [];
        
        switch(category) {
            case 'soups':
                categoryDishes = dishes.filter(dish => dish.category === 'soup');
                break;
            case 'main-dishes':
                categoryDishes = dishes.filter(dish => dish.category === 'main');
                break;
            case 'drinks':
                categoryDishes = dishes.filter(dish => dish.category === 'drink');
                break;
            case 'salads':
                categoryDishes = dishes.filter(dish => dish.category === 'salad');
                break;
            case 'desserts':
                categoryDishes = dishes.filter(dish => dish.category === 'dessert');
                break;
        }
        
        // Фильтруем блюда по kind, если фильтр не 'all'
        let filteredDishes = categoryDishes;
        if (filterKind !== 'all') {
            filteredDishes = categoryDishes.filter(dish => dish.kind === filterKind);
        }
        
        // Сортируем отфильтрованные блюда по алфавиту
        const sortedDishes = filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
        
        // Очищаем и обновляем сетку
        dishesGrid.innerHTML = '';
        sortedDishes.forEach(dish => {
            const dishCard = createDishCard(dish);
            dishesGrid.appendChild(dishCard);
        });
    }
});