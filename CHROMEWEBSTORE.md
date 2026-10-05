# Preparação para a Chrome Web Store

Índice de publicação para a versão 3.1.0, baseado na [orientação oficial do Google para desenvolver com IA](https://developer.chrome.com/docs/extensions/ai/build-with-ai). As instruções detalhadas permanecem nos documentos abaixo.

## Finalidade e permissões

Uma finalidade: limpar o histórico da própria conta no X, incluindo posts, respostas, reposts, likes e bookmarks. Os modos de likes e bookmarks preservam os posts e permitem filtro opcional pelos avisos explícitos de conteúdo adulto do X, sem análise de imagens ou IA.

O [manifesto](extension/manifest.json) usa Manifest V3 e apenas `activeTab` e `scripting`. A extensão injeta código local após invocação na aba; não usa código remoto, anúncios, analytics ou acesso permanente aos sites. Os novos modos não adicionam permissões.

## Fontes de publicação

- [Instalação, upload e submissão](docs/CHROME-WEB-STORE.md).
- [Ficha, finalidade, permissões e instruções para revisão](docs/STORE-LISTING.md).
- [Política de privacidade](extension/privacy.html).
- [Verificação e suas limitações](docs/VALIDATION.md).
- `npm run package`: gera `dist/tweet-cleaner-3.1.0.zip` com manifesto na raiz.

## Estado

Pacote e documentação preparados. Testes automatizados e demonstração usam dados fictícios. Instalação e teste na extensão com uma conta de teste do X: `[DADO A CONFIRMAR]`. Os endpoints internos podem mudar.

Nome e contato público do publicador, URL HTTPS da política, categoria e países: `[DADO A CONFIRMAR]`. Nenhuma submissão, pagamento ou hospedagem foi executada.

O guia do Google sugere skills e Chrome DevTools MCP para instalar, recarregar e inspecionar extensões durante o desenvolvimento. Eles não são dependências do Tweet Cleaner nem foram instalados por este projeto.
