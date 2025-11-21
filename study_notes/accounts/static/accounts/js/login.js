// login.js

document.addEventListener('DOMContentLoaded', () => {

    // Elementos das Abas e Container
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const formContainer = document.getElementById('form-container');
    const submitBtn = document.getElementById('submit-btn');
    const dynamicForm = document.getElementById('dynamic-form');
    
    // URLs do Django
    const loginUrl = dynamicForm.dataset.loginUrl;
    const registerUrl = dynamicForm.dataset.registerUrl;

    // Campos específicos de Cadastro (que precisam ter o 'required' alternado)
    const nameInput = document.getElementById('name');
    const confirmPassInput = document.getElementById('confirm-password');
    const termsInput = document.getElementById('termos');

    // --- FUNÇÃO PARA ALTERNAR OBRIGATORIEDADE ---
    function setRegisterFieldsRequired(isRequired) {
        if (nameInput) nameInput.required = isRequired;
        if (confirmPassInput) confirmPassInput.required = isRequired;
        if (termsInput) termsInput.required = isRequired;
    }

    // Inicializa como LOGIN (Campos de cadastro NÃO são obrigatórios)
    setRegisterFieldsRequired(false);

    // --- CLIQUE EM "CADASTRAR" ---
    registerTab.addEventListener('click', () => {
        formContainer.classList.add('register-mode');
        
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        
        submitBtn.textContent = 'Criar Conta';
        dynamicForm.action = registerUrl;

        // (CORREÇÃO) Torna os campos obrigatórios
        setRegisterFieldsRequired(true);
    });

    // --- CLIQUE EM "ENTRAR" ---
    loginTab.addEventListener('click', () => {
        formContainer.classList.remove('register-mode');
        
        registerTab.classList.remove('active');
        loginTab.classList.add('active');
        
        submitBtn.textContent = 'Entrar';
        dynamicForm.action = loginUrl;

        // (CORREÇÃO) Remove a obrigatoriedade
        setRegisterFieldsRequired(false);
    });


    // Listener de submit (vazio) para deixar o formulário enviar
    dynamicForm.addEventListener('submit', (event) => {
        // O navegador agora vai validar corretamente
    });

});