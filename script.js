// Variável global para guardar os jogos e permitir a busca
let todosOsJogos = [];

function formatarTamanho(bytes) {
    if (!bytes) return "Tamanho Desconhecido";
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + " GB";
}

// Função para renderizar os cards baseados na lista filtrada
function renderizarJogos(jogosParaMostrar) {
    const container = document.getElementById('lista-jogos');
    container.innerHTML = ''; // Limpa a tela

    if (jogosParaMostrar.length === 0) {
        container.innerHTML = '<p style="color: #aaa; margin-top: 20px;">Nenhum jogo encontrado com esse nome.</p>';
        return;
    }

    jogosParaMostrar.forEach(jogo => {
        const imagemCapa = jogo.cover_url || '';
        
        // Usamos encodeURIComponent para transformar o link num ID seguro para a URL
        const idSeguro = encodeURIComponent(jogo.link);
        
        const htmlCapa = imagemCapa 
            ? `<img src="${imagemCapa}" alt="Capa de ${jogo.name}" class="game-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex; align-items:center; justify-content:center; height:100%; color:#0070d1; font-size:4em; font-weight:bold; opacity:0.3\\'>🎮</div>'">`
            : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#0070d1; font-size:4em; opacity:0.3;">🎮</div>`;

        // O card agora é um link (a) que leva para detalhes.html
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
                    <div class="download-btn" style="background-color: #333; pointer-events: none;">Ver Detalhes</div>
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

        // Transforma o objeto JSON em um Array para facilitar a busca
        todosOsJogos = Object.keys(dadosJogos).map(link => {
            return { ...dadosJogos[link], link: link };
        });

        // Esconde o loading
        document.getElementById('loading').style.display = 'none';

        // Renderiza todos os jogos na tela inicial
        renderizarJogos(todosOsJogos);

        // Lógica da Barra de Busca
        document.getElementById('busca').addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = todosOsJogos.filter(jogo => 
                jogo.name.toLowerCase().includes(termo)
            );
            renderizarJogos(filtrados);
        });

    } catch (erro) {
        console.error(erro);
        const loading = document.getElementById('loading');
        loading.innerHTML = "Erro ao carregar o catálogo. Verifique o arquivo GAMES.json.";
        loading.classList.add('erro-msg');
    }
}

carregarJogos();