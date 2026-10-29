// data.js
let bancoDeDados = [];

async function carregarDados(plataforma = '') {
    try {
        // Sempre lê apenas o DATA_GAMES.json (catálogo completo da loja)
        // O GAMES.json da raiz é usado exclusivamente pelo FPKGi.
        const isSubpasta = window.location.pathname.includes('/detalhes/');
        const caminho = isSubpasta ? '../data/DATA_GAMES.json' : 'data/DATA_GAMES.json';

        const resposta = await fetch(caminho);
        if (!resposta.ok) {
            console.log(`Arquivo ${caminho} não encontrado.`);
            return [];
        }

        const json = await resposta.json();
        // Filtra apenas chaves que parecem URLs (evita erros com chaves de comentário)
        bancoDeDados = Object.keys(json.DATA)
            .filter(link => link.startsWith('http'))
            .map(link => {
                return { ...json.DATA[link], link: link };
            });

        return bancoDeDados;
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        return [];
    }
}

// Função utilitária global
function formatarTamanho(bytes) {
    if (!bytes) return "Desconhecido";
    if (bytes < 1073741824) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function obterPlataforma(jogo) {
    if (jogo.region === "PC") return "pc";

    const nome = jogo.name.toLowerCase();
    if (jogo.region === "APP") return "apps";

    if (nome.includes("ps5")) return "ps5";
    if (nome.includes("ps3")) return "ps3";
    if (nome.includes("ps2")) return "ps2";
    if (nome.includes("psp")) return "psp";
    if (nome.includes("xbox")) return "xbox";
    if (nome.includes("pc") || nome.includes("steam")) return "pc";

    return "ps4";
}