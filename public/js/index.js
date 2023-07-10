document.querySelector(".form").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    // Realize as validações necessárias nos campos aqui, se necessário
  
    // Faça uma requisição para a rota de registro no servidor
    fetch("auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmpassword: confirmPassword
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Faça algo com a resposta do servidor, como exibir uma mensagem de sucesso para o usuário
        if (data.message === "Usuário criado com sucesso") {
          // Exibir mensagem de sucesso para o usuário usando SweetAlert2
          Swal.fire({
            title: "Sucesso",
            text: "Usuário criado com sucesso!",
            icon: "success",
            confirmButtonColor: "#4169E1",
            confirmButtonText: "OK"
          }).then(() => {
            // Redirecionar para a página de login
            window.location.href = "./login.html";
          });
        } else {
          // Exibir mensagem de erro para o usuário usando SweetAlert2
          Swal.fire({
            title: "Erro",
            text: data.message,
            icon: "error",
            confirmButtonColor: "#4169E1",
            confirmButtonText: "OK"
          });
        }
      })
      .catch(error => {
        console.log(error);
        // Trate o erro de acordo com a sua necessidade, como exibir uma mensagem de erro para o usuário
        Swal.fire({
          title: "Erro",
          text: "Ocorreu um erro. Por favor, tente novamente mais tarde.",
          icon: "error",
          confirmButtonColor: "#4169E1",
          confirmButtonText: "OK"
        });
      });
  });
  