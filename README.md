# 🎮 Zer0 Loja PS4

Uma interface web simples, rápida e modular para hospedar e baixar jogos `.pkg` de PS4 diretamente pelo navegador do console ou PC. 

O projeto lê um arquivo `GAMES.json` e gera automaticamente uma vitrine com capas, tamanhos e botões de download direto.

## 🚀 Como funciona

O site é dividido em dois arquivos principais:
1. `index.html`: A interface visual (design escuro no estilo PlayStation, otimizado para navegação com controle).
2. `GAMES.json`: O banco de dados onde ficam os links, nomes, capas e tamanhos dos jogos.

## 🛠️ Como adicionar um novo jogo

Para adicionar um jogo, você **não precisa mexer no HTML**. Basta abrir o arquivo `GAMES.json` e adicionar um novo bloco dentro de `"DATA"`.

**⚠️ Regra de Ouro do Link:** O link do jogo **precisa ser direto** (terminar no arquivo `.pkg`). 
* Se estiver usando Hugging Face, troque o `/blob/` do link por `/resolve/`.
* Evite links que abrem páginas de espera (como MediaFire), a menos que o navegador consiga processar.

### Exemplo de novo jogo no `GAMES.json`:

```json
{
  "DATA": {
    "https://huggingface.co/datasets/SEU_USUARIO/ps4z/resolve/main/NomeDoArquivo.pkg": {
      "title_id": "CUSA12345",
      "region": "EUR",
      "name": "Nome do Jogo",
      "size": 15441985536,
      "version": "1.00",
      "release": "2024",
      "min_fw": "9.00",
      "cover_url": "https://link_da_imagem_de_capa.jpg"
    }
  }
}
```
*(Não esqueça de colocar uma vírgula `,` após o `}` se for adicionar mais de um jogo).*

## 💻 Como rodar o projeto localmente

Devido às regras de segurança dos navegadores (CORS), não basta dar dois cliques no `index.html`. Você precisa de um servidor local simples.

**No Linux / Debian / Windows (com Python):**
1. Abra o terminal na pasta do projeto.
2. Rode o comando:
   ```bash
   python3 -m http.server 8000
   ```
3. Acesse no navegador: `http://localhost:8000`

**No PS4:**
1. Certifique-se de que o PS4 e o PC estão na mesma rede.
2. Abra o navegador do PS4 e acesse o IP do seu PC: `http://IP_DO_SEU_PC:8000`

## ☁️ Hospedagem (GitHub Pages)

Como o site é composto apenas por arquivos estáticos (HTML e JSON), você pode hospedá-lo gratuitamente no **GitHub Pages**.
1. Suba o `index.html`, o `GAMES.json` e o `README.md` para um repositório público.
2. Vá em **Settings > Pages**.
3. Selecione a branch `main` e a pasta `/root`.
4. O GitHub vai gerar um link público (ex: `https://seu-usuario.github.io/seu-repo/`) que você pode acessar de qualquer lugar.

---
*Projeto desenvolvido para facilitar a vida da comunidade homebrew.*
