async function carregarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const idJogo = urlParams.get('id');

    if (!idJogo) {
        document.getElementById('loading').innerText = "Nenhum jogo selecionado.";
        return;
    }

    try {
        // Usa a função global para buscar os dados
        const listaJogos = await buscarDadosJogos(); 
        
        const linkOriginal = decodeURIComponent(idJogo);
        const jogo = listaJogos.find(j => j.link === linkOriginal);

        if (!jogo) throw new Error("Jogo não encontrado.");

        document.getElementById('loading').style.display = 'none';
        const container = document.getElementById('conteudo-detalhes');
        container.style.display = 'flex';

        const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/400x600/1e1e1e/0070d1?text=Sem+Capa';

        container.innerHTML = `
            <div class="detalhes-container">
                <img src="${imagemCapa}" class="detalhes-capa" alt="Capa de ${jogo.name}">
                <div class="detalhes-info">
                    <h1>${jogo.name}</h1>
                    <div>
                        <span class="meta-tag">Região: ${jogo.region}</span>
                        <!-- Usa a função global para formatar o tamanho -->
                        <span class="meta-tag">Tamanho: ${formatarTamanho(jogo.size)}</span>
                        <span class="meta-tag">Versão: ${jogo.version}</span>
                    </div>
                    <p style="color: var(--text-muted); line-height: 1.6;">
                        ID do Jogo: ${jogo.title_id} <br>
                        Firmware Mínimo: ${jogo.min_fw || 'Desconhecido'}
                    </p>
                    <a href="${linkOriginal}" class="download-btn" download target="_blank">⬇ Baixar Jogo Agora</a>
                    <a href="../index.html" class="btn-voltar">Voltar para a Loja</a>
                </div>
            </div>
        `;
    } catch (erro) {
        console.error(erro);
        document.getElementById('loading').innerText = "Erro ao carregar os detalhes.";
    }
}

carregarDetalhes();