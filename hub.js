// hub.js
async function iniciarHome() {
    // 1. Carrega TUDO de uma vez (o data.js busca o GAMES.json e o DATA_GAMES.json)
    const todosOsJogos = await carregarDados();

    if (todosOsJogos.length === 0) return;

    document.getElementById('loading').style.display = 'none';

    // Referências aos elementos da tela
    const prateleirasContainer = document.querySelector('.prateleiras-container');
    const inputBusca = document.getElementById('busca');
    
    // Cria um container para os resultados da busca (inicialmente escondido)
    const containerResultados = document.createElement('div');
    containerResultados.id = 'resultados-busca';
    containerResultados.className = 'loja-container grid-view';
    containerResultados.style.display = 'none'; // Começa escondido
    prateleirasContainer.parentNode.appendChild(containerResultados);

    // 2. Função para criar o card (reutilizada)
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

    // 3. Renderiza as prateleiras (modo normal)
    function renderizarPrateleiras() {
        // Limpa os resultados da busca
        containerResultados.innerHTML = '';
        containerResultados.style.display = 'none';
        prateleirasContainer.style.display = 'block';

        // Agrupa e renderiza (igual ao código original)
        const grupos = {
            ps5: todosOsJogos.filter(j => obterPlataforma(j) === "ps5"),
            ps4: todosOsJogos.filter(j => obterPlataforma(j) === "ps4"),
            ps3: todosOsJogos.filter(j => obterPlataforma(j) === "ps3"),
            pc: todosOsJogos.filter(j => obterPlataforma(j) === "pc"),
            apps: todosOsJogos.filter(j => obterPlataforma(j) === "apps")
        };
        
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
    }

    // 4. Renderiza os resultados da busca (modo busca)
    function renderizarBusca(termo) {
        // Esconde as prateleiras normais
        prateleirasContainer.style.display = 'none';
        
        // Filtra TODOS os jogos
        const filtrados = todosOsJogos.filter(jogo => 
            jogo.name.toLowerCase().includes(termo)
        );

        // Mostra o container de resultados
        containerResultados.style.display = 'grid';
        
        if (filtrados.length === 0) {
            containerResultados.innerHTML = '<p style="color: white; text-align: center; width: 100%;">Nenhum jogo encontrado.</p>';
            return;
        }

        // Renderiza os resultados
        containerResultados.innerHTML = filtrados.map(criarCard).join('');
    }

    // 5. Configura o evento de busca
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo.length > 0) {
            renderizarBusca(termo);
        } else {
            // Se limpar a busca, volta ao normal
            renderizarPrateleiras();
        }
    });

    // 6. Inicia a tela com as prateleiras
    renderizarPrateleiras();
}

if (document.getElementById('prateleira-ps4')) {
    iniciarHome();
}