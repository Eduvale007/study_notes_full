// Espera a página carregar
document.addEventListener('DOMContentLoaded', () => {

    // Pega os elementos
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const formContainer = document.getElementById('form-container');
    const submitBtn = document.getElementById('submit-btn');

    // Pega o botão do Google
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    // Simula a função de login com Google
    googleLoginBtn.addEventListener('click', () => {
        alert('Redirecionando para o Google para Autenticação OAuth...');
        // No futuro, aqui você faria o redirecionamento (window.location.href)
        // para a sua API de Back-end (Ex: /api/auth/google)
    });

    // Ouve o clique na aba "Cadastrar"
    registerTab.addEventListener('click', () => {
        // 1. Muda o modo do container
        formContainer.classList.add('register-mode');
        
        // 2. Troca o 'active' das abas
        loginTab.classList.remove('active');
        registerTab.classList.add('active');

        // 3. Muda o texto do botão
        submitBtn.textContent = 'Criar Conta';
    });

    // Ouve o clique na aba "Entrar"
    loginTab.addEventListener('click', () => {
        // 1. Muda o modo do container
        formContainer.classList.remove('register-mode');

        // 2. Troca o 'active' das abas
        registerTab.classList.remove('active');
        loginTab.classList.add('active');

        // 3. Muda o texto do botão
        submitBtn.textContent = 'Entrar';
    });


    // (Bônus) Lógica de envio (só para simulação)
    const form = document.getElementById('dynamic-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento

        if (formContainer.classList.contains('register-mode')) {
            // Lógica de Cadastro
            alert('Enviando dados de Cadastro...');
            // No futuro, aqui você faria o 'fetch' para a sua API de /register
        } else {
            // Lógica de Login
            alert('Enviando dados de Login...');
            // No futuro, aqui você faria o 'fetch' para a sua API de /login
            // e se der certo:
            // window.location.href = 'index.html'; // Redireciona para o painel
        }
    });

});