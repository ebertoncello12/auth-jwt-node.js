const form = document.querySelector('.form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:5500/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const { token } = data; // Extrai o token dos dados retornados
      console.log('Autenticaçao Garantida - Token:', token);
    } else {
      const errorData = await response.json();
      // Trate o erro, exiba uma mensagem de erro, etc.
      console.error(errorData);
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
});
