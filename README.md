# Tweet Cleaner

Extensão gratuita para limpar posts, respostas e reposts do X, com painel em português, prévia, pausa e retomada local. Sem anúncios, assinatura ou teto comercial de itens.

Derivada de [backzso/tweetdelete](https://github.com/backzso/tweetdelete), sob licença MIT. Ferramenta independente, sem vínculo com X ou Google.

## Instalar a extensão no Chrome

1. Use a pasta pronta `dist/tweet-cleaner` ou gere com `npm run package`.
2. Abra `chrome://extensions` e ative **Modo do desenvolvedor**.
3. Clique **Carregar sem compactação** e selecione a pasta `dist/tweet-cleaner`, que contém `manifest.json`.
4. Fixe o ícone da extensão. Abra o próprio perfil da conta conectada no X.
5. Clique no ícone e em **Abrir painel nesta aba**.

O pacote ZIP é para envio à loja; para instalação local, selecione a pasta extraída. Nenhuma exclusão começa ao instalar ou abrir o painel.

## Usar o painel

1. Escolha **Página aberta no X** ou **Arquivo do X no computador**.
2. **Prévia sem apagar** começa marcada. Clique **Encontrar posts** para salvar IDs sem excluir. Você pode **Parar** antes de terminar; a lista parcial fica salva.
3. Para apagar, desmarque a prévia e clique **Excluir e continuar**. Confirme a frase que identifica a conta conectada. A execução usa os IDs já encontrados e depois continua buscando na página. Sem lista salva, **Excluir disponíveis** busca e exclui diretamente.
4. Deixe a aba aberta e o computador acordado. **Pausar**, **Retomar** e **Parar** respondem também durante a espera pelo X. Uma requisição já enviada pode terminar após parar.
5. O botão de minimizar conserva um controle com o estado e a contagem da rodada. Clique nele para reabrir.
6. Exporte o relatório se precisar. Ao terminar, atualize o perfil para conferir os restantes e execute também nas abas **Respostas** e **Reposts**. A troca de abas é manual.

Os números principais descrevem a execução atual; **ações salvas** é o histórico acumulado no navegador. Não há uma porcentagem de conclusão: a página não fornece o total acessível de posts. Uma rodada sem novos IDs não comprova que todo o histórico foi removido.

A ferramenta não impõe o teto de 500. As requisições são sequenciais, com no mínimo 800 ms entre itens, além do tempo de rede, rolagem e esperas. HTTP 429 exibe uma contagem regressiva, aguarda o reset informado pelo X (ou 15 minutos quando ausente) e tenta o mesmo ID novamente. Isso não contorna os limites nem garante ausência de restrições da conta.

## Arquivo local e retomada

Selecione `data/tweets.js` ou arquivos divididos `tweets-part*.js`. Vários arquivos são deduplicados. São lidos como JSON, nunca executados nem enviados a um serviço do desenvolvedor. Todas as entradas são processadas, incluindo respostas e reposts, por seus IDs de exportação. Reposts restantes podem exigir uma rodada na aba Reposts.

O arquivo representa o momento da exportação: posts posteriores precisam de outra rodada. O modo de página rola aos poucos e pode não alcançar posts antigos que o X omite.

IDs concluídos e pendentes ficam no `localStorage` do site, separados por conta e operação. Não há texto de tweets nem tokens no progresso. Após recarregar a aba, abra novamente o painel para retomar. Falhas ficam pendentes; sucessos são pulados. Uma nova prévia ou a seleção de novos arquivos substitui a lista pendente da fonte atual. A lista não é sincronizada entre navegadores.

Uma trava impede execuções concorrentes na mesma conta e origem. A conta identificada no link Perfil deve corresponder ao perfil aberto; isso é verificado antes de cada ação. Nenhum usuário pessoal é fixado no código ou nas configurações.

Para atualizar da versão 2.1/2.2: pare a execução antiga, espere encerrar, atualize a extensão e recarregue a aba do X. Os dados locais anteriores continuam compatíveis na mesma origem e perfil do navegador. Desmarque a prévia para retomar exclusões pendentes.

## Privacidade e compatibilidade

- A exclusão é permanente e exige confirmação. A prévia encontra IDs, mas não testa a API de exclusão.
- O X alerta que automação por scripts do site pode resultar em suspensão. Consulte as [regras de automação](https://help.x.com/en/rules-and-policies/x-automation).
- Endpoints internos do X podem mudar sem aviso. O script de console anterior já foi usado, mas **a nova extensão ainda precisa de teste ao vivo em uma conta de teste**. Os testes desta versão usam DOM e respostas fictícios.
- HTTP 401/403/404 interrompe a execução. Respostas ambiguamente bem-sucedidas nunca são contadas como exclusões confirmadas. Erros de rede/servidor têm tentativas limitadas e espera crescente.
- Chrome recente é necessário. Não há limpeza em segundo plano com a aba fechada.
- Curtidas, mensagens, seguidores e dados do perfil não são removidos.
- O relatório exportado contém conta, IDs, contagens e falhas. Não inclui textos ou cookies. Não publique relatórios, dados do X ou credenciais no GitHub.

Leia a [política de privacidade](extension/privacy.html), que explica o processamento local e a autenticação enviada somente ao X. Não há servidor de coleta do desenvolvedor. Desinstalar a extensão não limpa o armazenamento do X nem desfaz exclusões.

## Publicar na Chrome Web Store

O [guia de instalação e publicação](docs/CHROME-WEB-STORE.md) explica o cadastro, a taxa única do Google, upload do ZIP, imagens, privacidade e submissão para revisão. A [ficha preparada](docs/STORE-LISTING.md) contém descrição e justificativas de permissões. Contato do publicador, URL pública da política e teste real ainda precisam ser definidos antes de submeter. Não há publicação automática.

## Console e userscript

`delete-tweets.js` continua independente: copie o conteúdo completo do arquivo (não um diff) e cole no Console enquanto estiver no próprio perfil. O painel também pode ser aberto por `tweetdelete.user.js` no comando **Abrir Tweet Cleaner** de um gerenciador de userscripts compatível.

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