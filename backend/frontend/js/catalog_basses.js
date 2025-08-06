document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const guitarGrid = document.querySelector('.bass-grid');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navButtons.classList.toggle('active');
    });

    const API_URL = window.location.hostname.includes('localhost')
        ? 'http://localhost:3000/api/instrumentos'
        : 'https://distortion-production.up.railway.app/api/instrumentos';

    let basses = [];

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            basses = data
                .filter(inst => inst.tipo.toLowerCase() === 'bajo')
                .map(inst => ({
                    _id: inst._id,
                    name: inst.nombre,
                    brand: inst.marca,
                    type: inst.tipo,
                    strings: inst.cuerdas,
                    image: inst.imagen
                }));

            renderBasses(basses);
        })
        .catch(err => {
            console.error('Error cargando instrumentos:', err);
            guitarGrid.innerHTML = '<p>Error al cargar el catálogo.</p>';
        });

    function renderBasses(bassesToRender) {
        guitarGrid.innerHTML = '';
        bassesToRender.forEach(bass => {
            const bassCard = document.createElement('div');
            bassCard.className = 'guitar-card';
            bassCard.innerHTML = `
                <img src="img/productos/${bass.image}" alt="${bass.name}">
                <button class="fav-btn" data-id="${bass._id}" data-name="${bass.name}" aria-label="Añadir a favoritos">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                         class="feather feather-heart">
                         <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 
                         5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
                         1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <div class="guitar-card-content">
                    <h3>${bass.name}</h3>
                    <p>Marca: ${bass.brand}</p>
                    <p>Cuerdas: ${bass.strings}</p>
                    <p>Tipo: ${bass.type}</p>
                </div>
            `;
            bassCard.addEventListener('click', (e) => {
                if (!e.target.closest('.fav-btn')) {
                    window.location.href = `product-details.html?id=${bass._id}`;
                }
            });
            guitarGrid.appendChild(bassCard);
        });
    }

    guitarGrid.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.fav-btn');
        if (favBtn) {
            const id = favBtn.dataset.id;
            const nombre = favBtn.dataset.name;

            const selected = basses.find(b => b._id === id);
            if (!selected) return;

            let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

            if (!favoritos.find(fav => fav.id === id)) {
                favoritos.push({
                    id: selected._id,
                    nombre: selected.name,
                    imagen: `img/productos/${selected.image}`,
                    marca: selected.brand,
                    cuerdas: selected.strings
                });
                localStorage.setItem('favoritos', JSON.stringify(favoritos));
                alert('Añadido a favoritos');
                favBtn.classList.add('active');
            } else {
                alert('Ya está en favoritos');
            }
        }
    });

    function applyFilters() {
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(input => input.value);
        const selectedStrings = Array.from(document.querySelectorAll('input[name="strings"]:checked')).map(input => input.value);
        const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(input => input.value);

        const filteredBasses = basses.filter(bass =>
            (selectedBrands.length === 0 || selectedBrands.includes(bass.brand)) &&
            (selectedStrings.length === 0 || selectedStrings.includes(String(bass.strings))) &&
            (selectedTypes.length === 0 || selectedTypes.includes(bass.type))
        );

        renderBasses(filteredBasses);
    }

    applyFiltersBtn.addEventListener('click', applyFilters);

    const logo = document.querySelector('.logo');
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
