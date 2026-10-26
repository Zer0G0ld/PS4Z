# 🎮 Zer0 Store - Hub Universal de Jogos

Uma plataforma de distribuição de jogos e ferramentas (PS4, PS3, PS2, PSP, PC, Xbox) construída com HTML, CSS e JavaScript puro. O sistema é compatível com o **FPKGi (PS4)**, mantendo o arquivo `GAMES.json` como fonte de verdade.

## 🏗️ Arquitetura do Projeto

O projeto foi refatorado para ser modular. Cada script tem uma responsabilidade única:

*   **`GAMES.json`**: O banco de dados central. Contém todos os jogos, links, capas e tamanhos. **Nunca edite os outros arquivos para adicionar jogos, use apenas este.**
*   **`data.js`**: O "cérebro" do sistema. Ele lê o `GAMES.json` e fornece funções utilitárias (como formatar tamanho e identificar a plataforma) para todas as outras páginas. **Nenhum outro arquivo faz `fetch` do JSON.**
*   **`index.html` (Home)**: A vitrine principal. Mostra as "prateleiras" horizontais (PS4, PS3, PC, etc.) usando o `hub.js`.
*   **`hub.js`**: Script exclusivo da Home. Ele lê os dados do `data.js` e cria os cards nas prateleiras.
*   **`loja.html` (Catálogo)**: Página que exibe a grade completa de uma plataforma específica (ex: todos os jogos de PS3).
*   **`loja.js`**: Script da página de catálogo. Ele lê o parâmetro `?p=ps4` da URL, filtra os jogos daquela plataforma e ativa a barra de busca.
*   **`detalhes/detalhes.html`**: A ficha do jogo (estilo Steam). Mostra capa grande, ID, tamanho e botão de download.
*   **`detalhes/script.js`**: Script que carrega os detalhes de um jogo específico baseado no ID passado na URL.

## 🛠️ Como adicionar um novo jogo

Como dito, o único arquivo que você precisa mexer é o `GAMES.json`.

**Regra de Ouro da Plataforma:** O sistema identifica a plataforma pelo **nome do jogo**.
*   Se o nome tiver **"PS3"**, ele vai para a prateleira de PS3.
*   Se tiver **"PC"** ou **"Steam"**, vai para a prateleira de PC.
*   Se não tiver nada, o padrão é **PS4**.
*   Ferramentas devem ter `"region": "APP"`.

**Exemplo de um jogo de PC:**
```json
"https://huggingface.co/.../Hollow-Knight.pkg": {
  "title_id": "PC-123",
  "region": "USA",
  "name": "Hollow Knight (PC)",
  "size": 15441985536,
  "version": "1.5",
  "release": "2017",
  "min_fw": "0",
  "cover_url": "https://link_da_capa.jpg"
}
```

## 💻 Como rodar localmente

Por questões de segurança (CORS), o navegador não permite que o `data.js` leia o `GAMES.json` se você abrir o `index.html` apenas clicando duas vezes. Use um servidor local:

```bash
python3 -m http.server 8000
```
Acesse `http://localhost:8000`.

## ☁️ Hospedagem

O projeto é 100% estático. Faça o upload de todos os arquivos para o **GitHub Pages** ou qualquer outro serviço de hospedagem estática. Certifique-se de que a pasta `detalhes` e o arquivo `GAMES.json` estão na raiz do repositório.