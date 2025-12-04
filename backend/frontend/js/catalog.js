// js/catalog.js
import { saveInstruments, getAllInstruments } from './db.js';

const API_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/instrumentos'
  : 'https://distortion-production.up.railway.app/api/instrumentos';

let allGuitars = [];

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const guitarGrid = document.querySelector('.guitar-grid');
  const logo = document.querySelector('.logo');

  // Menú hamburguesa
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks?.classList.toggle('active');
      navButtons?.classList.toggle('active');
    });
  }

  // Scroll suave con el logo
  if (logo) {
    logo.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Carga inicial de guitarras
  loadGuitars(guitarGrid);

  // Aplicar filtros
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      applyFilters(guitarGrid);
    });
  }
});

async function loadGuitars(guitarGrid) {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error en la API');

    const data = await res.json();
    // Guardamos TODO en IndexedDB (guitarras + bajos)
    await saveInstruments(data);

    // Solo guitarras para esta página
    allGuitars = data.filter(item => item.tipo === 'guitarra');
  } catch (err) {
    console.warn('Fallo la red, usando IndexedDB...', err);
    const cached = await getAllInstruments();
    allGuitars = cached.filter(item => item.tipo === 'guitarra');
  }

  renderGuitars(guitarGrid, allGuitars);
}

function renderGuitars(guitarGrid, list) {
  if (!guitarGrid) return;

  guitarGrid.innerHTML = '';

  if (!list || list.length === 0) {
    guitarGrid.innerHTML = '<p>No se encontraron guitarras para mostrar.</p>';
    return;
  }

  list.forEach(guitar => {
    const card = document.createElement('div');
    card.className = 'guitar-card';
    card.dataset.id = guitar._id;

    const imageSrc = `img/productos/${guitar.imagen}`;

    card.innerHTML = `
      <img src="${imageSrc}" alt="${guitar.nombre}">
      <div class="guitar-card-content">
        <h3>${guitar.nombre}</h3>
        <p>Marca: ${guitar.marca}</p>
        <p>Cuerdas: ${guitar.cuerdas}</p>
        <p>Tipo: ${guitar.tipo}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `product-details.html?id=${guitar._id}`;
    });

    guitarGrid.appendChild(card);
  });
}

function applyFilters(guitarGrid) {
  const brandInputs = document.querySelectorAll('input[name="brand"]:checked');
  const stringInputs = document.querySelectorAll('input[name="strings"]:checked');
  const typeInputs = document.querySelectorAll('input[name="type"]:checked');

  const selectedBrands = Array.from(brandInputs).map(i => i.value.toLowerCase());
  const selectedStrings = Array.from(stringInputs).map(i => i.value);
  const selectedTypes = Array.from(typeInputs).map(i => i.value.toLowerCase());

  const filtered = allGuitars.filter(guitar => {
    const marcaOk =
      selectedBrands.length === 0 ||
      selectedBrands.includes(String(guitar.marca).toLowerCase());

    const cuerdasOk =
      selectedStrings.length === 0 ||
      selectedStrings.includes(String(guitar.cuerdas));

    // Ojo: tu esquema no tiene "signature/standard", solo tipo "guitarra/bajo".
    // De momento este filtro solo aplicaría si algún día agregas otro campo.
    const tipoOk =
      selectedTypes.length === 0 ||
      selectedTypes.includes(String(guitar.tipo).toLowerCase());

    return marcaOk && cuerdasOk && tipoOk;
  });

  renderGuitars(guitarGrid, filtered);
}
