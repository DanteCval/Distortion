document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const guitarGrid = document.querySelector('.guitar-grid');
  const logo = document.querySelector('.logo');

  const API_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api/instrumentos'
    : 'https://distortion-production.up.railway.app/api/instrumentos';

  let guitars = [];

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navButtons.classList.toggle('active');
  });

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      guitars = data
        .filter(inst => inst.tipo.toLowerCase() === 'guitarra')
        .map(inst => ({
          _id: inst._id,
          name: inst.nombre,
          brand: inst.marca,
          type: inst.tipo,
          strings: inst.cuerdas,
          image: inst.imagen
        }));
      renderGuitars(guitars);
    })
    .catch(err => {
      console.error('Error cargando instrumentos:', err);
      guitarGrid.innerHTML = '<p>Error al cargar el catálogo.</p>';
    });

  function renderGuitars(guitarsToRender) {
    guitarGrid.innerHTML = '';
    guitarsToRender.forEach(guitar => {
      const guitarCard = document.createElement('div');
      guitarCard.className = 'guitar-card';
      guitarCard.dataset.id = guitar._id;

      guitarCard.innerHTML = `
        <img src="img/productos/${guitar.image}" alt="${guitar.name}">
        <button class="fav-btn" data-id="${guitar._id}" data-name="${guitar.name}" aria-label="Añadir a favoritos">
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
          <h3>${guitar.name}</h3>
          <p>Marca: ${guitar.brand}</p>
          <p>Cuerdas: ${guitar.strings}</p>
          <p>Tipo: ${guitar.type}</p>
        </div>
      `;

      guitarCard.addEventListener('click', (e) => {
        if (!e.target.closest('.fav-btn')) {
          window.location.href = `product-details.html?id=${guitar._id}`;
        }
      });

      guitarGrid.appendChild(guitarCard);
    });
  }

  guitarGrid.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (favBtn) {
      const id = favBtn.dataset.id;
      const selected = guitars.find(g => g._id === id);
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

    const filteredGuitars = guitars.filter(guitar =>
      (selectedBrands.length === 0 || selectedBrands.includes(guitar.brand)) &&
      (selectedStrings.length === 0 || selectedStrings.includes(String(guitar.strings))) &&
      (selectedTypes.length === 0 || selectedTypes.includes(guitar.type))
    );

    renderGuitars(filteredGuitars);
  }

  applyFiltersBtn.addEventListener('click', applyFilters);
});
