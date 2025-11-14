// Aguarda o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- (NOVO) ELEMENTOS DO MENU RESPONSIVO ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const body = document.body;

    // --- (NOVO) Variável para rastrear o card que está sendo editado ---
    let currentEditCard = null;

    // --- ELEMENTOS DO CARD DE BOAS-VINDAS DO BOOKIE ---
    const welcomeCardOverlay = document.getElementById('welcome-card');
    const closeWelcomeCardBtn = document.getElementById('close-welcome-card');
    const welcomeMessageElement = document.getElementById('welcome-message');
    const userNameElement = document.querySelector('.user-name');
    const bookieImage = document.getElementById('bookie-image'); 


    // ===================================
    // MENSAGEM E IMAGEM ALEATÓRIA
    // ===================================
    const userName = userNameElement.textContent;

const welcomeMessages = [
    { message: `Que bom te ter de volta, ${userName}!`, image: staticUrl + 'bookie-bem-vindo.png' },
    { message: `Pronto(a) para revisar, ${userName}?`, image: staticUrl + 'bookie-lendo.png' },
    { message: `Bookie sentiu sua falta!`, image: staticUrl + 'bookie-saudade.png' },
    { message: `Vamos organizar esses estudos!`, image: staticUrl + 'bookie-concentrado-lendo.png' },
    { message: `Zen para resumir!`, image: staticUrl + 'bookie-zen.png' }
]; 
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    const selectedEntry = welcomeMessages[randomIndex]; 
    welcomeMessageElement.textContent = selectedEntry.message;
    bookieImage.src = selectedEntry.image;
    bookieImage.onerror = () => { 
        console.error(`Erro ao carregar imagem: ${selectedEntry.image}`);
        bookieImage.src = 'https://i.pravatar.cc/150?img=1'; 
    };
    
    welcomeCardOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    function closeWelcomeCard() {
        welcomeCardOverlay.classList.remove('active');
        if (!modalOverlay.classList.contains('active') && !avatarMenuModal.classList.contains('active') && !readModalOverlay.classList.contains('active')) {
            document.body.style.overflow = 'auto'; 
        }
    }
    closeWelcomeCardBtn.addEventListener('click', closeWelcomeCard);
    welcomeCardOverlay.addEventListener('click', (event) => {
        if (event.target === welcomeCardOverlay) { closeWelcomeCard(); }
    });

    // --- (NOVO) FUNCIONALIDADE DO MENU RESPONSIVO ---
    function openSidebar() {
        body.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden'; // Trava o scroll
    }
    function closeSidebar() {
        body.classList.remove('sidebar-open');
        // (ATUALIZADO) Checa outros modais antes de liberar o scroll
        if (!modalOverlay.classList.contains('active') && !avatarMenuModal.classList.contains('active') && !readModalOverlay.classList.contains('active') && !welcomeCardOverlay.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    }

    menuToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (body.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    
    sidebarOverlay.addEventListener('click', closeSidebar);

    // ===================================


    // --- ELEMENTOS DO MODAL "NOVO RESUMO" ---
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('new-summary-modal');
    
    // --- ELEMENTO DE LOGOUT ---
    const logoutBtn = document.getElementById('logout-btn');

    // --- ELEMENTOS DO FORMULÁRIO E DO GRID ---
    const summaryForm = document.querySelector('.modal-form');
    const titleInput = document.getElementById('summary-title');
    const disciplineInput = document.getElementById('summary-discipline');
    const contentInput = document.getElementById('summary-content'); 
    const gridContainer = document.querySelector('.grid-container');

    // --- (NOVO) Seletores do Título e Botão do Modal ---
    const summaryModalTitle = document.getElementById('summary-modal-title');
    const summarySubmitBtn = document.getElementById('summary-submit-btn');

    // --- ELEMENTO DA BARRA DE BUSCA ---
    const searchInput = document.querySelector('.search-bar input');

    // --- ELEMENTOS DA SIDEBAR ---
    const sidebar = document.querySelector('.sidebar');
    const disciplineList = document.getElementById('discipline-list');

    // --- ELEMENTOS DO MODAL DE AVATAR ---
    const userAvatarButton = document.getElementById('user-avatar-button');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const avatarMenuModal = document.getElementById('avatar-menu-modal');
    const closeAvatarModalBtn = document.getElementById('close-avatar-modal');
    const avatarGrid = document.querySelector('.avatar-grid');
    const saveAvatarBtn = document.getElementById('save-avatar-btn');
    
    let tempAvatarSrc = userAvatarImg.src; 
    
    // --- ELEMENTOS DO MODAL DE LEITURA ---
    const readModalOverlay = document.getElementById('read-summary-modal');
    const closeReadModalBtn = document.getElementById('close-read-modal-btn');
    const readModalTitle = document.getElementById('read-modal-title');
    const readModalBodyContent = document.getElementById('read-modal-body-content');

    
    // --- Mapa de Ícones ---
    const iconMap = {
        'Artes': 'ph-paint-brush', 'Biologia': 'ph-dna', 'Filosofia': 'ph-scroll',
        'Física': 'ph-lightbulb', 'Geografia': 'ph-globe-stand', 'História': 'ph-books',
        'Idiomas': 'ph-translate', 'Literatura': 'ph-book-open', 'Matemática': 'ph-calculator', 
        'Cálculo': 'ph-function', 'Português': 'ph-text-aa', 'Química': 'ph-flask',
        'Sociologia': 'ph-users', 'Padrão': 'ph-file-text' 
    };

    // --- Lista de Disciplinas ---
    const existingDisciplines = new Set();
    function initializeDisciplineList() {
        const initialLinks = disciplineList.querySelectorAll('a');
        initialLinks.forEach(link => {
            if(link.dataset.filter) { existingDisciplines.add(link.dataset.filter); }
        });
    }
    initializeDisciplineList();


    // --- FUNCIONALIDADE DO MODAL DE AVATAR ---
    function openAvatarModal() {
        tempAvatarSrc = userAvatarImg.src;
        const allAvatars = avatarGrid.querySelectorAll('.avatar-option');
        let matchingAvatarFound = false;
        allAvatars.forEach(avatar => {
            if (userAvatarImg.src.includes(avatar.dataset.avatarSrc) || avatar.dataset.avatarSrc.includes(userAvatarImg.src)) {
                avatar.classList.add('selected');
                matchingAvatarFound = true;
            } else {
                avatar.classList.remove('selected');
            }
        });
        avatarMenuModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeAvatarModal() {
        avatarMenuModal.classList.remove('active');
        if (!welcomeCardOverlay.classList.contains('active') && !modalOverlay.classList.contains('active') && !readModalOverlay.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    }
    userAvatarButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        openAvatarModal();
    });
    closeAvatarModalBtn.addEventListener('click', closeAvatarModal);
    avatarMenuModal.addEventListener('click', (event) => {
        if (event.target === avatarMenuModal) { closeAvatarModal(); }
    });
    avatarGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('avatar-option')) {
            avatarGrid.querySelectorAll('.avatar-option').forEach(img => img.classList.remove('selected'));
            event.target.classList.add('selected');
            tempAvatarSrc = event.target.dataset.avatarSrc;
        }
    });
    saveAvatarBtn.addEventListener('click', () => {
        userAvatarImg.src = tempAvatarSrc;
        closeAvatarModal();
    });


    // --- (CORRIGIDO) FUNCIONALIDADE DO MODAL "NOVO RESUMO" ---
    function openModal() {
        // Abre em modo "Novo"
        if (!welcomeCardOverlay.classList.contains('active') && !avatarMenuModal.classList.contains('active') && !readModalOverlay.classList.contains('active')) {
            
            // Reseta o formulário para o modo "Criar"
            currentEditCard = null; // <-- Garante que não está em modo de edição
            summaryModalTitle.textContent = "Criar Novo Resumo";
            summarySubmitBtn.textContent = "Salvar Resumo";

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    }

    // (NOVO) Função para abrir o modal em MODO DE EDIÇÃO
    function openEditModal(card) {
        if (!welcomeCardOverlay.classList.contains('active') && !avatarMenuModal.classList.contains('active') && !readModalOverlay.classList.contains('active')) {
            
            // 1. Configura o modo de edição
            currentEditCard = card;
            summaryModalTitle.textContent = "Editar Resumo";
            summarySubmitBtn.textContent = "Salvar Alterações";

            // 2. Pega os dados do card
            const title = card.querySelector('h4').textContent;
            const discipline = card.querySelector('.card-discipline-dark').textContent;
            const content = card.dataset.content;
            const colorClass = Array.from(card.classList).find(c => c.startsWith('card-'));

            // 3. Preenche o formulário
            titleInput.value = title;
            disciplineInput.value = discipline;
            contentInput.value = content;
            if (colorClass) {
                document.querySelector(`input[name="card-color"][value="${colorClass}"]`).checked = true;
            }

            // 4. Abre o modal
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    }

    // (CORRIGIDO) Função de fechar o modal
    function closeModal() {
        // Reseta o formulário e o estado de edição
        summaryForm.reset(); 
        contentInput.value = '';
        document.getElementById('color-blue').checked = true;
        currentEditCard = null; // <-- A CORREÇÃO PRINCIPAL

        modalOverlay.classList.remove('active');
        if (!welcomeCardOverlay.classList.contains('active') && !avatarMenuModal.classList.contains('active') && !readModalOverlay.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    }

    openModalBtn.addEventListener('click', openModal); // Botão "Novo Resumo" sempre abre o modal limpo
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) { closeModal(); }
    });
    
    // --- FUNCIONALIDADE DO MODAL DE LEITURA ---
    function openReadModal(title, content) {
        readModalTitle.textContent = title;
        readModalBodyContent.textContent = content;
        readModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeReadModal() {
        readModalOverlay.classList.remove('active');
        if (!welcomeCardOverlay.classList.contains('active') && !modalOverlay.classList.contains('active') && !avatarMenuModal.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    }
    closeReadModalBtn.addEventListener('click', closeReadModal);
    readModalOverlay.addEventListener('click', (event) => {
        if (event.target === readModalOverlay) { closeReadModal(); }
    });


    // (ATUALIZADO) Gerenciador de 'Esc' para fechar TODOS os pop-ups
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (welcomeCardOverlay.classList.contains('active')) {
                closeWelcomeCard();
            } else if (modalOverlay.classList.contains('active')) {
                closeModal();
            } else if (avatarMenuModal.classList.contains('active')) {
                closeAvatarModal();
            } else if (readModalOverlay.classList.contains('active')) {
                closeReadModal();
            }
        }
    });


    // --- FECHAR MODAL DE AVATAR AO CLICAR FORA ---
  // SUBSTITUA PELO CÓDIGO ABAIXO:
    // --- (CORRIGIDO) FECHAR MODAL DE AVATAR AO CLICAR FORA ---
    document.addEventListener('click', (event) => {
        
        // (NOVO) Se o clique foi no overlay da sidebar, não faça nada.
        // Deixe o listener da sidebar (sidebarOverlay.addEventListener) cuidar disso.
        if (event.target.id === 'sidebar-overlay') {
            return;
        }

        // Se o modal de avatar estiver aberto...
        if (avatarMenuModal.classList.contains('active')) {
            // E o clique NÃO foi no menu E NÃO foi no botão que abre o menu...
            if (!avatarMenuModal.contains(event.target) && !userAvatarButton.contains(event.target)) {
                closeAvatarModal(); // ... então feche o modal.
            }
        }
    });

    // --- FUNCIONALIDADE DE LOGOUT ---
    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        window.location.href = 'login.html'; 
    });


    // --- (ATUALIZADO) FUNÇÃO DE ADICIONAR E EDITAR RESUMO ---
    summaryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Pega os valores do formulário
        const title = titleInput.value;
        const discipline = disciplineInput.value;
        const selectedColor = document.querySelector('input[name="card-color"]:checked').value;
        const content = contentInput.value; 
        const formattedDiscipline = discipline.trim().charAt(0).toUpperCase() + discipline.trim().slice(1).toLowerCase();

        // Validação
        if (title.trim() === '' || formattedDiscipline === '') {
            alert('Por favor, preencha o título e a disciplina.');
            return; 
        }
        if (content.trim() === '') {
             alert('Por favor, escreva o conteúdo do resumo.');
            return;
        }

        // ===================================
        // LÓGICA DE DECISÃO: EDITAR OU CRIAR?
        // ===================================
        if (currentEditCard) {
            // MODO DE EDIÇÃO
            
            const oldDiscipline = currentEditCard.querySelector('.card-discipline-dark').textContent;

            // 1. Atualiza os dados do card
            currentEditCard.querySelector('h4').textContent = title;
            currentEditCard.querySelector('.card-discipline-dark').textContent = formattedDiscipline;
            currentEditCard.dataset.content = content;
            
            // 2. Atualiza a cor
            currentEditCard.className = 'summary-card'; // Limpa cores antigas
            currentEditCard.classList.add(selectedColor); // Adiciona a nova

            // 3. Atualiza a sidebar (se necessário)
            addDisciplineToSidebar(formattedDiscipline);
            if (oldDiscipline !== formattedDiscipline) {
                checkIfDisciplineIsEmpty(oldDiscipline);
            }

        } else {
            // MODO DE CRIAÇÃO
            addDisciplineToSidebar(formattedDiscipline);

            const newCard = document.createElement('article');
            newCard.classList.add('summary-card', selectedColor); 
            newCard.dataset.content = content; 
            
            newCard.innerHTML = `
                <button class="delete-btn"><i class="ph ph-x"></i></button>
                <button class="expand-btn"><i class="ph ph-arrows-out"></i></button>
                <button class="edit-btn"><i class="ph ph-pencil-simple"></i></button>
                <h4>${title}</h4>
                <span class="card-discipline-dark">${formattedDiscipline}</span>
            `;
            gridContainer.prepend(newCard);
        }

        closeModal(); // Fecha o modal após salvar
    });


    // --- FUNÇÃO ADICIONAR DISCIPLINA NA SIDEBAR ---
    function addDisciplineToSidebar(disciplineName) {
        if (existingDisciplines.has(disciplineName)) { return; }
        existingDisciplines.add(disciplineName);
        const iconClass = iconMap[disciplineName] || iconMap['Padrão'];
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            <a href="#" data-filter="${disciplineName}">
                <i class="ph ${iconClass}"></i> ${disciplineName}
            </a>
        `;
        disciplineList.appendChild(newLi);
    }

    
    // --- FUNÇÃO DE FILTRAR POR DISCIPLINA ---
    sidebar.addEventListener('click', (event) => {
        const clickedLink = event.target.closest('a');
        if (!clickedLink || clickedLink.id === 'logout-btn' || clickedLink.closest('#user-avatar-button')) { 
            return; 
        }
        const filterValue = clickedLink.dataset.filter;
        if (!filterValue) { return; }
        event.preventDefault();
        
        searchInput.value = '';

        const allFilterLinks = sidebar.querySelectorAll('.sidebar-nav li, .sidebar-section li');
        allFilterLinks.forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.parentElement.classList.add('active');

        const allSummaries = gridContainer.querySelectorAll('.summary-card');
        if (filterValue === 'Todos') {
            allSummaries.forEach(summary => { summary.style.display = 'flex'; });
        } else {
            allSummaries.forEach(summary => {
                const cardDiscipline = summary.querySelector('.card-discipline-dark').textContent;
                if (cardDiscipline === filterValue) {
                    summary.style.display = 'flex';
                } else {
                    summary.style.display = 'none';
                }
            });
        }
    });


    // --- FUNÇÃO DE BUSCAR RESUMO (SEARCH BAR) ---
    searchInput.addEventListener('keyup', () => {
        
        const searchTerm = searchInput.value.toLowerCase();

        const allFilterLinks = sidebar.querySelectorAll('.sidebar-nav li, .sidebar-section li');
        allFilterLinks.forEach(link => {
            link.classList.remove('active');
        });
        const inicioLink = document.querySelector('.sidebar-nav li');
        if (inicioLink) {
            inicioLink.classList.add('active');
        }

        const allSummaries = gridContainer.querySelectorAll('.summary-card');
        
        allSummaries.forEach(summary => {
            const title = summary.querySelector('h4').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                summary.style.display = 'flex'; 
            } else {
                summary.style.display = 'none'; 
            }
        });
    });


    // --- FUNÇÃO DE DELETAR, EXPANDIR E EDITAR ---
    gridContainer.addEventListener('click', (event) => {
        
        // 1. Lógica de Deletar
        const deleteButton = event.target.closest('.delete-btn');
        if (deleteButton) {
            const cardToDelete = deleteButton.closest('.summary-card');
            const wantsToDelete = confirm('Tem certeza que quer deletar este resumo?');
            
            if (wantsToDelete && cardToDelete) {
                const disciplineName = cardToDelete.querySelector('.card-discipline-dark').textContent;
                cardToDelete.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                cardToDelete.style.opacity = '0';
                cardToDelete.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    cardToDelete.remove(); 
                    checkIfDisciplineIsEmpty(disciplineName);
                }, 300);
            }
            return; 
        }

        // 2. Lógica de Expandir
        const expandButton = event.target.closest('.expand-btn');
        if (expandButton) {
            const card = expandButton.closest('.summary-card');
            const title = card.querySelector('h4').textContent;
            const content = card.dataset.content;

            if (!content || content.trim() === '') {
                alert('Este resumo não tem conteúdo salvo!');
                return;
            }
            
            openReadModal(title, content);
            return;
        }

        // 3. Lógica de Editar
        const editButton = event.target.closest('.edit-btn');
        if (editButton) {
            const cardToEdit = editButton.closest('.summary-card');
            openEditModal(cardToEdit);
            return;
        }
    });

    
    // --- FUNÇÃO VERIFICAR SE DISCIPLINA ESTÁ VAZIA ---
    function checkIfDisciplineIsEmpty(disciplineName) {
        const allSummaries = gridContainer.querySelectorAll('.summary-card');
        let disciplineFound = false;
        for (const summary of allSummaries) {
            const cardDiscipline = summary.querySelector('.card-discipline-dark').textContent;
            if (cardDiscipline === disciplineName) {
                disciplineFound = true; 
                break; 
            }
        }

        if (!disciplineFound) {
            const linkToRemove = disciplineList.querySelector(`a[data-filter="${disciplineName}"]`);
            if (linkToRemove) {
                linkToRemove.parentElement.remove();
                existingDisciplines.delete(disciplineName);
                const todosLink = document.querySelector('.sidebar-nav a[data-filter="Todos"]');
                if (todosLink) {
                    todosLink.click();
                }
            }
        }
    }

});

