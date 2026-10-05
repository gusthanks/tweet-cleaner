# Instalar e publicar a extensão

## Instalação local gratuita

1. Gere o pacote com `npm run package` ou use a pasta pronta `dist/tweet-cleaner`.
2. No Chrome, abra `chrome://extensions`.
3. Ative **Modo do desenvolvedor**.
4. Clique **Carregar sem compactação** e selecione `dist/tweet-cleaner`, a pasta que contém `manifest.json`. Não selecione o ZIP.
5. Fixe o Tweet Cleaner pelo menu de extensões. Abra o próprio perfil, Likes ou Bookmarks no X, clique no ícone e em **Abrir painel nesta aba**.

Não começa a excluir automaticamente. A extensão continua funcionando enquanto a aba está aberta, mesmo se você fechar o popup. Ela não executa em segundo plano com a aba fechada.

Antes de atualizar: pare a versão antiga e espere a rodada encerrar. Atualize a extensão em `chrome://extensions` e recarregue a aba do X para remover o painel antigo. Os IDs de posts das versões 2.1/2.2/3.0 são preservados na mesma origem e perfil do navegador. Likes e bookmarks usam históricos separados. A pasta instalada precisa continuar existindo.

## Publicação para outras pessoas

A extensão pode ser gratuita para usuários. O Google exige cadastro de desenvolvedor e uma **taxa única de registro**; confira o valor mostrado no cadastro antes de pagar. Não há publicação nem pagamento automático neste projeto.

1. Entre no [Developer Dashboard](https://chrome.google.com/webstore/devconsole), registre a conta e configure o publicador. Siga o [cadastro oficial](https://developer.chrome.com/docs/webstore/register).
2. Teste a instalação local em uma conta de teste do X que você controla. Os testes automatizados usam respostas simuladas; não garantem compatibilidade dos endpoints internos com o X ao vivo.
3. Publique `extension/privacy.html` em uma URL HTTPS pública, acessível sem login. A política dentro do ZIP, sozinha, não substitui o link público solicitado na ficha. Hospedar essa página é um passo separado.
4. Clique em **New item / Novo item** e envie `dist/tweet-cleaner-3.1.0.zip`. O `manifest.json` fica na raiz desse ZIP; não compacte a pasta do repositório inteiro.
5. Preencha **Store listing** com `docs/STORE-LISTING.md`. Use o ícone `extension/icons/128.png`, pelo menos uma captura 1280×800 ou 640×400 e a imagem promocional pequena 440×280. As imagens devem representar a experiência real. Os materiais de demonstração deste projeto usam dados fictícios identificados como demonstração.
6. Em **Privacy**, informe a finalidade única e justifique as duas permissões. Declare com precisão o processamento local de conta, conteúdo, IDs, marcadores de likes/bookmarks e autenticação da sessão, e as requisições enviadas ao X. Não declare que a extensão não usa autenticação: ela lê o token CSRF para operar na sessão já conectada.
7. Em **Distribution**, escolha distribuição gratuita e a visibilidade desejada. Preencha **Test instructions** conforme o modelo, sem fornecer sua conta pessoal ou cookies.
8. Revise tudo e clique **Submit for review**. Você pode optar pela publicação adiada para decidir quando disponibilizar após aprovação.

O Google pode solicitar alterações ou rejeitar a submissão. Manifest V3 e permissões pequenas não garantem aprovação. O uso de endpoints internos do X e as regras do X precisam ser considerados; não prometa ausência de risco de restrição da conta.

## Dados ainda necessários antes de submeter

- Nome público do publicador: `[DADO A CONFIRMAR]`.
- E-mail ou URL pública de suporte: `[DADO A CONFIRMAR]`.
- URL HTTPS pública da política de privacidade: `[DADO A CONFIRMAR]`.
- Categoria e países de distribuição: `[DADO A CONFIRMAR]`.
- Resultado do teste real da extensão numa conta de teste: `[DADO A CONFIRMAR]`.

Nenhum desses dados é substituído por nome de usuário pessoal no pacote.

## Referências oficiais

- [Carregar extensão local](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
- [Publicação e revisão](https://developer.chrome.com/docs/webstore/publish).
- [Imagens da ficha](https://developer.chrome.com/docs/webstore/best-listing).
- [Privacidade no painel](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).
- [Permissão activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab).
- [Políticas da loja](https://developer.chrome.com/docs/webstore/program-policies/policies).
- [Desenvolver extensões com assistência de IA](https://developer.chrome.com/docs/extensions/ai/build-with-ai). O índice `CHROMEWEBSTORE.md` orienta a preparação; ferramentas de depuração sugeridas pelo guia não são incluídas no pacote.
