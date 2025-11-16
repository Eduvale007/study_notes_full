

// Espera a página carregar


document.addEventListener('DOMContentLoaded', () => {

    

    // Pega os elementos
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const formContainer = document.getElementById('form-container');
    const submitBtn = document.getElementById('submit-btn');

    // Pega o formulário
    const dynamicForm = document.getElementById('dynamic-form');
    
    // Pega as URLs que passamos do Django
    const loginUrl = dynamicForm.dataset.loginUrl;
    const registerUrl = dynamicForm.dataset.registerUrl;


    // Ouve o clique na aba "Cadastrar"
    registerTab.addEventListener('click', () => {
        // 1. Muda o modo do container
        formContainer.classList.add('register-mode');
        
        // 2. Troca o 'active' das abas
        loginTab.classList.remove('active');
        registerTab.classList.add('active');

        // 3. Muda o texto do botão
        submitBtn.textContent = 'Criar Conta';

        // 4. Muda a URL do 'action' do formulário
        dynamicForm.action = registerUrl;
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

        // 4. Muda a URL do 'action' do formulário
        dynamicForm.action = loginUrl;
    });


    
    //
    // !!! IMPORTANTE: O BLOCO 'form.addEventListener('submit', ...)' FOI REMOVIDO !!!
    //
});