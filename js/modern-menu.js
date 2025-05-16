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
    
    // Добавляем класс glass к меню при загрузке страницы для немедленного применения эффекта
    if (menu) {
        menu.classList.add('glass');
    }
    
    // Обеспечиваем правильное положение меню при загрузке страницы
    function updateMenuPosition() {
        if (!menu) return;
        
        const menuHeight = menu.offsetHeight;
        document.body.style.paddingTop = menuHeight + 'px';
        
        // Явно устанавливаем стили для меню, чтобы оно не пропадало
        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.zIndex = '9999';
        menu.style.display = 'block';
    }
    
    // Оптимизация обновления позиции меню с помощью debounce
    let menuUpdateTimeout;
    function debouncedUpdateMenuPosition() {
        clearTimeout(menuUpdateTimeout);
        menuUpdateTimeout = setTimeout(updateMenuPosition, 100);
    }
    
    // Вызываем функцию при загрузке
    updateMenuPosition();
    
    // Активация прозрачного меню при прокрутке с плавным переходом
    // Оптимизируем обработку события scroll с помощью requestAnimationFrame
    let lastKnownScrollPosition = 0;
    let ticking = false;
    
    function handleMenuOnScroll(scrollPos) {
        if (!menu) return;
        
        // Проверяем видимость меню и принудительно отображаем его
        if (menu.style.display !== 'block') {
            menu.style.display = 'block';
        }
        
        if (scrollPos > 50) {
            menu.classList.add('glass', 'menu-shrink');
        } else {
            if (scrollPos <= 5) {
                menu.classList.remove('menu-shrink');
            }
        }
        
        // Показываем кнопку "Наверх" при прокрутке вниз
        if (backToTop) {
            if (scrollPos > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }
    
    window.addEventListener('scroll', function() {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleMenuOnScroll(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Обновляем отступ при изменении размера окна
    window.addEventListener('resize', debouncedUpdateMenuPosition);
    
    // Обработка мобильного меню с улучшенной анимацией
    if (menuToggle) {
        // Используем делегирование событий
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем скролл на мобильных устройствах
            toggleMobileMenu();
        });
    }
    
    function toggleMobileMenu() {
        if (!menuToggle || !menuNav || !menuOverlay) return;
        
        const isActive = menuToggle.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        menuToggle.classList.add('active');
        menuNav.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden'; // Блокировка скролла
        
        // Анимируем появление пунктов меню
        const menuItems = document.querySelectorAll('.menu-nav .menu-item');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = 1;
                item.style.transform = 'translateX(0)';
            }, 50 * index);
        });
    }
    
    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        menuNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; // Разблокировка скролла
        
        // Сбрасываем стили анимации пунктов меню
        const menuItems = document.querySelectorAll('.menu-nav .menu-item');
        menuItems.forEach(item => {
            item.style.opacity = '';
            item.style.transform = '';
        });
    }
    
    // Закрытие мобильного меню при клике вне его
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Закрытие меню при клике на пункт меню на мобильных
    if (window.innerWidth <= 992) {
        const menuLinks = document.querySelectorAll('.menu-link:not(.has-dropdown)');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
    
    // Улучшенная обработка поисковой панели
    if (searchBtn && searchPanel && searchClose) {
        searchBtn.addEventListener('click', function() {
            searchPanel.classList.add('active');
            setTimeout(() => {
                document.querySelector('.search-input').focus();
            }, 300);
        });
        
        searchClose.addEventListener('click', function() {
            searchPanel.classList.remove('active');
        });
        
        // Закрытие поиска по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchPanel.classList.contains('active')) {
                searchPanel.classList.remove('active');
            }
        });
    }
    
    // Обработка выпадающих меню на мобильных устройствах
    if (dropdownItems.length > 0) {
        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.menu-link');
            
            if (link) {
                link.addEventListener('click', function(e) {
                    // Только для мобильных устройств
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        
                        // Плавное появление/исчезновение подменю
                        const dropdown = this.nextElementSibling;
                        if (dropdown && dropdown.classList.contains('menu-dropdown')) {
                            if (item.classList.contains('active')) {
                                // Закрываем меню с анимацией
                                dropdown.style.maxHeight = '0px';
                                setTimeout(() => {
                                    item.classList.remove('active');
                                }, 300);
                            } else {
                                // Открываем меню с анимацией
                                item.classList.add('active');
                                dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
                            }
                        }
                    }
                });
            }
        });
    }
    
    // Обработка кнопки "Наверх" с плавным скроллом
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Анимация подчеркивания при наведении на пункты меню
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
    
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
                
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация появления выпадающих меню
    const desktopDropdowns = document.querySelectorAll('.menu-dropdown');
    desktopDropdowns.forEach(dropdown => {
        dropdown.classList.add('dropdown-animation');
    });
    
    // Определение текущей страницы и активация соответствующего пункта меню
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-link');
        
        menuItems.forEach(item => {
            const itemPath = item.getAttribute('href');
            if (itemPath && (currentPath.endsWith(itemPath) || currentPath.includes(itemPath) && itemPath !== '/')) {
                item.parentElement.classList.add('active');
                
                // Если пункт меню находится в выпадающем списке, активируем родительский пункт
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
    
    // Устанавливаем активный пункт меню с небольшой задержкой для учета анимации страницы
    setTimeout(setActiveMenuItem, 100);
    
    // Инициализация начального состояния для мобильных устройств
    if (window.innerWidth <= 992) {
        // Устанавливаем начальное состояние для пунктов мобильного меню
        const menuItems = document.querySelectorAll('.menu-nav .menu-item');
        menuItems.forEach(item => {
            item.style.opacity = 0;
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }
    
    // Дополнительная проверка фиксации меню после полной загрузки страницы
    window.addEventListener('load', function() {
        updateMenuPosition();
    });
}); 