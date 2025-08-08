const form = document.getElementById('loginForm');
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

// Maneja el envío del formulario de login
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtiene los datos del formulario
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    // Envía las credenciales al servidor
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Verifica si hubo error en el login
    if (!res.ok) {
      showMessage(data.message || 'Usuario o contraseña incorrectos.', true);
      return;
    }

    // Guarda el token y email en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);

    showMessage('Inicio de sesión exitoso');

    // Redirige a la página principal
    window.location.href = 'home.html';
  } catch (error) {
    // Maneja errores de conexión
    showMessage('Error de conexión al servidor', true);
  }
});