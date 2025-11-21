// theme.js

(function() {
    try {
        const savedTheme = localStorage.getItem('studyNotesTheme');
        if (savedTheme === 'light') {
            // AQUI ESTÁ A CORREÇÃO: Usamos documentElement (tag html) em vez de body
            document.documentElement.classList.add('light-mode');
        }
    } catch (e) {
        console.error("Erro ao acessar LocalStorage:", e);
    }
})();

// Função global
function toggleTheme() {
    // AQUI TAMBÉM: documentElement
    const html = document.documentElement;
    html.classList.toggle('light-mode');
    
    if (html.classList.contains('light-mode')) {
        localStorage.setItem('studyNotesTheme', 'light');
    } else {
        localStorage.setItem('studyNotesTheme', 'dark');
    }
}