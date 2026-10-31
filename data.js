// data.js
let bancoDeDados = [];

async function carregarDados(plataforma = '') {
    try {
        const isSubpasta = window.location.pathname.includes('/detalhes/');
        const basePath = isSubpasta ? '../data/' : 'data/';

        // CORRIGIDO: O nome do arquivo de temas é DATA_THEMES.json
        const arquivos = [
            'DATA_GAMES.json',
            'DATA_APPS.json',
            'DATA_THEMES.json', 
            'DATA_DLC.json',
            'DATA_UPDATE.json',
            'DATA_EMULATORS.json'
        ];

        const promessas = arquivos.map(arquivo => 
            fetch(basePath + arquivo)
                .then(res => res.ok ? res.json() : { DATA: {} })
                .catch(() => ({ DATA: {} }))
        );

        const resultados = await Promise.all(promessas);

        bancoDeDados = [];
        
        resultados.forEach(json => {
            if (json && json.DATA) {
                const jogosDoArquivo = Object.keys(json.DATA)
                    .filter(link => link.startsWith('http'))
                    .map(link => {
                        return { ...json.DATA[link], link: link };
                    });
                bancoDeDados = bancoDeDados.concat(jogosDoArquivo);
            }
        });

        return bancoDeDados;
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        return [];
    }
}

function formatarTamanho(bytes) {
    if (!bytes) return "Desconhecido";
    if (bytes < 1073741824) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

// Função atualizada para identificar corretamente todas as categorias
function obterPlataforma(jogo) {
    if (!jogo || !jogo.name) return "ps4";
    
    const nome = jogo.name.toLowerCase();
    const regiao = (jogo.region || "").toUpperCase();

    if (regiao === "APP" || nome.includes("[app]")) return "apps";
    if (regiao === "PC" || nome.includes("(pc)") || nome.includes("steam")) return "pc";
    
    // Identifica Temas
    if (regiao === "THEME" || nome.includes("[theme]") || nome.includes("tema")) return "themes";
    
    // Identifica Emuladores (adicionei mais palavras-chave)
    if (nome.includes("[emulador]") || nome.includes("[emulator]") || nome.includes("retroarch") || nome.includes("mgba") || nome.includes("emulador")) return "emulators";
    
    // Identifica DLCs e Updates
    if (nome.includes("[dlc]") || nome.includes("dlc:")) return "dlc";
    if (nome.includes("[update]") || nome.includes("update v") || nome.includes("patch")) return "updates";

    if (nome.includes("ps5")) return "ps5";
    if (nome.includes("ps3")) return "ps3";
    if (nome.includes("ps2")) return "ps2";
    if (nome.includes("psp")) return "psp";
    if (nome.includes("xbox")) return "xbox";

    return "ps4";
}