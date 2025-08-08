// Espera a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3000/api/instrumentos';
  const form = document.getElementById('instrumentForm');
  const lista = document.getElementById('instrumentContainer');

  // Función para obtener y mostrar todos los instrumentos
  function cargarInstrumentos() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Limpia la lista
        lista.innerHTML = '';
        // Crea una tarjeta para cada instrumento
        data.forEach(inst => {
          const div = document.createElement('div');
          div.className = 'admin-card';
          div.innerHTML = `
            <div>
              <strong>${inst.nombre}</strong> (${inst.tipo}) - ${inst.marca} - ${inst.cuerdas} cuerdas
            </div>
            <button class="delete-btn" data-id="${inst._id}">Eliminar</button>
          `;
          lista.appendChild(div);
        });
      })
      .catch(err => {
        // Muestra error si no se pueden cargar
        lista.innerHTML = '<p>Error al cargar instrumentos.</p>';
        console.error(err);
      });
  }

  // Maneja el envío del formulario para agregar instrumentos
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtiene los datos del formulario
    const nuevoInstrumento = {
      nombre: form.nombre.value.trim(),
      tipo: form.tipo.value.trim().toLowerCase(), // "guitarra" o "bajo"
      marca: form.marca.value.trim(),
      cuerdas: Number(form.cuerdas.value),
      descripcion: form.descripcion.value.trim(),
      imagen: form.imagen.value.trim(),
      precio: Number(form.precio.value)
    };

    // Envía el nuevo instrumento a la API
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoInstrumento)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al agregar instrumento');
        return res.json();
      })
      .then(() => {
        // Limpia el formulario y recarga la lista
        form.reset();
        cargarInstrumentos();
      })
      .catch(err => {
        alert('Error al agregar instrumento');
        console.error(err);
      });
  });

  // Maneja los clicks en los botones de eliminar
  lista.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      if (confirm('¿Estás seguro de eliminar este instrumento?')) {
        // Elimina el instrumento
        fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        })
          .then(res => {
            if (!res.ok) throw new Error('Error al eliminar');
            cargarInstrumentos();
          })
          .catch(err => {
            alert('Error al eliminar');
            console.error(err);
          });
      }
    }
  });

  // Carga los instrumentos al iniciar
  cargarInstrumentos();
});

// Verifica que el usuario esté autenticado
if (localStorage.getItem('adminAuth') !== 'true') {
  window.location.href = 'admin_login.html';
}