const dishes = [
    // Супы
    {
        keyword: "borshch",
        name: "Борщ со сметаной",
        price: 200,
        category: "soup",
        count: "350 мл",
        image: "images/Борщ.jpg",
        kind: "meat"
    },
    {
        keyword: "chicken-soup",
        name: "Куриный суп с лапшой",
        price: 180,
        category: "soup",
        count: "350 мл",
        image: "images/Куриный суп.jpg",
        kind: "meat"
    },
    {
        keyword: "mushroom-cream",
        name: "Грибной крем-суп",
        price: 220,
        category: "soup",
        count: "300 мл",
        image: "images/Грибной крем-суп.jpg",
        kind: "veg"
    },
    {
        keyword: "tom-yam",
        name: "Том Ям с креветками",
        price: 280,
        category: "soup",
        count: "350 мл",
        image: "images/Том Ям.jpg",
        kind: "fish"
    },
    {
        keyword: "fish-soup",
        name: "Уха по-фински",
        price: 320,
        category: "soup",
        count: "350 мл",
        image: "images/Уха.jpg",
        kind: "fish" 
    },
    {
        keyword: "cream-pumpkin",
        name: "Тыквенный крем-суп",
        price: 190,
        category: "soup",
        count: "300 мл",
        image: "images/Тыквенный суп.jpg",
        kind: "veg" 
    },
    
    // Главные блюда
    {
        keyword: "carbonara",
        name: "Паста Карбонара",
        price: 300,
        category: "main",
        count: "350 г",
        image: "images/Карбонара.jpg",
        kind: "meat"
    },
    {
        keyword: "chicken-shashlik",
        name: "Куриный шашлычок",
        price: 350,
        category: "main",
        count: "400 г",
        image: "images/Куриный шашлычок.jpg",
        kind: "meat"
    },
    {
        keyword: "fried-potatoes",
        name: "Жареная картошка с грибами",
        price: 150,
        category: "main",
        count: "380 г",
        image: "images/Картошка.jpg",
        kind: "veg"
    },
    {
        keyword: "beef-stroganoff",
        name: "Бефстроганов с гречневой кашей",
        price: 320,
        category: "main",
        count: "400 г",
        image: "images/Бефстроганов.jpg",
        kind: "meat"
    },
    {
        keyword: "salmon-steak",
        name: "Стейк из лосося",
        price: 450,
        category: "main",
        count: "300 г",
        image: "images/Лосось.jpg",
        kind: "fish" 
    },
    {
        keyword: "vegetable-ragout",
        name: "Овощное рагу",
        price: 280,
        category: "main",
        count: "350 г",
        image: "images/Рагу.jpg",
        kind: "veg" 
    },
    {
        keyword: "seafood-pizza",
        name: "Пицца с морепродуктами",
        price: 300,
        category: "main",
        count: "300 г",
        image: "images/Пицца.jpg",
        kind: "fish" 
    },
    
    // Напитки
    {
        keyword: "orange-juice",
        name: "Свежевыжатый апельсиновый сок",
        price: 150,
        category: "drink",
        count: "300 мл",
        image: "images/Апельсиновый сок.jpg",
        kind: "cold"
    },
    {
        keyword: "cranberry-juice",
        name: "Клюквенный морс",
        price: 120,
        category: "drink",
        count: "330 мл",
        image: "images/Клюквенный морс.jpg",
        kind: "cold"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 180,
        category: "drink",
        count: "250 мл",
        image: "images/Капучино.jpg",
        kind: "hot"
    },
    {
        keyword: "green-tea",
        name: "Зеленый чай с жасмином",
        price: 100,
        category: "drink",
        count: "400 мл",
        image: "images/Зеленый чай.jpg",
        kind: "hot"
    },
    {
        keyword: "lemonade",
        name: "Домашний лимонад",
        price: 130,
        category: "drink",
        count: "400 мл",
        image: "images/Лимонад.jpg",
        kind: "cold" // холодный
    },
    {
        keyword: "black-tea",
        name: "Черный чай с бергамотом",
        price: 110,
        category: "drink",
        count: "400 мл",
        image: "images/Черный чай.jpg",
        kind: "hot" // горячий
    },
    {
        keyword: "cola",
        name: "Кока-кола",
        price: 110,
        category: "drink",
        count: "400 мл",
        image: "images/Кола.jpg",
        kind: "carbonated" // газированный
    },
    {
        keyword: "sprite",
        name: "Спрайт",
        price: 110,
        category: "drink",
        count: "400 мл",
        image: "images/Спрайт.jpg",
        kind: "carbonated" // газированный
    },
    {
        keyword: "fanta",
        name: "Фанта",
        price: 110,
        category: "drink",
        count: "400 мл",
        image: "images/Фанта.jpg",
        kind: "carbonated" // газированный
    },

    // ==================== САЛАТЫ И СТАРТЕРЫ ====================
    {
        keyword: "caesar-salad",
        name: "Салат Цезарь",
        price: 350,
        category: "salad",
        count: "250 г",
        image: "images/Цезарь.jpg",
        kind: "meat" 
    },
    {
        keyword: "greek-salad",
        name: "Греческий салат",
        price: 280,
        category: "salad",
        count: "300 г",
        image: "images/Греческий салат.jpg",
        kind: "veg" 
    },
    {
        keyword: "shrimp-cocktail",
        name: "Коктейль из креветок",
        price: 420,
        category: "salad",
        count: "200 г",
        image: "images/Креветки.jpg",
        kind: "fish" 
    },
    {
        keyword: "caprese",
        name: "Капрезе с моцареллой",
        price: 320,
        category: "salad",
        count: "220 г",
        image: "images/Капрезе.jpg",
        kind: "veg" 
    },
    {
        keyword: "vegetable-salad",
        name: "Свежий овощной салат",
        price: 190,
        category: "salad",
        count: "280 г",
        image: "images/Овощной салат.jpg",
        kind: "veg" 
    },
    {
        keyword: "quinoa-salad",
        name: "Салат с киноа",
        price: 270,
        category: "salad",
        count: "240 г",
        image: "images/Киноа.jpg",
        kind: "veg" 
    },
    {
        keyword: "olivier",
        name: "Оливье",
        price: 220,
        category: "salad",
        count: "240 г",
        image: "images/Оливье.jpg",
        kind: "meat" 
    },
    {
        keyword: "meat-salad",
        name: "Салат из копченой грудинки",
        price: 280,
        category: "salad",
        count: "240 г",
        image: "images/Мясной салат.jpg",
        kind: "meat" 
    },


    // ==================== ДЕСЕРТЫ ====================
    {
        keyword: "tiramisu",
        name: "Тирамису",
        price: 280,
        category: "dessert",
        count: "150 г",
        image: "images/Тирамису.jpg",
        kind: "medium" // средняя порция
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк",
        price: 320,
        category: "dessert",
        count: "180 г",
        image: "images/Чизкейк.jpg",
        kind: "medium" 
    },
    {
        keyword: "chocolate-mousse",
        name: "Шоколадный мусс",
        price: 190,
        category: "dessert",
        count: "120 г",
        image: "images/Мусс.jpg",
        kind: "small" 
    },
    {
        keyword: "potato-cake",
        name: "Пирожное картошка",
        price: 150,
        category: "dessert",
        count: "100 г",
        image: "images/Пирожное.jpg",
        kind: "small" 
    },
    {
        keyword: "ice-cream",
        name: "Мороженое пломбир",
        price: 120,
        category: "dessert",
        count: "100 г",
        image: "images/Мороженое.jpg",
        kind: "small" 
    },
    {
        keyword: "napoleon",
        name: "Торт Наполеон",
        price: 380,
        category: "dessert",
        count: "220 г",
        image: "images/Наполеон.jpg",
        kind: "large" 
    },
    {
        keyword: "cake",
        name: "Ягодный торт",
        price: 1000,
        category: "dessert",
        count: "800 г",
        image: "images/Ягодный торт.jpg",
        kind: "giant" 
    },
    {
        keyword: "milkshake",
        name: "Милшейк",
        price: 2000,
        category: "dessert",
        count: "700 г",
        image: "images/Милкшейк.jpg",
        kind: "giant" 
    },
    {
        keyword: "big-ice-cream",
        name: "Большое шоколадное мороженое",
        price: 1000,
        category: "dessert",
        count: "700 г",
        image: "images/Большое мороженое.jpg",
        kind: "giant" 
    },

];