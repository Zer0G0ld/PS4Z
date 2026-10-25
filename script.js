// Variável global para guardar os jogos
let todosOsJogos = [];

// Função global para formatar tamanho (usada tanto na loja quanto nos detalhes)
function formatarTamanho(bytes) {
    if (!bytes) return "Tamanho Desconhecido";
    if (bytes < 1073741824) {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2) + " MB";
    }
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + " GB";
}

// Função global para buscar o JSON
async function buscarDadosJogos() {
    const resposta = await fetch('../GAMES.json');
    if (!resposta.ok) throw new Error("Arquivo GAMES.json não encontrado.");
    const json = await resposta.json();
    const dadosJogos = json.DATA;

    return Object.keys(dadosJogos).map(link => {
        return { ...dadosJogos[link], link: link };
    });
}

// Função exclusiva da LOJA (index.html)
async function iniciarLoja() {
    try {
        todosOsJogos = await buscarDadosJogos();
        document.getElementById('loading').style.display = 'none';

        const apps = todosOsJogos.filter(jogo => jogo.region === "APP");
        const jogos = todosOsJogos.filter(jogo => jogo.region !== "APP");

        // Função que renderiza os cards na tela da loja
        function renderizarSecao(jogosParaMostrar, idContainer) {
            const container = document.getElementById(idContainer);
            container.innerHTML = ''; 
            if (jogosParaMostrar.length === 0) return;

            jogosParaMostrar.forEach(jogo => {
                const imagemCapa = jogo.cover_url || '';
                const idSeguro = encodeURIComponent(jogo.link);
                
                const htmlCapa = imagemCapa 
                    ? `<img src="${imagemCapa}" class="game-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex; align-items:center; justify-content:center; height:100%; color:#0070d1; font-size:4em; opacity:0.3\\'>🎮</div>'">`
                    : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#0070d1; font-size:4em; opacity:0.3;">🎮</div>`;

                const isApp = jogo.region === "APP";
                const corBotao = isApp ? "background-color: #e63946;" : ""; 

                container.innerHTML += `
                    <a href="detalhes/detalhes.html?id=${idSeguro}" class="game-card" style="text-decoration: none; color: inherit;">
                        <div class="cover-wrapper">${htmlCapa}</div>
                        <div class="game-info">
                            <div>
                                <div class="game-title">${jogo.name}</div>
                                <div style="text-align:center;"><span class="game-size">${formatarTamanho(jogo.size)}</span></div>
                            </div>
                            <div class="download-btn" style="${corBotao} pointer-events: none;">Ver Detalhes</div>
                        </div>
                    </a>
                `;
            });
        }

        // Lógica de filtros e busca
        function renderizarTela(filtroAtual = "todos", termoBusca = "") {
            const termo = termoBusca.toLowerCase();
            let exibirApps = filtroAtual === "todos" || filtroAtual === "apps";
            let exibirJogos = filtroAtual === "todos" || filtroAtual === "jogos";

            let appsFiltrados = exibirApps ? apps.filter(j => j.name.toLowerCase().includes(termo)) : [];
            let jogosFiltrados = exibirJogos ? jogos.filter(j => j.name.toLowerCase().includes(termo)) : [];

            document.getElementById('lista-apps').innerHTML = ''; 
            document.getElementById('lista-jogos').innerHTML = '';
            
            if (appsFiltrados.length > 0) {
                document.getElementById('titulo-apps').style.display = 'block';
                renderizarSecao(appsFiltrados, 'lista-apps');
            } else { document.getElementById('titulo-apps').style.display = 'none'; }
            
            if (jogosFiltrados.length > 0) {
                document.getElementById('titulo-jogos').style.display = 'block';
                renderizarSecao(jogosFiltrados, 'lista-jogos');
            } else { document.getElementById('titulo-jogos').style.display = 'none'; }
        }

        renderizarTela();

        // Eventos
        const inputBusca = document.getElementById('busca');
        let filtroAtual = "todos";
        
        inputBusca.addEventListener('input', (e) => renderizarTela(filtroAtual, e.target.value));

        document.querySelectorAll('.filtro-btn').forEach(botao => {
            botao.addEventListener('click', (e) => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                filtroAtual = e.target.getAttribute('data-filtro');
                renderizarTela(filtroAtual, inputBusca.value);
            });
        });

    } catch (erro) {
        console.error(erro);
        document.getElementById('loading').innerHTML = "Erro ao carregar o catálogo.";
    }
}

// Só inicia a loja se estivermos na página index.html (que tem o elemento 'busca')
if (document.getElementById('busca')) {
    iniciarLoja();
}