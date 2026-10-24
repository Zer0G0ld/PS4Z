// Variável global para guardar os jogos e permitir a busca
let todosOsJogos = [];

function formatarTamanho(bytes) {
    if (!bytes) return "Tamanho Desconhecido";
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + " GB";
}

// Única função de renderização (resolve o problema de ter duas funções iguais)
function renderizarSecao(jogosParaMostrar, idContainer) {
    const container = document.getElementById(idContainer);
    container.innerHTML = ''; 

    if (jogosParaMostrar.length === 0) {
        // Se for a busca e não achar nada, mostra o aviso
        if(idContainer === 'lista-jogos') {
            container.innerHTML = '<p style="color: #aaa; margin-top: 20px;">Nenhum item encontrado.</p>';
        }
        return;
    }

    jogosParaMostrar.forEach(jogo => {
        const imagemCapa = jogo.cover_url || '';
        const idSeguro = encodeURIComponent(jogo.link);
        
        const htmlCapa = imagemCapa 
            ? `<img src="${imagemCapa}" alt="Capa de ${jogo.name}" class="game-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex; align-items:center; justify-content:center; height:100%; color:#0070d1; font-size:4em; font-weight:bold; opacity:0.3\\'>🎮</div>'">`
            : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#0070d1; font-size:4em; opacity:0.3;">🎮</div>`;

        // Verifica se é APP para mudar a cor do botão
        const isApp = jogo.region === "APP";
        const corBotao = isApp ? "background-color: #e63946;" : ""; 

        // Note que o link agora aponta para "detalhes/detalhes.html"
        const cardHTML = `
            <a href="detalhes/detalhes.html?id=${idSeguro}" class="game-card" style="text-decoration: none; color: inherit;">
                <div class="cover-wrapper">
                    ${htmlCapa}
                </div>
                <div class="game-info">
                    <div>
                        <div class="game-title">${jogo.name}</div>
                        <div style="text-align:center;"><span class="game-size">${formatarTamanho(jogo.size)}</span></div>
                    </div>
                    <div class="download-btn" style="${corBotao} pointer-events: none;">Ver Detalhes</div>
                </div>
            </a>
        `;
        
        container.innerHTML += cardHTML;
    });
}

async function carregarJogos() {
    try {
        const resposta = await fetch('GAMES.json');
        if (!resposta.ok) throw new Error("Arquivo GAMES.json não encontrado.");
        
        const json = await resposta.json();
        const dadosJogos = json.DATA;

        todosOsJogos = Object.keys(dadosJogos).map(link => {
            return { ...dadosJogos[link], link: link };
        });

        document.getElementById('loading').style.display = 'none';

        // Separa os Apps dos Jogos globalmente
        const apps = todosOsJogos.filter(jogo => jogo.region === "APP");
        const jogos = todosOsJogos.filter(jogo => jogo.region !== "APP");

        // Função que renderiza a tela com base no filtro ativo e na busca
        function renderizarTela(filtroAtual = "todos", termoBusca = "") {
            const termo = termoBusca.toLowerCase();
            
            // 1. Aplica o Filtro
            let exibirApps = filtroAtual === "todos" || filtroAtual === "apps";
            let exibirJogos = filtroAtual === "todos" || filtroAtual === "jogos";

            // 2. Aplica a Busca (se houver texto digitado)
            let appsFiltrados = exibirApps ? apps.filter(jogo => jogo.name.toLowerCase().includes(termo)) : [];
            let jogosFiltrados = exibirJogos ? jogos.filter(jogo => jogo.name.toLowerCase().includes(termo)) : [];

            // 3. Atualiza os títulos e listas na tela
            document.getElementById('lista-apps').innerHTML = ''; 
            document.getElementById('lista-jogos').innerHTML = '';
            
            if (appsFiltrados.length > 0) {
                document.getElementById('titulo-apps').style.display = 'block';
                renderizarSecao(appsFiltrados, 'lista-apps');
            } else {
                document.getElementById('titulo-apps').style.display = 'none';
            }
            
            if (jogosFiltrados.length > 0) {
                document.getElementById('titulo-jogos').style.display = 'block';
                renderizarSecao(jogosFiltrados, 'lista-jogos');
            } else {
                document.getElementById('titulo-jogos').style.display = 'none';
            }

            // Se não achar nada em lugar nenhum
            if (appsFiltrados.length === 0 && jogosFiltrados.length === 0) {
                document.getElementById('lista-jogos').innerHTML = '<p style="color: #aaa; margin-top: 20px;">Nenhum item encontrado.</p>';
            }
        }

        // Renderiza tudo na tela inicial
        renderizarTela();

        // ==========================================
        // Eventos da Barra de Busca e Botões de Filtro
        // ==========================================
        
        const inputBusca = document.getElementById('busca');
        const botoesFiltro = document.querySelectorAll('.filtro-btn');
        
        let filtroAtual = "todos";

        // Evento ao digitar na busca
        inputBusca.addEventListener('input', (e) => {
            renderizarTela(filtroAtual, e.target.value);
        });

        // Evento ao clicar nos botões de filtro
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', (e) => {
                // Remove a classe 'active' de todos os botões
                botoesFiltro.forEach(b => b.classList.remove('active'));
                
                // Adiciona a classe 'active' no botão clicado
                e.target.classList.add('active');
                
                // Pega o filtro do botão (data-filtro="todos", "jogos", etc)
                filtroAtual = e.target.getAttribute('data-filtro');
                
                // Renderiza a tela com o novo filtro e o termo de busca atual
                renderizarTela(filtroAtual, inputBusca.value);
            });
        });

    } catch (erro) {
        console.error(erro);
        const loading = document.getElementById('loading');
        loading.innerHTML = "Erro ao carregar o catálogo.";
        loading.classList.add('erro-msg');
    }
}

// Inicia a aplicação (Essa linha é obrigatória!)
carregarJogos();