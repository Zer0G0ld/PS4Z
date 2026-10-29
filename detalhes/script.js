// detalhes/script.js
async function carregarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const idJogo = urlParams.get('id');

    if (!idJogo) {
        document.getElementById('loading').innerText = "Nenhum jogo selecionado.";
        return;
    }

    try {
        // Busca os dados apenas do DATA_GAMES.json agora
        const jogos = await carregarDados();
        
        const linkOriginal = decodeURIComponent(idJogo);
        const jogo = jogos.find(j => j.link === linkOriginal);

        if (!jogo) throw new Error("Jogo não encontrado no banco de dados.");

        document.getElementById('loading').style.display = 'none';
        const container = document.getElementById('conteudo');
        container.style.display = 'flex';

        const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/400x600/1b2838/66c0f4?text=Sem+Capa';
        
        const banner = document.getElementById('steam-banner');
        banner.style.backgroundImage = `url('${imagemCapa}')`;

        // Monta a lista de DLCs/Patches, se existirem
        let htmlDlcs = '';
        if (jogo.dlcs && jogo.dlcs.length > 0) {
            htmlDlcs = `
                <div class="steam-dlc-section">
                    <h3><i class="fa-solid fa-puzzle-piece"></i> Updates & DLCs</h3>
                    <div class="dlc-list">
                        ${jogo.dlcs.map(dlc => `
                            <div class="dlc-card">
                                <div class="dlc-info">
                                    <span class="dlc-name">${dlc.name}</span>
                                    <span class="dlc-meta">v${dlc.version} • ${formatarTamanho(dlc.size)}</span>
                                </div>
                                <a href="${dlc.link}" class="btn-dlc" target="_blank"><i class="fa-solid fa-download"></i> Baixar</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Monta o HTML com os ícones do Font Awesome
        container.innerHTML = `
            <div class="steam-header">
                <h1>${jogo.name}</h1>
                <div class="steam-tags">
                    <span class="steam-tag">Região: ${jogo.region}</span>
                    <span class="steam-tag">Versão: ${jogo.version}</span>
                    <span class="steam-tag">Lançamento: ${jogo.release}</span>
                </div>
            </div>

            <div class="steam-content">
                <div class="steam-cover-col">
                    <img src="${imagemCapa}" class="steam-cover-img" alt="${jogo.name}">
                </div>
                <div class="steam-info-col">
                    <p class="steam-description">
                        Baixe ${jogo.name} para o seu dispositivo. Certifique-se de ter espaço suficiente no seu HD e o firmware atualizado.
                    </p>
                    <ul class="steam-meta-list">
                        <li><span>ID do Jogo:</span> <span>${jogo.title_id}</span></li>
                        <li><span>Firmware Mínimo:</span> <span>${jogo.min_fw || 'Desconhecido'}</span></li>
                        <li><span>Tamanho Base:</span> <span>${formatarTamanho(jogo.size)}</span></li>
                    </ul>

                    ${htmlDlcs} <!-- AQUI ENTRAM AS DLCs E PATCHES -->

                    <div class="steam-actions">
                        <a href="${linkOriginal}" class="btn-steam-green" download target="_blank"><i class="fa-solid fa-download"></i> Baixar Jogo Base</a>
                        <a href="../index.html" class="btn-steam-blue"><i class="fa-solid fa-arrow-left"></i> Voltar</a>
                    </div>
                </div>
            </div>
        `;
    } catch (erro) {
        console.error(erro);
        document.getElementById('loading').innerText = "Erro ao carregar detalhes. Verifique o console.";
        document.getElementById('loading').style.color = "#e63946";
    }
}

carregarDetalhes();