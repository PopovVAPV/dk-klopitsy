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
    
    // Вызываем функцию сразу
    ensureMenuFixed();
    
    // Вызываем с небольшой задержкой после загрузки DOM
    setTimeout(ensureMenuFixed, 100);
    
    // Вызываем после полной загрузки страницы
    window.addEventListener('load', ensureMenuFixed);
    
    // Вызываем при изменении размера окна
    window.addEventListener('resize', ensureMenuFixed);

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
            }
        });
    }

    // Анимация для элементов при прокрутке (без библиотеки AOS)
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-slide-left, .animate-slide-right');
    
    const animateOnScroll = function() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('in-view');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запускаем один раз при загрузке страницы
    
    // Анимация для счетчиков
    const counters = document.querySelectorAll('.counter-value');
    
    counters.forEach(counter => {
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
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });

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

    // Функция для отложенной загрузки изображений
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Запасной вариант для браузеров, которые не поддерживают IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
        });
    }
    
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