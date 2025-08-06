const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const API_URL = 'http://localhost:3000/api/auth';

function showMessage(msg, isError = false) {
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : 'green';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || 'Usuario o contraseña incorrectos.', true);
      return;
    }

    // Guardar token en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);

    showMessage('Inicio de sesión exitoso');

    // Redirigir
    window.location.href = 'home.html';
  } catch (error) {
    showMessage('Error de conexión al servidor', true);
  }
});
