// detalhes/script.js
async function carregarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const idJogo = urlParams.get('id');

    if (!idJogo) {
        document.getElementById('loading').innerText = "Nenhum jogo selecionado.";
        return;
    }

    try {
        const todosOsJogos = await carregarDados();
        
        const linkOriginal = decodeURIComponent(idJogo);
        const jogo = todosOsJogos.find(j => j.link === linkOriginal);

        if (!jogo) throw new Error("Item não encontrado no banco de dados.");

        document.getElementById('loading').style.display = 'none';
        const container = document.getElementById('conteudo');
        container.style.display = 'flex';

        const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/400x600/1b2838/66c0f4?text=Sem+Capa';
        
        const banner = document.getElementById('steam-banner');
        banner.style.backgroundImage = `linear-gradient(to bottom, rgba(15,15,17,0.3), rgba(15,15,17,1)), url('${imagemCapa}')`;

        let htmlExtras = '';
        
        // Pega o nome base do jogo para fazer o cruzamento de dados
        const nomeBaseJogo = jogo.name.split(' [')[0].split(' (')[0].trim().toLowerCase();

        const extrasRelacionados = todosOsJogos.filter(item => {
            if (item.link === jogo.link) return false;
            if (item.title_id === jogo.title_id) return true;
            if (item.name.toLowerCase().includes(nomeBaseJogo)) return true;
            return false;
        });

        if (extrasRelacionados.length > 0) {
            const updates = extrasRelacionados.filter(i => obterTipo(i) === 'update');
            const dlcs = extrasRelacionados.filter(i => obterTipo(i) === 'dlc');
            
            let htmlLista = '';

            // FUNÇÃO MÁGICA QUE LIMPA O NOME (Retira o nome do jogo base do título da DLC)
            const limparNome = (nomeCompleto) => {
                let nomeLimpo = nomeCompleto.replace(new RegExp(nomeBaseJogo, 'gi'), '');
                nomeLimpo = nomeLimpo.replace(/^[\s\-\(\)\[\]:]+|[\s\-\(\)\[\]:]+$/g, '');
                return nomeLimpo || nomeCompleto; 
            };

            if (updates.length > 0) {
                htmlLista += `<h4>Updates Oficiais</h4>`;
                htmlLista += updates.map(ext => `
                    <div class="dlc-card">
                        <div class="dlc-info">
                            <span class="dlc-name">${limparNome(ext.name)}</span>
                            <span class="dlc-meta">v${ext.version} • ${formatarTamanho(ext.size)}</span>
                        </div>
                        <a href="${ext.link}" class="btn-dlc" target="_blank"><i class="fa-solid fa-download"></i> Baixar</a>
                    </div>
                `).join('');
            }

            if (dlcs.length > 0) {
                htmlLista += `<h4>Conteúdos Extras (DLCs)</h4>`;
                htmlLista += dlcs.map(ext => `
                    <div class="dlc-card">
                        <div class="dlc-info">
                            <span class="dlc-name">${limparNome(ext.name)}</span>
                            <span class="dlc-meta">v${ext.version} • ${formatarTamanho(ext.size)}</span>
                        </div>
                        <a href="${ext.link}" class="btn-dlc" target="_blank"><i class="fa-solid fa-download"></i> Baixar</a>
                    </div>
                `).join('');
            }

            htmlExtras = `
                <div class="steam-dlc-section">
                    <h3><i class="fa-solid fa-box-open"></i> Arquivos Adicionais para este Jogo</h3>
                    <div class="dlc-list">
                        ${htmlLista}
                    </div>
                </div>
            `;
        }

        let tagTipo = '';
        if (obterTipo(jogo) === 'app') tagTipo = 'Ferramenta / App';
        else if (obterTipo(jogo) === 'theme') tagTipo = 'Tema';
        else if (obterTipo(jogo) === 'emulator') tagTipo = 'Emulador';
        else if (obterTipo(jogo) === 'dlc') tagTipo = 'DLC';
        else if (obterTipo(jogo) === 'update') tagTipo = 'Update';
        else tagTipo = 'Jogo Base';

        container.innerHTML = `
            <div class="steam-header">
                <h1>${jogo.name}</h1>
                <div class="steam-tags">
                    <span class="steam-tag">Região: ${jogo.region}</span>
                    <span class="steam-tag" style="background: rgba(139, 195, 74, 0.2); color: #8bc34a; border-color: #8bc34a;">${tagTipo}</span>
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
                        Baixe ${jogo.name} para o seu dispositivo. Certifique-se de ter espaço suficiente no seu HD e o firmware mínimo atualizado.
                    </p>
                    <ul class="steam-meta-list">
                        <li><span>ID do Sistema:</span> <span>${jogo.title_id || 'N/A'}</span></li>
                        <li><span>Firmware Mínimo:</span> <span>${jogo.min_fw || 'Desconhecido'}</span></li>
                        <li><span>Tamanho do Arquivo:</span> <span>${formatarTamanho(jogo.size)}</span></li>
                    </ul>

                    ${htmlExtras} <!-- AQUI ENTRAM AS DLCs E PATCHES VINCULADAS -->

                    <div class="steam-actions">
                        <a href="${linkOriginal}" class="btn-steam-green" download target="_blank"><i class="fa-solid fa-download"></i> Fazer Download</a>
                        <a href="../index.html" class="btn-steam-blue"><i class="fa-solid fa-arrow-left"></i> Voltar à Loja</a>
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