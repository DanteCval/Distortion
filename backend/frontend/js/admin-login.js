// Escucha el evento submit del formulario de login
document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
  // Evita que la página se recargue
  e.preventDefault();
  
  // Obtiene los valores del formulario
  const username = e.target.username.value;
  const password = e.target.password.value;

  // Verifica las credenciales
  if (username === 'admin' && password === 'distortion123') {
    // Guarda la sesión en localStorage
    localStorage.setItem('adminAuth', 'true');
    // Redirige al panel de admin
    window.location.href = 'admin.html';
  } else {
    // Muestra mensaje de error
    document.getElementById('loginMsg').textContent = 'Credenciales incorrectas';
  }
});