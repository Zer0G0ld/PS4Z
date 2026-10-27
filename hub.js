// hub.js
async function iniciarHome() {
    // 1. Carrega TUDO de uma vez (o data.js já busca GAMES.json e PC_GAMES.json e junta)
    const todosOsJogos = await carregarDados();

    if (todosOsJogos.length === 0) return;

    document.getElementById('loading').style.display = 'none';

    // 2. Agrupa os jogos por plataforma
    const grupos = {
        ps4: todosOsJogos.filter(j => obterPlataforma(j) === "ps4"),
        ps3: todosOsJogos.filter(j => obterPlataforma(j) === "ps3"),
        pc: todosOsJogos.filter(j => obterPlataforma(j) === "pc"),
        apps: todosOsJogos.filter(j => obterPlataforma(j) === "apps")
    };

    function criarCard(jogo) {
        const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/150';
        const idSeguro = encodeURIComponent(jogo.link);
        const plataforma = obterPlataforma(jogo);
        
        return `
            <a href="detalhes/detalhes.html?id=${idSeguro}" class="game-card ${plataforma}-card">
                <div class="cover-wrapper">
                    <img src="${imagemCapa}" class="game-cover" onerror="this.style.display='none'; this.parentElement.style.background='#222'">
                </div>
                <div class="game-info">
                    <div class="game-title">${jogo.name}</div>
                    <div class="download-btn">Ver Detalhes</div>
                </div>
            </a>
        `;
    }

    // 3. Renderiza as prateleiras na Home
    if (grupos.ps4.length > 0) {
        document.getElementById('prateleira-ps4').style.display = 'block';
        document.getElementById('lista-ps4').innerHTML = grupos.ps4.slice(0, 10).map(criarCard).join('');
    }
    if (grupos.ps3.length > 0) {
        document.getElementById('prateleira-ps3').style.display = 'block';
        document.getElementById('lista-ps3').innerHTML = grupos.ps3.slice(0, 10).map(criarCard).join('');
    }
    if (grupos.pc.length > 0) {
        document.getElementById('prateleira-pc').style.display = 'block';
        document.getElementById('lista-pc').innerHTML = grupos.pc.slice(0, 10).map(criarCard).join('');
    }
    if (grupos.apps.length > 0) {
        document.getElementById('prateleira-apps').style.display = 'block';
        document.getElementById('lista-apps').innerHTML = grupos.apps.slice(0, 10).map(criarCard).join('');
    }
}

if (document.getElementById('prateleira-ps4')) {
    iniciarHome();
}