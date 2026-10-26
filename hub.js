// hub.js
async function iniciarHome() {
    const jogos = await carregarDados();
    if (jogos.length === 0) return;

    document.getElementById('loading').style.display = 'none';

    // Agrupa os jogos por plataforma
    const grupos = {
        ps4: jogos.filter(j => obterPlataforma(j) === "ps4"),
        ps3: jogos.filter(j => obterPlataforma(j) === "ps3"),
        pc: jogos.filter(j => obterPlataforma(j) === "pc"),
        apps: jogos.filter(j => obterPlataforma(j) === "apps")
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

    // Renderiza as prateleiras na Home
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