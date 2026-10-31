// hub.js
async function iniciarHome() {
    const todosOsJogos = await carregarDados();

    if (todosOsJogos.length === 0) return;

    document.getElementById('loading').style.display = 'none';

    const prateleirasContainer = document.querySelector('.prateleiras-container');
    const inputBusca = document.getElementById('busca');
    
    const containerResultados = document.createElement('div');
    containerResultados.id = 'resultados-busca';
    containerResultados.className = 'loja-container grid-view';
    containerResultados.style.display = 'none';
    prateleirasContainer.parentNode.appendChild(containerResultados);

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

    function renderizarPrateleiras() {
        containerResultados.innerHTML = '';
        containerResultados.style.display = 'none';
        prateleirasContainer.style.display = 'block';

        const grupos = {
            ps5: todosOsJogos.filter(j => obterPlataforma(j) === "ps5"),
            ps4: todosOsJogos.filter(j => obterPlataforma(j) === "ps4"),
            ps3: todosOsJogos.filter(j => obterPlataforma(j) === "ps3"),
            pc: todosOsJogos.filter(j => obterPlataforma(j) === "pc"),
            apps: todosOsJogos.filter(j => obterPlataforma(j) === "apps"),
            emulators: todosOsJogos.filter(j => obterPlataforma(j) === "emulators"),
            themes: todosOsJogos.filter(j => obterPlataforma(j) === "themes"),
            dlc: todosOsJogos.filter(j => obterPlataforma(j) === "dlc"),
            updates: todosOsJogos.filter(j => obterPlataforma(j) === "updates")
        };

        // Renderiza todas as prateleiras se houver itens
        if (grupos.emulators.length > 0) {
            document.getElementById('prateleira-emulators').style.display = 'block';
            document.getElementById('lista-emulators').innerHTML = grupos.emulators.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.ps5.length > 0) {
            document.getElementById('prateleira-ps5').style.display = 'block';
            document.getElementById('lista-ps5').innerHTML = grupos.ps5.slice(0, 10).map(criarCard).join('');
        }
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
        if (grupos.themes.length > 0) {
            document.getElementById('prateleira-themes').style.display = 'block';
            document.getElementById('lista-themes').innerHTML = grupos.themes.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.dlc.length > 0) {
            document.getElementById('prateleira-dlc').style.display = 'block';
            document.getElementById('lista-dlc').innerHTML = grupos.dlc.slice(0, 10).map(criarCard).join('');
        }
        if (grupos.updates.length > 0) {
            document.getElementById('prateleira-updates').style.display = 'block';
            document.getElementById('lista-updates').innerHTML = grupos.updates.slice(0, 10).map(criarCard).join('');
        }
    }

    function renderizarBusca(termo) {
        prateleirasContainer.style.display = 'none';
        const filtrados = todosOsJogos.filter(jogo => jogo.name.toLowerCase().includes(termo));
        containerResultados.style.display = 'grid';
        
        if (filtrados.length === 0) {
            containerResultados.innerHTML = '<p style="color: white; text-align: center; width: 100%;">Nenhum item encontrado.</p>';
            return;
        }
        containerResultados.innerHTML = filtrados.map(criarCard).join('');
    }

    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        if (termo.length > 0) {
            renderizarBusca(termo);
        } else {
            renderizarPrateleiras();
        }
    });

    renderizarPrateleiras();
}

if (document.getElementById('prateleira-ps4')) {
    iniciarHome();
}