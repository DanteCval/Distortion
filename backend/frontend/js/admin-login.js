document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  if (username === 'admin' && password === 'distortion123') {
    localStorage.setItem('adminAuth', 'true');
    window.location.href = 'admin.html';
  } else {
    document.getElementById('loginMsg').textContent = 'Credenciales incorrectas';
  }
});
