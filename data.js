// data.js
let bancoDeDados = [];

async function carregarDados(plataforma = '') {
    try {
        // 1. Define quais arquivos tentar, baseado na plataforma
        let arquivosParaTentar = [];
        
        if (plataforma === 'ps4' || plataforma === 'apps') {
            // PS4 e Apps ficam no JSON exclusivo (compatível com FPKGi)
            arquivosParaTentar = ['GAMES.json'];
        } else if (plataforma) {
            // PS3, PS2, PSP, XBOX, PC caem no JSON geral
            arquivosParaTentar = ['data/DATA_GAMES.json']; 
        } else {
            // Se não especificou (ex: página de detalhes), tenta todos
            arquivosParaTentar = ['GAMES.json', 'data/DATA_GAMES.json'];
        }

        // Verifica se estamos em uma subpasta (como /detalhes/)
        const isSubpasta = window.location.pathname.includes('/detalhes/');
        let todosOsDados = [];

        // 2. Loop para buscar cada arquivo necessário
        for (const arquivo of arquivosParaTentar) {
            const caminho = isSubpasta ? `../${arquivo}` : arquivo;
            
            try {
                const resposta = await fetch(caminho);
                if (resposta.ok) {
                    const json = await resposta.json();
                    const dados = Object.keys(json.DATA).map(link => {
                        return { ...json.DATA[link], link: link };
                    });
                    todosOsDados = [...todosOsDados, ...dados];
                }
            } catch (e) {
                console.log(`Arquivo ${arquivo} não encontrado ou vazio.`);
            }
        }

        bancoDeDados = todosOsDados;
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
    if (nome.includes("ps3")) return "ps3";
    if (nome.includes("ps2")) return "ps2";
    if (nome.includes("psp")) return "psp";
    if (nome.includes("xbox")) return "xbox";
    if (nome.includes("pc") || nome.includes("steam")) return "pc";
    
    return "ps4"; // Padrão
}