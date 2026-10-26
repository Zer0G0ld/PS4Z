// data.js
let bancoDeDados = [];

async function carregarDados() {
    try {
        // Verifica se estamos em uma subpasta (como /detalhes/)
        // Se a URL contiver "/detalhes/", adiciona "../" antes do nome do arquivo
        const caminhoJson = window.location.pathname.includes('/detalhes/') ? '../GAMES.json' : 'GAMES.json';
        
        const resposta = await fetch(caminhoJson);
        if (!resposta.ok) throw new Error(`Arquivo não encontrado em: ${caminhoJson}`);
        
        const json = await resposta.json();
        
        bancoDeDados = Object.keys(json.DATA).map(link => {
            return { ...json.DATA[link], link: link };
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

function obterPlataforma(jogo) {
    const nome = jogo.name.toLowerCase();
    if (jogo.region === "APP") return "apps";
    if (nome.includes("ps3")) return "ps3";
    if (nome.includes("ps2")) return "ps2";
    if (nome.includes("psp")) return "psp";
    if (nome.includes("xbox")) return "xbox";
    if (nome.includes("pc") || nome.includes("steam")) return "pc";
    return "ps4"; // Padrão
}