const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

// URL de la API según el entorno
const API_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api/auth'
    : 'https://distortion-production.up.railway.app/api/auth';

// Función para mostrar mensajes al usuario
function showMessage(msg, isError = false) {
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : 'green';
}

// Maneja el envío del formulario de registro
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtiene los datos del formulario
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    // Envía los datos de registro al servidor
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    // Verifica si hubo error en el registro
    if (!res.ok) {
      const errorData = await res.json();
      showMessage(errorData.message || 'Error en registro', true);
      return;
    }
    
    // Muestra mensaje de éxito
    showMessage('Registro exitoso. Ahora puedes iniciar sesión.');
  } catch (error) {
    // Maneja errores de conexión
    showMessage('Error de conexión al servidor', true);
  }
});