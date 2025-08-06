const form = document.getElementById('registerForm');
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
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      showMessage(errorData.message || 'Error en registro', true);
      return;
    }
    showMessage('Registro exitoso. Ahora puedes iniciar sesión.');
  } catch (error) {
    showMessage('Error de conexión al servidor', true);
  }
});
