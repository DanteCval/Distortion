// Cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    // Menu hamburguesa
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navButtons.classList.toggle('active');
    });

    // Elementos del slider
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    let currentSlide = 0;

    // Función para cambiar de slide
    function showSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Botones de navegación del slider
    prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton.addEventListener('click', () => showSlide(currentSlide + 1));

    // Avanza automáticamente cada 5 segundos
    setInterval(() => showSlide(currentSlide + 1), 5000);

    // Agrega eventos a los botones dentro de cada slide
    slides.forEach((slide, index) => {
        const catalogButton = slide.querySelector('.catalog-button');
        const productButton = slide.querySelector('.product-button');

        if (catalogButton) {
            catalogButton.addEventListener('click', () => {
                window.location.href = 'catalog_guitars.html';
            });
        }

        if (productButton) {
            productButton.addEventListener('click', () => {
                window.location.href = '/productos/product-details.html?id=2';
            });
        }
    });
});