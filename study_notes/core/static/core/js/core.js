document.addEventListener('DOMContentLoaded', () => {

    // --- Pega o token CSRF do HTML ---
    const csrfTokenInput = document.querySelector('input[name=csrfmiddlewaretoken]');
    const csrfToken = csrfTokenInput ? csrfTokenInput.value : null;

    // --- Variável para rastrear o card que está sendo editado ---
    let currentEditCard = null;
   

    // --- ELEMENTOS DO CARD DE BOAS-VINDAS DO BOOKIE ---
    const welcomeCardOverlay = document.getElementById('welcome-card');
    const closeWelcomeCardBtn = document.getElementById('close-welcome-card');
    const welcomeMessageElement = document.getElementById('welcome-message');
    const userNameElement = document.querySelector('.user-name');
    const bookieImage = document.getElementById('bookie-image'); 



    // --- ELEMENTOS GERAIS ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const body = document.body;
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('new-summary-modal');
    const logoutBtn = document.getElementById('logout-btn');
    const summaryForm = document.querySelector('.modal-form');
    const titleInput = document.getElementById('summary-title');
    const disciplineInput = document.getElementById('summary-discipline');
    const contentInput = document.getElementById('summary-content'); 
    const gridContainer = document.querySelector('.grid-container');
    const summaryModalTitle = document.getElementById('summary-modal-title');
    const summarySubmitBtn = document.getElementById('summary-submit-btn');
    const searchInput = document.querySelector('.search-bar input');
    const sidebar = document.querySelector('.sidebar');
    const disciplineList = document.getElementById('discipline-list');

    // Avatares
    const userAvatarButton = document.getElementById('user-avatar-button');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const avatarMenuModal = document.getElementById('avatar-menu-modal');
    const closeAvatarModalBtn = document.getElementById('close-avatar-modal');
    const avatarGrid = document.querySelector('.avatar-grid');
    const saveAvatarBtn = document.getElementById('save-avatar-btn');
    let tempAvatarSrc = userAvatarImg ? userAvatarImg.src : null; 

    // Leitura
    const readModalOverlay = document.getElementById('read-summary-modal');
    const closeReadModalBtn = document.getElementById('close-read-modal-btn');
    const readModalTitle = document.getElementById('read-modal-title');
    const readModalBodyContent = document.getElementById('read-modal-body-content');


    // --- MENSAGEM E IMAGEM ALEATÓRIA ---
    if (welcomeCardOverlay && userNameElement && userNameElement.tagName !== 'A') {
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
        bookieImage.src = staticUrl + 'bookie-bem-vindo.png'; 
        
        const randomImage = new Image();
        randomImage.src = selectedEntry.image;
        randomImage.onload = () => { bookieImage.src = selectedEntry.image; };
        randomImage.onerror = () => { console.error(`Erro ao carregar imagem: ${selectedEntry.image}`); };
        
        welcomeCardOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 

        function closeWelcomeCard() {
            welcomeCardOverlay.classList.remove('active');
            checkOverflow();
        }
        closeWelcomeCardBtn.addEventListener('click', closeWelcomeCard);
        welcomeCardOverlay.addEventListener('click', (event) => {
            if (event.target === welcomeCardOverlay) { closeWelcomeCard(); }
        });
    }

    // --- MAPA DE ÍCONES ---
    const iconMap = {
        'Artes': 'ph-paint-brush', 'Biologia': 'ph-dna', 'Filosofia': 'ph-scroll',
        'Física': 'ph-lightbulb', 'Geografia': 'ph-globe-stand', 'História': 'ph-books',
        'Idiomas': 'ph-translate', 'Literatura': 'ph-book-open', 'Matemática': 'ph-calculator', 
        'Cálculo': 'ph-function', 'Português': 'ph-text-aa', 'Química': 'ph-flask',
        'Sociologia': 'ph-users', 'Padrão': 'ph-file-text' 
    };
    const existingDisciplines = new Set();
    function initializeDisciplineList() {
        if (!disciplineList) return; 
        const initialLinks = disciplineList.querySelectorAll('a');
        initialLinks.forEach(link => {
            if(link.dataset.filter) { existingDisciplines.add(link.dataset.filter); }
        });
    }
    initializeDisciplineList();

    // --- UTILITÁRIO SCROLL ---
    function checkOverflow() {
        const isAnyModalOpen = 
            (welcomeCardOverlay && welcomeCardOverlay.classList.contains('active')) ||
            (modalOverlay && modalOverlay.classList.contains('active')) ||
            (avatarMenuModal && avatarMenuModal.classList.contains('active')) ||
            (readModalOverlay && readModalOverlay.classList.contains('active')) ||
            body.classList.contains('sidebar-open');

        if (!isAnyModalOpen) { document.body.style.overflow = 'auto'; } 
        else { document.body.style.overflow = 'hidden'; }
    }

    // --- MENU RESPONSIVO ---
    function openSidebar() {
        body.classList.add('sidebar-open');
        checkOverflow();
    }
    function closeSidebar() {
        body.classList.remove('sidebar-open');
        checkOverflow();
    }
    if (menuToggleBtn) { 
        menuToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (body.classList.contains('sidebar-open')) { closeSidebar(); } 
            else { openSidebar(); }
        });
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // --- MODAL DE AVATAR ---
    function openAvatarModal() {
        tempAvatarSrc = userAvatarImg.src;
        const allAvatars = avatarGrid.querySelectorAll('.avatar-option');
        allAvatars.forEach(avatar => {
            if (userAvatarImg.src.includes(avatar.dataset.avatarSrc) || avatar.dataset.avatarSrc.includes(userAvatarImg.src)) {
                avatar.classList.add('selected');
            } else {
                avatar.classList.remove('selected');
            }
        });
        avatarMenuModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeAvatarModal() {
        avatarMenuModal.classList.remove('active');
        checkOverflow();
    }
    
    if (userAvatarButton) { 
        userAvatarButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            // === A CORREÇÃO ESTÁ AQUI ===
            // Se a sidebar estiver aberta (no celular), fecha ela antes de abrir o modal
            if (body.classList.contains('sidebar-open')) {
                closeSidebar();
            }
            // ============================

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
            saveAvatarBtn.textContent = "Salvando..."; 
            fetch('/accounts/api/update_avatar/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
                body: JSON.stringify({ 'avatar_url': tempAvatarSrc })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    userAvatarImg.src = data.avatar_url;
                    closeAvatarModal();
                } else {
                    alert('Erro: ' + data.error);
                }
            })
            .catch(() => alert('Erro de conexão.'))
            .finally(() => saveAvatarBtn.textContent = "Salvar foto de perfil");
        });
    }
    
    // --- MODAL "NOVO RESUMO" ---
    function openModal() {
        if (canOpenModal()) {
            if (body.classList.contains('sidebar-open')) { closeSidebar(); }
            currentEditCard = null; 
            summaryModalTitle.textContent = "Criar Novo Resumo";
            summarySubmitBtn.textContent = "Salvar Resumo";
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    }
    function openEditModal(card) {
        if (canOpenModal()) {
            if (body.classList.contains('sidebar-open')) { closeSidebar(); }
            currentEditCard = card;
            summaryModalTitle.textContent = "Editar Resumo";
            summarySubmitBtn.textContent = "Salvar Alterações";
            titleInput.value = card.querySelector('h4').textContent;
            disciplineInput.value = card.querySelector('.card-discipline-dark').textContent;
            contentInput.value = card.dataset.content;
            const colorClass = Array.from(card.classList).find(c => c.startsWith('card-'));
            if (colorClass) { document.querySelector(`input[name="card-color"][value="${colorClass}"]`).checked = true; }
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    }
    function closeModal() {
        summaryForm.reset(); 
        contentInput.value = '';
        document.getElementById('color-blue').checked = true;
        currentEditCard = null; 
        modalOverlay.classList.remove('active');
        checkOverflow();
    }
    if (openModalBtn) { 
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) { closeModal(); }
        });
    }
    
    // --- MODAL DE LEITURA ---
    function openReadModal(title, content) {
        readModalTitle.textContent = title;
        readModalBodyContent.textContent = content;
        readModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeReadModal() {
        readModalOverlay.classList.remove('active');
        checkOverflow();
    }
    if (closeReadModalBtn) { 
        closeReadModalBtn.addEventListener('click', closeReadModal);
        readModalOverlay.addEventListener('click', (event) => {
            if (event.target === readModalOverlay) { closeReadModal(); }
        });
    }

    // --- ESCAPE ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (body.classList.contains('sidebar-open')) { closeSidebar(); }
            else if (welcomeCardOverlay && welcomeCardOverlay.classList.contains('active')) { closeWelcomeCard(); }
            else if (avatarMenuModal && avatarMenuModal.classList.contains('active')) { closeAvatarModal(); }
            else if (modalOverlay && modalOverlay.classList.contains('active')) { closeModal(); }
            else if (readModalOverlay && readModalOverlay.classList.contains('active')) { closeReadModal(); }
        }
    });

    // --- FECHAR AVATAR AO CLICAR FORA ---
    document.addEventListener('click', (event) => {
        if (avatarMenuModal && avatarMenuModal.classList.contains('active')) {
            if (!avatarMenuModal.contains(event.target) && !userAvatarButton.contains(event.target)) {
                closeAvatarModal();
            }
        }
    });

    // --- LOGOUT ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => { });
    }

    // --- SUBMIT RESUMO ---
    if (summaryForm) {
        summaryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = titleInput.value;
            const discipline = disciplineInput.value;
            const selectedColor = document.querySelector('input[name="card-color"]:checked').value;
            const content = contentInput.value; 
            const formattedDiscipline = discipline.trim().charAt(0).toUpperCase() + discipline.trim().slice(1).toLowerCase();

            if (!title.trim() || !formattedDiscipline) { return alert('Preencha título e disciplina.'); }
            if (!content.trim()) { return alert('Escreva o conteúdo.'); }

            const originalBtnText = summarySubmitBtn.textContent;
            summarySubmitBtn.textContent = "Salvando...";

            if (currentEditCard) {
                const summaryId = currentEditCard.dataset.id; 
                const oldDiscipline = currentEditCard.querySelector('.card-discipline-dark').textContent;
                fetch(`/api/update_summary/${summaryId}/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
                    body: JSON.stringify({ 'titulo': title, 'disciplina': formattedDiscipline, 'conteudo': content, 'cor_tag': selectedColor })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        currentEditCard.querySelector('h4').textContent = title;
                        currentEditCard.querySelector('.card-discipline-dark').textContent = formattedDiscipline;
                        currentEditCard.dataset.content = content;
                        currentEditCard.className = `summary-card ${selectedColor}`;
                        addDisciplineToSidebar(formattedDiscipline);
                        if (oldDiscipline !== formattedDiscipline) { checkIfDisciplineIsEmpty(oldDiscipline); }
                        closeModal();
                    } else { alert('Erro ao editar: ' + data.error); }
                })
                .catch(() => alert('Erro de conexão.'))
                .finally(() => summarySubmitBtn.textContent = originalBtnText);
            } else {
                fetch('/api/create_summary/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
                    body: JSON.stringify({ 'titulo': title, 'disciplina': formattedDiscipline, 'conteudo': content, 'cor_tag': selectedColor })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {

                        const emptyMsg = document.getElementById('empty-state-msg');
                        if (emptyMsg) {
                            emptyMsg.remove();
                        }

                        addDisciplineToSidebar(formattedDiscipline);
                        const newCard = document.createElement('article');
                        newCard.className = `summary-card ${selectedColor}`;
                        newCard.dataset.content = content;
                        newCard.dataset.id = data.id; 
                        newCard.innerHTML = `
                            <button class="delete-btn"><i class="ph ph-x"></i></button>
                            <button class="expand-btn"><i class="ph ph-arrows-out"></i></button>
                            <button class="edit-btn"><i class="ph ph-pencil-simple"></i></button>
                            <h4>${title}</h4>
                            <span class="card-discipline-dark">${formattedDiscipline}</span>
                        `;
                        gridContainer.prepend(newCard);
                        closeModal();
                    } else { alert('Erro ao criar: ' + data.error); }
                })
                .catch(() => alert('Erro de conexão.'))
                .finally(() => summarySubmitBtn.textContent = originalBtnText);
            }
        });
    }

    function addDisciplineToSidebar(disciplineName) {
        if (!disciplineList || existingDisciplines.has(disciplineName)) { return; }
        existingDisciplines.add(disciplineName);
        const iconClass = iconMap[disciplineName] || iconMap['Padrão'];
        const newLi = document.createElement('li');
        newLi.innerHTML = `<a href="#" data-filter="${disciplineName}"><i class="ph ${iconClass}"></i> ${disciplineName}</a>`;
        disciplineList.appendChild(newLi);
    }

    if (sidebar) {
        sidebar.addEventListener('click', (event) => {
            if(body.classList.contains('sidebar-open') && event.target.closest('a')) { closeSidebar(); }

            const clickedLink = event.target.closest('a');
            if (!clickedLink || clickedLink.id === 'logout-btn' || clickedLink.closest('#user-avatar-button')) { return; }
            const filterValue = clickedLink.dataset.filter;
            if (!filterValue) { return; }
            
            event.preventDefault();
            searchInput.value = '';
            sidebar.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            clickedLink.parentElement.classList.add('active');

            gridContainer.querySelectorAll('.summary-card').forEach(card => {
                const disc = card.querySelector('.card-discipline-dark').textContent;
                card.style.display = (filterValue === 'Todos' || disc === filterValue) ? 'flex' : 'none';
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const term = searchInput.value.toLowerCase();
            sidebar.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            if(document.querySelector('.sidebar-nav li')) document.querySelector('.sidebar-nav li').classList.add('active');
            gridContainer.querySelectorAll('.summary-card').forEach(card => {
                card.style.display = card.querySelector('h4').textContent.toLowerCase().includes(term) ? 'flex' : 'none';
            });
        });
    }

    // ============================================================
    // LÓGICA DO MODAL DE DELETAR (Estava faltando isso!)
    // ============================================================
    
    // 1. Pegar os elementos do modal
    const deleteModalOverlay = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let cardPendingDelete = null; // Variável para saber qual card apagar

    // 2. Função para abrir o modal
    function openDeleteModal(card) {
        cardPendingDelete = card; // Guarda o card na memória
        if (deleteModalOverlay) {
            deleteModalOverlay.classList.add('active');
        }
    }

    // 3. Função para fechar o modal
    function closeDeleteModal() {
        if (deleteModalOverlay) {
            deleteModalOverlay.classList.remove('active');
        }
        cardPendingDelete = null; // Limpa a memória
    }

    // 4. Listeners dos botões do modal
    if (deleteModalOverlay) {
        // Botão Cancelar
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);

        // Clicar fora para fechar
        deleteModalOverlay.addEventListener('click', (e) => {
            if (e.target === deleteModalOverlay) closeDeleteModal();
        });

       // Botão CONFIRMAR EXCLUSÃO
        confirmDeleteBtn.addEventListener('click', () => {
            if (!cardPendingDelete) return;

            const summaryId = cardPendingDelete.dataset.id;
            const originalText = confirmDeleteBtn.textContent;
            confirmDeleteBtn.textContent = "Excluindo...";

            fetch(`/api/delete_summary/${summaryId}/`, { 
                method: 'DELETE', 
                headers: { 'X-CSRFToken': csrfToken } 
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    // Cria cópia local para não perder a referência
                    const cardElement = cardPendingDelete; 
                    const discipline = cardElement.querySelector('.card-discipline-dark').textContent.trim();
                    
                    cardElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    cardElement.style.opacity = '0';
                    cardElement.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        cardElement.remove();
                        checkIfDisciplineIsEmpty(discipline);
                    }, 300);

                    closeDeleteModal();
                } else {
                    alert('Erro ao deletar: ' + data.error);
                }
            })
            .catch(() => alert('Erro de conexão ao deletar.'))
            .finally(() => {
                confirmDeleteBtn.textContent = originalText;
            });
        });
    }

    if (gridContainer) {
        gridContainer.addEventListener('click', (event) => {
            const deleteBtn = event.target.closest('.delete-btn');
            const expandBtn = event.target.closest('.expand-btn');
            const editBtn = event.target.closest('.edit-btn');
            
            // Verifica se clicou em algum botão antes de procurar o card
            if (!deleteBtn && !expandBtn && !editBtn) return;

            const card = event.target.closest('.summary-card');

            if (deleteBtn) {
                // (ATUALIZADO) Em vez de deletar direto, abre o modal de confirmação
                openDeleteModal(card);
            } 
            else if (expandBtn) {
                const content = card.dataset.content;
                if (!content) return alert('Sem conteúdo.');
                openReadModal(card.querySelector('h4').textContent, content);
            } 
            else if (editBtn) {
                openEditModal(card);
            }
        });
    }

    function canOpenModal() {
        // Só abre se não tiver outro modal aberto
        return !(welcomeCardOverlay.classList.contains('active') || avatarMenuModal.classList.contains('active') || readModalOverlay.classList.contains('active'));
    }

  // --- BOTÃO DE TEMA NA SIDEBAR (CORRIGIDO) ---
    const sidebarThemeBtn = document.getElementById('sidebar-theme-toggle');
    
    if (sidebarThemeBtn) {
        const icon = sidebarThemeBtn.querySelector('i');
        
        // Função auxiliar para checar o tema no HTML
        function isLightMode() {
            return document.documentElement.classList.contains('light-mode');
        }

        // 1. Ajusta o ícone ao carregar
        if (isLightMode()) {
            icon.classList.replace('ph-sun', 'ph-moon');
        } else {
             // Garante o ícone certo se for escuro
            icon.classList.replace('ph-moon', 'ph-sun');
        }

        // 2. Ação do clique
        sidebarThemeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Chama a função global do theme.js
            if (typeof toggleTheme === "function") {
                toggleTheme();
            }

            // Atualiza o ícone
            if (isLightMode()) {
                icon.classList.replace('ph-sun', 'ph-moon');
            } else {
                icon.classList.replace('ph-moon', 'ph-sun');
            }
        });
    }

    // --- FUNÇÃO VERIFICAR SE DISCIPLINA ESTÁ VAZIA (CORRIGIDA) ---
    function checkIfDisciplineIsEmpty(disciplineName) {
        
        const allSummaries = gridContainer.querySelectorAll('.summary-card');
        let disciplineFound = false;

        for (const summary of allSummaries) {
            // (CORREÇÃO) Adicionamos .trim() aqui também para garantir a comparação exata
            const cardDiscipline = summary.querySelector('.card-discipline-dark').textContent.trim();
            
            if (cardDiscipline === disciplineName) {
                disciplineFound = true; 
                break; // Se achou pelo menos um, para e não deleta o link
            }
        }

        // Se rodou tudo e não achou nenhum card com essa disciplina...
        if (!disciplineFound) {
            // Busca o link na sidebar
            const linkToRemove = disciplineList.querySelector(`a[data-filter="${disciplineName}"]`);
            
            if (linkToRemove) {
                // Remove o <li> inteiro
                linkToRemove.parentElement.remove();
                
                // Remove da lista de controle
                existingDisciplines.delete(disciplineName);

                // Se o filtro atual era esse, volta para "Todos"
                const currentFilter = document.querySelector('.sidebar-nav li.active a');
                // Verifica se existe filtro ativo antes de tentar acessar dataset
                if (currentFilter && currentFilter.dataset.filter === disciplineName) {
                    const todosLink = document.querySelector('.sidebar-nav a[data-filter="Todos"]');
                    if (todosLink) todosLink.click();
                }
            }
        }
    }

  
});