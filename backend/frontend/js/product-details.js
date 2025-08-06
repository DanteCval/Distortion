const container = document.getElementById('product-details');
const API_URL = 'http://localhost:3000/api/instrumentos';

// Extrae el ID del producto desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  container.innerHTML = '<p>Error: No se especificó el instrumento.</p>';
} else {
  fetch(`${API_URL}/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo obtener el instrumento.');
      }
      return response.json();
    })
    .then(data => {
      container.innerHTML = `
        <section class="product-info">
          <img src="img/productos/${data.imagen}" alt="${data.nombre}">
          <div class="info">
            <h2>${data.nombre}</h2>
            <p><strong>Tipo:</strong> ${data.tipo}</p>
            <p><strong>Marca:</strong> ${data.marca}</p>
            <p><strong>Número de cuerdas:</strong> ${data.cuerdas}</p>
            <p><strong>Precio:</strong> $${data.precio}</p>
            <p>${data.descripcion}</p>
          </div>
        </section>
      `;
    })
    .catch(err => {
      container.innerHTML = `<p>Error al cargar el instrumento: ${err.message}</p>`;
    });
}

