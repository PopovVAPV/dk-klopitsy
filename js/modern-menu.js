// JavaScript для современного меню ДК "Клопицы"

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы меню
    const menu = document.querySelector('.modern-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNav = document.querySelector('.menu-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const searchBtn = document.querySelector('.menu-search-btn');
    const searchPanel = document.querySelector('.search-panel');
    const searchClose = document.querySelector('.search-close');
    const dropdownItems = document.querySelectorAll('.menu-item.has-dropdown');
    const backToTop = document.querySelector('.back-to-top');
    
    // Принудительно фиксируем меню при загрузке
    if (menu) {
        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.zIndex = '9999';
        menu.style.display = 'block';
    }
    
    // Добавляем класс glass к меню при загрузке страницы
    menu.classList.add('glass');
    
    // Обеспечиваем правильное положение меню при загрузке страницы
    function updateMenuPosition() {
        if (!menu) return;
        
        const menuHeight = menu.offsetHeight;
        document.body.style.paddingTop = menuHeight + 'px';
        
        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.zIndex = '9999';
        menu.style.display = 'block';
    }
    
    // Вызываем функцию при загрузке
    updateMenuPosition();
    
    // Активация прозрачного меню при прокрутке
    window.addEventListener('scroll', function() {
        if (!menu) return;
        
        if (menu.style.display !== 'block') {
            menu.style.display = 'block';
        }
        
        if (window.scrollY > 50) {
            menu.classList.add('glass', 'menu-shrink');
        } else {
            if (window.scrollY <= 5) {
                menu.classList.remove('menu-shrink');
            }
        }
        
        // Показываем кнопку "Наверх" при прокрутке вниз
        if (window.scrollY > 300) {
            if (backToTop) backToTop.classList.add('visible');
        } else {
            if (backToTop) backToTop.classList.remove('visible');
        }
    });
    
    // Обновляем отступ при изменении размера окна
    window.addEventListener('resize', function() {
        updateMenuPosition();
    });
    
    // Улучшенная обработка мобильного меню
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            menuNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Анимируем появление пунктов меню
            if (menuNav.classList.contains('active')) {
                const menuItems = document.querySelectorAll('.menu-nav .menu-item');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, 50 * index);
                });
            } else {
                const menuItems = document.querySelectorAll('.menu-nav .menu-item');
                menuItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
    
    // Закрытие мобильного меню при клике вне его
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            menuNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            const menuItems = document.querySelectorAll('.menu-nav .menu-item');
            menuItems.forEach(item => {
                item.classList.remove('active');
            });
        });
    }
    
    // Улучшенная обработка выпадающих меню на мобильных устройствах
    if (dropdownItems.length > 0) {
        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.menu-link');
            
            if (link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        
                        const dropdown = this.nextElementSibling;
                        if (dropdown && dropdown.classList.contains('menu-dropdown')) {
                            const isActive = item.classList.contains('active');
                            
                            // Закрываем все другие выпадающие меню
                            dropdownItems.forEach(otherItem => {
                                if (otherItem !== item) {
                                    otherItem.classList.remove('active');
                                    const otherDropdown = otherItem.querySelector('.menu-dropdown');
                                    if (otherDropdown) {
                                        otherDropdown.style.display = 'none';
                                    }
                                }
                            });
                            
                            // Переключаем текущее меню
                            if (isActive) {
                                item.classList.remove('active');
                                dropdown.style.display = 'none';
                            } else {
                                item.classList.add('active');
                                dropdown.style.display = 'block';
                            }
                        }
                    }
                });
            }
        });
    }
    
    // Обработка кнопки "Наверх"
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                
                // Закрываем мобильное меню при клике по якорю
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    menuNav.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                const targetElement = document.querySelector(targetId);
                const headerOffset = menu.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Определение текущей страницы и активация соответствующего пункта меню
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-link');
        
        menuItems.forEach(item => {
            const itemPath = item.getAttribute('href');
            if (itemPath && (currentPath.endsWith(itemPath) || currentPath.includes(itemPath) && itemPath !== '/')) {
                item.parentElement.classList.add('active');
                
                const parentDropdown = item.closest('.menu-dropdown');
                if (parentDropdown) {
                    const parentItem = parentDropdown.parentElement;
                    if (parentItem) {
                        parentItem.classList.add('active');
                    }
                }
            }
        });
    }
    
    // Устанавливаем активный пункт меню
    setTimeout(setActiveMenuItem, 100);
    
    // Инициализация начального состояния для мобильных устройств
    if (window.innerWidth <= 992) {
        const menuItems = document.querySelectorAll('.menu-nav .menu-item');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
    }
}); 