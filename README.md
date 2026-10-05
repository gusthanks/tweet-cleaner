# Tweet Cleaner

Extensão gratuita para limpar posts, respostas, reposts, bookmarks e likes do X, com painel em português, prévia, pausa e retomada local. Sem anúncios, assinatura ou teto comercial de itens.

Derivada de [backzso/tweetdelete](https://github.com/backzso/tweetdelete), sob licença MIT. Ferramenta independente, sem vínculo com X ou Google.

## Instalar a extensão no Chrome

1. Use a pasta pronta `dist/tweet-cleaner` ou gere com `npm run package`.
2. Abra `chrome://extensions` e ative **Modo do desenvolvedor**.
3. Clique **Carregar sem compactação** e selecione a pasta `dist/tweet-cleaner`, que contém `manifest.json`.
4. Fixe o ícone da extensão. Abra o próprio perfil, **Histórico → Likes** (`/i/history/likes`) ou a página Bookmarks no X.
5. Clique no ícone e em **Abrir painel nesta aba**.

O pacote ZIP é para envio à loja; para instalação local, selecione a pasta extraída. Nenhuma exclusão começa ao instalar ou abrir o painel.

## Usar o painel

1. Em **O que limpar**, escolha posts/reposts da página, posts do arquivo, bookmarks ou likes. Ao abrir o painel em Bookmarks ou Likes, o modo correspondente já vem selecionado.
2. **Prévia sem apagar** começa marcada. Clique **Encontrar posts**, **Encontrar bookmarks** ou **Encontrar likes** para salvar IDs sem alterar o X. Você pode **Parar** antes de terminar; a lista parcial fica salva.
3. Desmarque a prévia e clique **Excluir e continuar**, **Remover bookmarks** ou **Remover likes**. Confirme a frase que identifica a ação e a conta conectada. A execução usa os IDs já encontrados e depois continua buscando na página. Sem lista salva, busca e processa diretamente.
4. Deixe a aba aberta e o computador acordado. **Pausar**, **Retomar** e **Parar** respondem também durante a espera pelo X. Uma requisição já enviada pode terminar após parar.
5. O botão de minimizar conserva um controle com o estado e a contagem da rodada. Clique nele para reabrir.
6. Exporte o relatório se precisar. Ao terminar, atualize a página para conferir os restantes. Para posts, execute também nas abas **Respostas** e **Reposts**. A troca de páginas é manual.

Os números principais descrevem a execução atual; **ações salvas** é o histórico acumulado no navegador. Não há uma porcentagem de conclusão: a página não fornece o total acessível de posts. Uma rodada sem novos IDs não comprova que todo o histórico foi removido.

A ferramenta não impõe o teto de 500. As requisições são sequenciais, com no mínimo 800 ms entre itens, além do tempo de rede, rolagem e esperas. HTTP 429 exibe uma contagem regressiva, aguarda o reset informado pelo X (ou 15 minutos quando ausente) e tenta o mesmo ID novamente. Isso não contorna os limites nem garante ausência de restrições da conta.

## Bookmarks e likes

Abra **Bookmarks** pelo menu do X (`/i/bookmarks`) ou **Histórico → Likes** (`/i/history/likes`) e invoque a extensão. A rota antiga de Likes no próprio perfil (`/seu_usuario/likes`) também continua aceita. Esses modos retiram salvos ou curtidas; **não apagam os posts**, mesmo quando você é o autor. O painel confere a conta conectada, a página e o tipo de ação antes de cada requisição. Pastas de bookmarks não são atendidas; use a página principal de salvos.

A confirmação é específica: `REMOVER BOOKMARKS @sua_conta` ou `REMOVER LIKES @sua_conta`. A frase de exclusão de posts não autoriza essas operações. Prévia, pendentes e histórico ficam separados por modo; uma lista de posts nunca é usada para remover likes ou bookmarks.

Se você curtir ou salvar novamente um post já processado, ele poderá ser reconsiderado numa nova rodada. Atualize a página antes de retomar para refletir o estado atual dos marcadores. O arquivo de posts não é utilizado para likes ou bookmarks. A busca depende dos itens que o X carrega e não garante alcançar todo o histórico.

Para limpar todos os bookmarks, o próprio X oferece uma ação no menu de três pontos da página de salvos. Veja as [instruções oficiais de bookmarks](https://help.x.com/en/using-x/bookmarks). O modo da extensão permite prévia e acompanhamento por item.

### Somente conteúdo adulto

Nos modos **Likes** e **Bookmarks**, marque **Somente conteúdo adulto** antes de iniciar. O filtro começa desmarcado. Só entram itens cujo aviso de mídia do X tenha o título explícito **Content warning: Adult Content** ou **Aviso de conteúdo: Conteúdo adulto**, em português ou inglês, associado ao controle Mostrar/Show. A ferramenta não abre a mídia, analisa imagens ou envia conteúdo para uma IA.

Avisos genéricos de conteúdo sensível, violência, nudez, nomes de contas, texto do post e avisos dentro de uma citação não são suficientes. Sem o aviso adulto reconhecido, o item fica intacto. Se suas configurações exibirem mídia sem avisos, esses itens não serão encontrados pelo filtro. A classificação do X pode conter erros; o filtro segue o rótulo exibido, conforme a [política de conteúdo adulto do X](https://help.x.com/pt/rules-and-policies/adult-content).

Faça uma prévia com o filtro ativo. A lista filtrada fica separada da lista geral e registra somente ID, operação e a indicação local de aviso adulto. Uma lista geral salva não pode ser usada na execução filtrada. Para remover, desmarque a prévia e confirme `REMOVER LIKES ADULTOS @sua_conta` ou `REMOVER BOOKMARKS ADULTOS @sua_conta`. Após recarregar, selecione novamente o filtro para recuperar seus pendentes filtrados. O filtro fica bloqueado enquanto a rodada está ativa e não se aplica à exclusão de posts.

## Arquivo local e retomada

Selecione `data/tweets.js` ou arquivos divididos `tweets-part*.js`. Vários arquivos são deduplicados. São lidos como JSON, nunca executados nem enviados a um serviço do desenvolvedor. Todas as entradas são processadas, incluindo respostas e reposts, por seus IDs de exportação. Reposts restantes podem exigir uma rodada na aba Reposts.

O arquivo representa o momento da exportação: posts posteriores precisam de outra rodada. O modo de página rola aos poucos e pode não alcançar posts antigos que o X omite.

IDs concluídos e pendentes ficam no `localStorage` do site, separados por conta e modo de limpeza. Não há texto de tweets nem tokens no progresso. Após recarregar a aba, abra novamente o painel para retomar. Falhas ficam pendentes; posts excluídos com sucesso são pulados. Likes e bookmarks podem ser reconsiderados se marcados novamente. Uma nova prévia ou a seleção de novos arquivos substitui a lista pendente da fonte atual. A lista não é sincronizada entre navegadores.

Uma trava impede execuções concorrentes na mesma conta e origem, inclusive entre modos diferentes. A conta identificada no link Perfil deve corresponder ao perfil ou Likes aberto; Bookmarks usa a conta conectada. A página é verificada antes de cada ação. Nenhum usuário pessoal é fixado no código ou nas configurações.

Para atualizar de versões anteriores: pare a execução antiga, espere encerrar, atualize a extensão em `chrome://extensions` e recarregue a aba do X. Confirme **v3.1.1** no cabeçalho do painel. Os IDs de posts das versões 2.1/2.2/3.0 continuam compatíveis na mesma origem e perfil do navegador. Likes e bookmarks têm armazenamentos independentes; prévias de Likes da 3.1.0 são reaproveitadas entre a rota antiga e Histórico, mantendo a separação entre listas gerais e filtradas. Desmarque a prévia para retomar ações pendentes.

## Privacidade e compatibilidade

- A exclusão é permanente e exige confirmação. A prévia encontra IDs, mas não testa a API de exclusão.
- O X alerta que automação por scripts do site pode resultar em suspensão. Consulte as [regras de automação](https://help.x.com/en/rules-and-policies/x-automation).
- Endpoints internos do X podem mudar sem aviso. O script de console anterior já foi usado, mas **a nova extensão ainda precisa de teste ao vivo em uma conta de teste**. Os testes desta versão usam DOM e respostas fictícios.
- HTTP 401/403/404 interrompe a execução. Respostas ambiguamente bem-sucedidas nunca são contadas como exclusões confirmadas. Erros de rede/servidor têm tentativas limitadas e espera crescente.
- Chrome recente é necessário. Não há limpeza em segundo plano com a aba fechada.
- Mensagens, seguidores e dados do perfil não são removidos.
- O relatório exportado contém conta, IDs, contagens, filtro e falhas; pendentes filtrados também registram a indicação de aviso adulto. Não inclui textos ou cookies. Não publique relatórios, dados do X ou credenciais no GitHub.

Leia a [política de privacidade](extension/privacy.html), que explica o processamento local e a autenticação enviada somente ao X. Não há servidor de coleta do desenvolvedor. Desinstalar a extensão não limpa o armazenamento do X nem desfaz exclusões.

## Publicar na Chrome Web Store

O [guia de instalação e publicação](docs/CHROME-WEB-STORE.md) explica o cadastro, a taxa única do Google, upload do ZIP, imagens, privacidade e submissão para revisão. A [ficha preparada](docs/STORE-LISTING.md) contém descrição e justificativas de permissões. Contato do publicador, URL pública da política e teste real ainda precisam ser definidos antes de submeter. Não há publicação automática.

[CHROMEWEBSTORE.md](CHROMEWEBSTORE.md) reúne finalidade, permissões e estado da preparação para a loja, seguindo a orientação do Google para projetos assistidos por IA.

## Console e userscript

`delete-tweets.js` continua independente: copie o conteúdo completo do arquivo (não um diff) e cole no Console enquanto estiver no próprio perfil, Likes ou Bookmarks. O painel também pode ser aberto por `tweetdelete.user.js` no comando **Abrir Tweet Cleaner** de um gerenciador de userscripts compatível.

A versão de console abre uma vez por carregamento; use `TweetCleaner.show()` para reabrir ou `TweetCleaner.stop()` para parar. Ao trocar de versão, pare e recarregue a página antes. Não execute simultaneamente o console antigo e a extensão nova.

## Desenvolvimento

```sh
npm test
npm run build
npm run package
node --check delete-tweets.js
```

Build sem dependências externas: gera o userscript e `dist/tweet-cleaner` a partir do mesmo motor. O pacote inclui apenas os arquivos de execução e a licença. Manifest V3, `activeTab` e `scripting`; sem acesso permanente a todos os sites, código remoto, analytics ou sincronização.

Para regenerar os ícones originais e a imagem promocional: `python scripts/assets.py` (requer Pillow). Para a demonstração local: `node scripts/preview.cjs` e sirva `artifacts/preview` por HTTP local. Ela usa dados fictícios e nunca envia requisições ao X. A demonstração não faz parte do ZIP.

Os testes verificam parsing, IDs, hosts, sucesso explícito, erros, prévia, retomada, conta, limites, estado da interface e abertura do popup. Não substituem um teste real no X.

## Origem

Base: `backzso/tweetdelete`, commit `b824c2a76f21aaf06acc2a3e735be98fc0bf831d`, com histórico Git e licença original preservados. Instruções de [oli-dev0/tweet-clear](https://github.com/oli-dev0/tweet-clear) e [kylesnav/x-deleter](https://github.com/kylesnav/x-deleter) foram referências; nenhum código desses dois projetos foi copiado.

Veja [CHANGELOG.md](CHANGELOG.md) para as mudanças.
