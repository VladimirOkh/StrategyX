// ===== ОСНОВНОЙ СКРИПТ ЛЕНДИНГА =====

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initSmoothScroll();
    initFormHandling();
    initAnimationsOnScroll();
    initDashboardAnimations();
    initHeroStats();
});

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== ОБРАБОТКА ФОРМ =====
function initFormHandling() {
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const email = this.querySelector('input[type="email"]').value;
            const teamSize = this.querySelector('select').value;

            if (!email || !teamSize) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }

            // Здесь будет интеграция с backend
            submitLeadForm(email, teamSize);
        });
    }
}

async function submitLeadForm(email, teamSize) {
    const button = document.querySelector('#signup-form button');
    const originalText = button.textContent;

    button.textContent = 'Отправляем...';
    button.disabled = true;

    try {
        // Симуляция отправки данных
        await new Promise(resolve => setTimeout(resolve, 2000));

        // В реальном проекте здесь будет вызов API
        // const response = await fetch('/api/leads', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, teamSize })
        // });

        showNotification('Спасибо! Мы свяжемся с вами в течение часа', 'success');

        // Очищаем форму
        document.getElementById('signup-form').reset();

        // Отправляем событие в аналитику
        trackEvent('lead_generated', { email, teamSize });

    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showNotification('Произошла ошибка. Попробуйте позже', 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 100);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => hideNotification(notification), 5000);

    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initAnimationsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Специальная обработка для карточек с задержкой
                if (entry.target.classList.contains('stagger-animation')) {
                    animateStaggeredChildren(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Добавляем наблюдение за элементами
    const animatedElements = document.querySelectorAll(`
        .problem-stat,
        .pain-point,
        .step,
        .feature-card,
        .pricing-card
    `);

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function animateStaggeredChildren(container) {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate-in');
        }, index * 100);
    });
}

// ===== АНИМАЦИИ ДАШБОРДА =====
function initDashboardAnimations() {
    const dashboard = document.querySelector('.dashboard-mockup');
    if (!dashboard) return;

    // Анимация появления метрик
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateDashboardMetrics();
                animateChartBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(dashboard);
}

function animateDashboardMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');

    metricValues.forEach(metric => {
        const finalValue = metric.textContent;
        const isPercentage = finalValue.includes('%');
        const numericValue = parseFloat(finalValue);

        animateNumber(metric, 0, numericValue, isPercentage ? '%' : '', 1500);
    });
}

function animateNumber(element, start, end, suffix = '', duration = 1000) {
    const startTime = Date.now();
    const range = end - start;

    function update() {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = start + (range * easeOutCubic(progress));

        element.textContent = Math.round(current) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateChartBars() {
    const bars = document.querySelectorAll('.bar');

    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'growBar 1s ease-out forwards';
        }, index * 200);
    });
}

// ===== АНИМАЦИЯ СТАТИСТИКИ В HERO =====
function initHeroStats() {
    const heroStats = document.querySelectorAll('.hero .stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const text = stat.textContent;
                const value = parseFloat(text);
                const suffix = text.replace(value.toString(), '');

                animateNumber(stat, 0, value, suffix, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    heroStats.forEach(stat => observer.observe(stat));
}

// ===== ОТСЛЕЖИВАНИЕ СОБЫТИЙ =====
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }

    // Яндекс.Метрика
    if (typeof ym !== 'undefined') {
        ym(YANDEX_METRIKA_ID, 'reachGoal', eventName, properties);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }

    console.log('Event tracked:', eventName, properties);
}

// ===== УТИЛИТЫ =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);

    // Отправка ошибок в систему мониторинга
    if (typeof trackEvent === 'function') {
        trackEvent('javascript_error', {
            message: e.error.message,
            filename: e.filename,
            lineno: e.lineno
        });
    }
});

// ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ДЛЯ АНИМАЦИЙ =====
const additionalStyles = `
<style>
/* Стили для уведомлений */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 4px solid #2563eb;
}

.notification-success .notification-content {
    border-left-color: #10b981;
}

.notification-error .notification-content {
    border-left-color: #ef4444;
}

.notification-warning .notification-content {
    border-left-color: #f59e0b;
}

.notification-message {
    flex: 1;
    color: #374151;
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    font-size: 20px;
    color: #9ca3af;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    color: #6b7280;
}

/* Анимации появления элементов */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Улучшения для мобильных устройств */
@media (max-width: 768px) {
    .notification {
        left: 20px;
        right: 20px;
        max-width: none;
        transform: translateY(-100px);
    }

    .notification.show {
        transform: translateY(0);
    }
}
</style>
`;

// Добавляем дополнительные стили в head
document.head.insertAdjacentHTML('beforeend', additionalStyles);