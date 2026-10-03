# Tweet Cleaner

Limpeza gratuita de tweets, respostas e reposts no navegador, com painel em português.
Derivado de [backzso/tweetdelete](https://github.com/backzso/tweetdelete), sob licença MIT.

## Começar sem esperar o arquivo do X

1. No Chrome, entre em https://x.com/gusthanks e aguarde o perfil carregar.
2. Abra `delete-tweets.js`, copie o conteúdo completo e cole no Console das ferramentas de desenvolvedor (`Ctrl+Shift+J`).
3. O painel abre em **Simular primeiro**. Clique **Simular** para localizar e salvar IDs sem apagar nada. Você pode clicar **Parar** antes: os IDs encontrados até então ficam salvos.
4. Para excluir, desmarque a simulação e clique **Excluir e continuar**. A exclusão começa pelos IDs já encontrados, sem repetir a simulação, e depois busca automaticamente os demais na página. Digite a frase de confirmação solicitada pelo painel. Se não houver lista salva, o botão **Excluir disponíveis** localiza e exclui diretamente.
5. Deixe a aba aberta. Você pode **Pausar**, **Retomar** ou **Parar**. Uma requisição já enviada pode terminar depois de parar.
6. Ao terminar, exporte o relatório e atualize a página para conferir restantes. Repita nas abas **Respostas** e **Reposts**. A troca entre abas ainda é manual.

A versão 2.2 não impõe um teto de 500 itens ou requisições. Continua até processar os IDs disponíveis ou ser parada, pausada ou interrompida por um erro. Não há requisições simultâneas; o intervalo mínimo continua sendo 800 ms entre itens, além do tempo de rede, rolagem e esperas do X. Ao receber HTTP 429, aguarda o reset e tenta o mesmo ID novamente; não contorna o limite.

O lote encontrado fica salvo localmente como IDs e tipos de operação, separado por conta, aba e modo. Sobrevive a atualizações da página. Falhas continuam pendentes; sucessos são retirados do lote. Uma nova simulação substitui o lote pendente da fonte atual. Carregar novos arquivos também substitui o lote anterior.

Para atualizar da versão 2.1, clique **Parar**, espere os controles ficarem disponíveis, atualize a aba e cole o script 2.2. O histórico de exclusões e os IDs pendentes da versão 2.1 são preservados, desde que você use a mesma conta no mesmo navegador/origem. Desmarque **Simular primeiro** para retomar a exclusão. A simulação 2.0 não salvava IDs pendentes.

Não é necessário descer toda a página previamente: o script rola aos poucos enquanto processa o que aparece. O X pode deixar de exibir posts antigos; uma rodada sem novos IDs **não comprova** que o histórico inteiro foi removido. O script não troca de aba nem recarrega automaticamente.

## Arquivo local para alcançar posts antigos

No painel, selecione **Arquivo local (histórico)** e escolha `data/tweets.js` ou os arquivos divididos `tweets-part*.js`. Vários arquivos podem ser selecionados juntos e IDs repetidos são deduplicados. O arquivo é lido como JSON, nunca executado e nunca enviado a um serviço externo. Todas as entradas são processadas, incluindo respostas à própria conta e reposts, por seus IDs de exportação. Caso reposts permaneçam, faça uma rodada na aba Reposts.

O arquivo do X é uma fotografia do momento da exportação: posts posteriores precisam de outra rodada pela página ou de um arquivo mais recente.

## Retomada e privacidade

Os IDs de ações concluídas e os IDs do lote pendente ficam em `localStorage`, separados por conta e por operação. O texto dos tweets e credenciais não ficam salvos pelo script. Após atualizar ou fechar a aba, cole novamente o script e inicie uma nova rodada: os IDs concluídos são pulados. Falhas são tentadas novamente na rodada seguinte.

Uma trava do navegador impede duas execuções simultâneas na mesma conta/origem. A conta conectada precisa estar identificável no link Perfil e corresponder ao perfil aberto; o script verifica isso antes de cada ação.

O relatório exportado contém IDs, contagens, conta e falhas, sem texto dos tweets ou cookies. Ele fica apenas no computador. Não envie seu arquivo de dados, cookies, cabeçalhos privados ou relatórios ao GitHub.

## Limites e compatibilidade

- A exclusão é permanente. A simulação é opcional; a confirmação explícita antes de excluir é obrigatória. A simulação encontra IDs, mas não testa a API.
- O X alerta que automação por scripts do site pode resultar em suspensão permanente. Este script usa endpoints internos com a sessão do navegador; respeitar o teto e as respostas de limite **não elimina esse risco**. Veja as [regras de automação](https://help.x.com/en/rules-and-policies/x-automation).
- O script usa endpoints internos do X, herdados do projeto original. Eles podem mudar sem aviso. **A compatibilidade com a API atual do X não foi validada em uma exclusão real nesta versão.**
- HTTP 401/403/404 interrompe a execução. O script não finge que um endpoint inexistente significa tweet já removido.
- Uma resposta 2xx só é contada como sucesso quando contém o campo de resultado esperado da operação. Uma resposta inesperada é registrada como falha.
- HTTP 429 espera até o horário de reset informado pelo X, sem contornar o limite. Erros de rede e servidor têm tentativas limitadas e espera crescente. Pausa/parada respondem também durante a espera.
- Chrome recente é necessário para Web Locks e timeout de requisições. A aba precisa permanecer aberta e o computador acordado.
- Curtidas, mensagens, seguidores e dados do perfil não fazem parte deste script.
- A versão de console abre o painel uma vez por carregamento da página. Para reexibir: `TweetCleaner.show()`. Para parar pelo console: `TweetCleaner.stop()`.

Se aparecer um erro de API, exporte o relatório e registre apenas o código HTTP e a mensagem do painel. Não publique credenciais para tentar resolver.

## Userscript opcional

`tweetdelete.user.js` é gerado a partir da mesma base. Em um gerenciador compatível (Tampermonkey, por exemplo), abre-se pelo comando **Abrir Tweet Cleaner** no menu da extensão, enquanto estiver no próprio perfil. Não começa a apagar automaticamente.

## Desenvolvimento e verificação

Sem dependências externas:

```sh
npm test
npm run build
node --check delete-tweets.js
```

Testes unitários e de execução com DOM/rede simulados verificam parsing, precisão de IDs, rejeição de hosts falsos, sucesso explícito, erros, simulação, retomada, troca de conta e destino das requisições. Eles não substituem um teste real de compatibilidade com o X.

## Origem e referências

Base clonada: `backzso/tweetdelete`, commit `b824c2a76f21aaf06acc2a3e735be98fc0bf831d`. Histórico Git e licença original preservados.

Também foram consultadas as instruções de [oli-dev0/tweet-clear](https://github.com/oli-dev0/tweet-clear) e [kylesnav/x-deleter](https://github.com/kylesnav/x-deleter), como referências de retomada e uso do arquivo de dados. Nenhum código desses dois projetos foi copiado.

Veja [CHANGELOG.md](CHANGELOG.md) para as mudanças da versão.
