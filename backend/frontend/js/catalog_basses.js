// js/catalog_basses.js
import { saveInstruments, getAllInstruments } from './db.js';

const API_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/api/instrumentos'
  : 'https://distortion-production.up.railway.app/api/instrumentos';

let allBasses = [];

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const bassGrid = document.querySelector('.bass-grid');
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

  // Carga inicial de bajos
  loadBasses(bassGrid);

  // Aplicar filtros
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      applyFilters(bassGrid);
    });
  }
});

async function loadBasses(bassGrid) {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error en la API');

    const data = await res.json();
    // Guardamos TODO en IndexedDB
    await saveInstruments(data);

    // Solo bajos para esta página
    allBasses = data.filter(item => item.tipo === 'bajo');
  } catch (err) {
    console.warn('Fallo la red, usando IndexedDB...', err);
    const cached = await getAllInstruments();
    allBasses = cached.filter(item => item.tipo === 'bajo');
  }

  renderBasses(bassGrid, allBasses);
}

function renderBasses(bassGrid, list) {
  if (!bassGrid) return;

  bassGrid.innerHTML = '';

  if (!list || list.length === 0) {
    bassGrid.innerHTML = '<p>No se encontraron bajos para mostrar.</p>';
    return;
  }

  list.forEach(bass => {
    const card = document.createElement('div');
    card.className = 'guitar-card'; // reutilizas el estilo
    card.dataset.id = bass._id;

    const imageSrc = `img/productos/${bass.imagen}`;

    card.innerHTML = `
      <img src="${imageSrc}" alt="${bass.nombre}">
      <div class="guitar-card-content">
        <h3>${bass.nombre}</h3>
        <p>Marca: ${bass.marca}</p>
        <p>Cuerdas: ${bass.cuerdas}</p>
        <p>Tipo: ${bass.tipo}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `product-details.html?id=${bass._id}`;
    });

    bassGrid.appendChild(card);
  });
}

function applyFilters(bassGrid) {
  const brandInputs = document.querySelectorAll('input[name="brand"]:checked');
  const stringInputs = document.querySelectorAll('input[name="strings"]:checked');
  const typeInputs = document.querySelectorAll('input[name="type"]:checked');

  const selectedBrands = Array.from(brandInputs).map(i => i.value.toLowerCase());
  const selectedStrings = Array.from(stringInputs).map(i => i.value);
  const selectedTypes = Array.from(typeInputs).map(i => i.value.toLowerCase());

  const filtered = allBasses.filter(bass => {
    const marcaOk =
      selectedBrands.length === 0 ||
      selectedBrands.includes(String(bass.marca).toLowerCase());

    const cuerdasOk =
      selectedStrings.length === 0 ||
      selectedStrings.includes(String(bass.cuerdas));

    const tipoOk =
      selectedTypes.length === 0 ||
      selectedTypes.includes(String(bass.tipo).toLowerCase());

    return marcaOk && cuerdasOk && tipoOk;
  });

  renderBasses(bassGrid, filtered);
}
