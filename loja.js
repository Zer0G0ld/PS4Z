// loja.js
async function iniciarLoja() {
    const jogos = await carregarDados();
    if (jogos.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    let plataformaFiltro = urlParams.get('p') || 'ps4';

    // Marca o link ativo no menu
    document.querySelectorAll('.nav-plataformas a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-plataforma') === plataformaFiltro) {
            link.classList.add('active');
        }
    });

    // Títulos com ícones Font Awesome
    const titulos = {
        ps5: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 5',
        ps4: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 4',
        ps3: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 3',
        ps2: '<i class="fa-brands fa-playstation"></i> Jogos de PlayStation 2',
        psp: '<i class="fa-brands fa-playstation"></i> Jogos de PSP',
        pc: '<i class="fa-brands fa-steam"></i> Jogos de PC / Steam',
        xbox: '<i class="fa-brands fa-xbox"></i> Jogos de XBOX',
        apps: '<i class="fa-solid fa-screwdriver-wrench"></i> Ferramentas do Sistema'
    };

    document.getElementById('titulo-plataforma').innerHTML = titulos[plataformaFiltro] || 'Catálogo';
    document.getElementById('loading').style.display = 'none';

    const container = document.getElementById('grid-jogos');
    const btnToggle = document.getElementById('btn-toggle-view');

    // --- LÓGICA DO LOCAL STORAGE ---
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

    // Função que desenha os cards
    function renderizar(jogosFiltrados) {
        container.innerHTML = '';

        if (jogosFiltrados.length === 0) {
            container.innerHTML = '<p style="color: white;">Nenhum jogo encontrado.</p>';
            return;
        }

        jogosFiltrados.forEach(jogo => {
            const imagemCapa = jogo.cover_url || 'https://via.placeholder.com/150';
            const idSeguro = encodeURIComponent(jogo.link);
            const plataforma = obterPlataforma(jogo);

            container.innerHTML += `
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
        });
    }

    const jogosDaPlataforma = jogos.filter(j => obterPlataforma(j) === plataformaFiltro);
    renderizar(jogosDaPlataforma);

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