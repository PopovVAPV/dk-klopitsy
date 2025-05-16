document.addEventListener('DOMContentLoaded', function() {
    // Функция для дополнительной проверки и фиксации меню
    function ensureMenuFixed() {
        const menu = document.querySelector('.modern-menu');
        if (!menu) return;
        
        // Принудительно устанавливаем стили
        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.zIndex = '9999';
        menu.style.display = 'block';
        
        // Обновляем отступ body
        const menuHeight = menu.offsetHeight;
        document.body.style.paddingTop = menuHeight + 'px';
    }
    
    // Оптимизированный вызов функции с debounce для улучшения производительности
    let menuFixedTimeout;
    function debouncedMenuFixed() {
        clearTimeout(menuFixedTimeout);
        menuFixedTimeout = setTimeout(ensureMenuFixed, 100);
    }
    
    // Вызываем функцию сразу
    ensureMenuFixed();
    
    // Вызываем с небольшой задержкой после загрузки DOM
    setTimeout(ensureMenuFixed, 100);
    
    // Оптимизированная обработка события resize
    window.addEventListener('resize', debouncedMenuFixed);
    
    // Вызываем после полной загрузки страницы
    window.addEventListener('load', ensureMenuFixed);

    // Добавляем класс для плавного появления страницы
    document.body.classList.add('fade-in-page');
    
    // Показ/скрытие лоадера страницы
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        window.addEventListener('load', function() {
            pageLoader.style.opacity = '0';
            setTimeout(function() {
                pageLoader.style.visibility = 'hidden';
            }, 300);
        });
    }

    // Инициализация Swiper слайдера для мероприятий
    if (document.querySelector('.swiper-container')) {
        const eventsSwiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            breakpoints: {
                // при ширине окна >= 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                // при ширине окна >= 992px
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            // Оптимизация для мобильных устройств
            preloadImages: false,
            lazy: true, // ленивая загрузка
            watchSlidesProgress: true
        });
    }

    // Оптимизированная анимация с определением видимости
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-slide-left, .animate-slide-right');
    
    // Оптимизированная анимация с IntersectionObserver вместо scroll event
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Отключаем наблюдение после применения анимации
                    animateObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
        
        animatedElements.forEach(el => {
            animateObserver.observe(el);
        });
    } else {
        // Фолбэк для старых браузеров
        const animateOnScroll = function() {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('in-view');
                }
            });
        };
        
        // Оптимизированный слушатель прокрутки с троттлингом
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    animateOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        animateOnScroll(); // Запускаем один раз при загрузке страницы
    }
    
    // Анимация для счетчиков с использованием IntersectionObserver
    const counters = document.querySelectorAll('.counter-value');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    counter.textContent = '0';
                    
                    const updateCounter = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.textContent;
                        
                        const increment = target / 200;
                        
                        if (count < target) {
                            counter.textContent = `${Math.ceil(count + increment)}`;
                            setTimeout(updateCounter, 10);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Активация выпадающих меню Bootstrap
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Добавление класса к навигационной панели при прокрутке
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Добавление класса active для текущего пункта меню
    const currentLocation = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-item');

    menuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) {
            const linkPath = link.getAttribute('href');
            
            if (linkPath && (
                currentLocation.endsWith(linkPath) || 
                (linkPath !== 'index.html' && currentLocation.includes(linkPath))
            )) {
                item.classList.add('active');
            }
        }
    });

    // Валидация форм с обратной связью
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formInputs = form.querySelectorAll('input, textarea');
            
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // Показываем уведомление об успешной отправке
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success mt-3 animate-fade-in';
                successAlert.textContent = 'Спасибо! Ваше сообщение отправлено.';
                
                form.appendChild(successAlert);
                form.reset();
                
                // Удаляем уведомление через 3 секунды
                setTimeout(() => {
                    successAlert.classList.add('fade-out');
                    setTimeout(() => {
                        successAlert.remove();
                    }, 300);
                }, 3000);
            }
        });
    });

    // Инициализация скрипта lightbox для галереи изображений
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!document.querySelector('.lightbox')) {
                e.preventDefault();
                
                const imgSrc = this.getAttribute('href') || this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt') || 'Изображение';
                
                // Создаем лайтбокс
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${imgSrc}" alt="${imgAlt}" class="lightbox-image">
                        <button class="lightbox-close">&times;</button>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                // Анимация появления
                setTimeout(() => {
                    lightbox.classList.add('active');
                }, 10);
                
                // Добавляем обработчик для закрытия
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                        lightbox.classList.remove('active');
                        setTimeout(() => {
                            lightbox.remove();
                            document.body.style.overflow = '';
                        }, 300);
                    }
                });
            }
        });
    });

    // Ленивая загрузка изображений с использованием современных подходов
    function setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Используем нативную ленивую загрузку
            const lazyImages = document.querySelectorAll('img[data-src]:not([loading="lazy"])');
            lazyImages.forEach(img => {
                img.setAttribute('loading', 'lazy');
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                // Добавляем класс для анимации появления
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            });
        } else {
            // Имплементация ленивой загрузки через Intersection Observer
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                            if (lazyImage.dataset.srcset) {
                                lazyImage.srcset = lazyImage.dataset.srcset;
                            }
                            lazyImage.classList.add('loaded');
                            observer.unobserve(lazyImage);
                        }
                    }
                });
            }, { 
                rootMargin: '200px 0px', // Загружаем немного заранее
                threshold: 0.01 
            });
            
            const lazyImages = document.querySelectorAll('img[data-src], .fade-in-image');
            lazyImages.forEach(image => {
                lazyImageObserver.observe(image);
            });
        }
    }
    
    // Инициализация ленивой загрузки
    setupLazyLoading();

    // Оптимизация загрузки изображений для разных размеров экрана
    function setupResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            // Если изображение уже имеет атрибут srcset, пропускаем его
            if (img.hasAttribute('srcset')) return;
            
            const src = img.src || img.dataset.src;
            if (!src) return;
            
            // Получаем расширение файла
            const extension = src.split('.').pop();
            
            // Если изображение без расширения или это заполнитель, пропускаем
            if (!extension || src.includes('placeholder')) return;
            
            // Создаем различные размеры изображений (это примерная логика, нужна реальная обработка изображений)
            // Для этого нужны заранее подготовленные изображения разных размеров
            const basePath = src.substring(0, src.lastIndexOf('.'));
            
            // Добавляем атрибут sizes для оптимального выбора размера
            img.sizes = '(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw';
            
            // Если у изображения есть атрибут data-responsive="false", пропускаем его
            if (img.dataset.responsive === 'false') return;
            
            // Устанавливаем decoding async для нестатичных изображений
            if (!img.hasAttribute('decoding')) {
                img.decoding = 'async';
            }
            
            // Добавляем loading="lazy" для всех изображений, если еще не установлено
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
            }
        });
    }
    
    // Вызываем функцию настройки отзывчивых изображений
    setupResponsiveImages();

    // Оптимизация отзывчивости элементов на касание для мобильных устройств
    function enhanceTouchInteractions() {
        // Улучшаем сенсорное взаимодействие с кнопками
        const touchTargets = document.querySelectorAll('button, a, .btn, .nav-link, .menu-link, .dropdown-item');
        
        touchTargets.forEach(target => {
            // Добавляем стилизацию для активного состояния на тач-устройствах
            target.addEventListener('touchstart', function() {
                this.setAttribute('data-touch-active', 'true');
            }, { passive: true });
            
            target.addEventListener('touchend', function() {
                this.removeAttribute('data-touch-active');
            }, { passive: true });
            
            // Убираем 300мс задержку на мобильных
            target.style.touchAction = 'manipulation';
        });
        
        // Улучшаем скроллинг на iOS
        document.querySelectorAll('.menu-nav, .overflow-auto, .overflow-scroll').forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }
    
    // Применяем улучшения для тач-взаимодействий
    enhanceTouchInteractions();
    
    // Оптимизируем производительность при прокрутке страницы
    function optimizePageScroll() {
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            // Добавляем класс для оптимизации во время прокрутки
            document.body.classList.add('is-scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                document.body.classList.remove('is-scrolling');
            }, 100);
        }, { passive: true }); // passive: true для улучшения производительности
    }
    
    // Применяем оптимизации для прокрутки
    optimizePageScroll();

    // Оптимизированный обработчик resize для адаптивности
    let resizeTimeout;
    const handleWindowResize = () => {
        // Обновление элементов при изменении размера окна
        document.querySelectorAll('.equal-height').forEach(container => {
            const cards = container.querySelectorAll('.card');
            // Сброс высоты карточек
            cards.forEach(card => card.style.height = '');
            
            // Установка одинаковой высоты только на планшетах и настольных компьютерах
            if (window.innerWidth >= 768) {
                // Отложенное выполнение для лучшей производительности
                setTimeout(() => {
                    let maxHeight = 0;
                    cards.forEach(card => {
                        maxHeight = Math.max(maxHeight, card.offsetHeight);
                    });
                    cards.forEach(card => {
                        card.style.height = maxHeight + 'px';
                    });
                }, 100);
            }
        });
    };
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleWindowResize, 250);
    });
    
    // Вызываем один раз при загрузке
    window.addEventListener('load', handleWindowResize);

    // Добавляем плавные переходы между страницами
    const internalLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    internalLinks.forEach(link => {
        // Проверяем, что ссылка ведет на нашем сайте
        const href = link.getAttribute('href');
        if (href && (href.startsWith(window.location.origin) || href.startsWith('/') || !href.startsWith('http'))) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                // Анимация ухода со страницы
                document.body.classList.add('fade-out-page');
                
                // Переход на новую страницу после анимации
                setTimeout(() => {
                    window.location.href = target;
                }, 300);
            });
        }
    });
}); 