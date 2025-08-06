document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navButtons.classList.toggle('active');
    });

    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    let currentSlide = 0;

    function showSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
    nextButton.addEventListener('click', () => showSlide(currentSlide + 1));

    // Auto-advance slides every 5 seconds
    setInterval(() => showSlide(currentSlide + 1), 5000);

    // Add event listeners to buttons within each slide
    slides.forEach((slide, index) => {
        const catalogButton = slide.querySelector('.catalog-button');
        const productButton = slide.querySelector('.product-button');

        if (catalogButton) {
            catalogButton.addEventListener('click', () => {
                window.location.href = 'catalog_basses.html'; // Cambia esta URL por la del catálogo real
            });
        }

        if (productButton) {
            productButton.addEventListener('click', () => {
                window.location.href = '/productos/product-details.html?id=2'; // Cambia esta URL por la del producto específico
            });
        }
    });
});