// loja.js
async function iniciarLoja() {
    const urlParams = new URLSearchParams(window.location.search);
    let plataformaFiltro = urlParams.get('p') || 'ps4';

    // Carrega todos os dados
    const jogos = await carregarDados();
    
    if (jogos.length === 0) {
        document.getElementById('loading').innerText = "Erro ao carregar os dados.";
        return;
    }

    // Marca o link ativo no menu
    document.querySelectorAll('.nav-plataformas a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-plataforma') === plataformaFiltro) {
            link.classList.add('active');
        }
    });

    // Títulos atualizados
    const titulos = {
        ps5: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 5',
        ps4: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 4',
        ps3: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 3',
        ps2: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 2',
        psp: '<i class="fa-brands fa-playstation"></i> Jogos de PSP',
        pc: '<i class="fa-brands fa-steam"></i> Jogos de PC / Steam',
        xbox: '<i class="fa-brands fa-xbox"></i> Jogos de XBOX',
        apps: '<i class="fa-solid fa-screwdriver-wrench"></i> Ferramentas do Sistema',
        themes: '<i class="fa-solid fa-palette"></i> Temas Dinâmicos',
        emulators: '<i class="fa-solid fa-gamepad"></i> Emuladores',
        dlc: '<i class="fa-solid fa-puzzle-piece"></i> DLCs (Conteúdos Extras)',
        updates: '<i class="fa-solid fa-arrow-up-from-bracket"></i> Updates e Patches'
    };

    document.getElementById('titulo-plataforma').innerHTML = titulos[plataformaFiltro] || 'Catálogo';
    document.getElementById('loading').style.display = 'none';

    const container = document.getElementById('grid-jogos');
    const btnToggle = document.getElementById('btn-toggle-view');

    // --- AQUI ESTÁ A MÁGICA DA SEPARAÇÃO ---
    let jogosDaPlataforma;

    if (plataformaFiltro === 'apps') {
        // Mostra apenas aplicativos
        jogosDaPlataforma = jogos.filter(j => obterTipo(j) === "app");
    } else if (plataformaFiltro === 'emulators') {
        // Mostra apenas emuladores
        jogosDaPlataforma = jogos.filter(j => obterTipo(j) === "emulator");
    } else if (plataformaFiltro === 'themes') {
        // Mostra apenas temas
        jogosDaPlataforma = jogos.filter(j => obterTipo(j) === "theme");
    } else if (plataformaFiltro === 'dlc') {
        // Mostra apenas as DLCs
        jogosDaPlataforma = jogos.filter(j => obterTipo(j) === "dlc");
    } else if (plataformaFiltro === 'updates') {
        // Mostra apenas Updates
        jogosDaPlataforma = jogos.filter(j => obterTipo(j) === "update");
    } else {
        // Se for PS4, PC, etc., mostra apenas os JOGOS BASE (game)
        jogosDaPlataforma = jogos.filter(j => 
            obterPlataforma(j) === plataformaFiltro && 
            obterTipo(j) === "game"
        );
    }
    // ----------------------------------------

    // Função que desenha os cards
    function renderizar(jogosFiltrados) {
        container.innerHTML = '';

        if (jogosFiltrados.length === 0) {
            container.innerHTML = '<p style="color: white; text-align: center; width: 100%;">Nenhum item encontrado nesta categoria.</p>';
            return;
        }

        jogosFiltrados.forEach(jogo => {
            const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/150';
            const idSeguro = encodeURIComponent(jogo.link);
            const plataforma = obterPlataforma(jogo);
            const tipo = obterTipo(jogo);

            container.innerHTML += `
                <a href="detalhes/detalhes.html?id=${idSeguro}" class="game-card ${plataforma}-card ${tipo}-card">
                    <div class="cover-wrapper">
                        <img src="${imagemCapa}" class="game-cover" onerror="this.style.display='none'; this.parentElement.style.background='#222'">
                    </div>
                    <div class="game-info">
                        <div class="game-title">${jogo.name}</div>
                        <div class="download-btn">Ver Detalhes</div>
                    </div>
                </a>
            `;
        });
    }

    // Renderiza a lista principal
    renderizar(jogosDaPlataforma);

    // Lógica do botão Grade/Lista
    const modoSalvo = localStorage.getItem('modoVisualizacao') || 'grid-view';
    aplicarModo(modoSalvo);

    btnToggle.addEventListener('click', () => {
        const modoAtual = container.classList.contains('grid-view') ? 'grid-view' : 'list-view';
        const novoModo = modoAtual === 'grid-view' ? 'list-view' : 'grid-view';
        
        aplicarModo(novoModo);
        localStorage.setItem('modoVisualizacao', novoModo); 
    });

    function aplicarModo(modo) {
        if (modo === 'grid-view') {
            container.classList.remove('list-view');
            container.classList.add('grid-view');
            btnToggle.innerHTML = '<i class="fa-solid fa-list"></i> Mudar para Lista';
        } else {
            container.classList.remove('grid-view');
            container.classList.add('list-view');
            btnToggle.innerHTML = '<i class="fa-solid fa-border-all"></i> Mudar para Grade';
        }
    }

    // Lógica da Barra de Busca
    document.getElementById('busca').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = jogosDaPlataforma.filter(jogo => 
            jogo.name.toLowerCase().includes(termo)
        );
        renderizar(filtrados);
    });
}

if (document.getElementById('grid-jogos')) {
    iniciarLoja();
}