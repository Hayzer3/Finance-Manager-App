# Finance Manager

Aplicativo académico de controlo financeiro pessoal, desenvolvido com Expo, React Native e TypeScript. A versão atual é demonstrativa: os dados das movimentações ficam guardados localmente no aparelho e o login/registo não autentica utilizadores reais.

## Requisitos

- Node.js 22.13 ou superior para Expo SDK 57.
- npm e Expo Go para executar a demonstração sem Remote Config.
- Android 7 ou superior.

## Instalação e execução

```bash
npm install
npx expo start --go
```

Execute os testes de regras locais com `npm test`.

Abra o Expo Go no Android e faça a leitura do QR code no terminal. A flag `--go` é necessária porque o projeto inclui o `expo-dev-client`, que faz com que a Expo CLI procure uma *development build* por defeito. No Expo Go, o banner utiliza o padrão local; os módulos Firebase exigem uma *development build* e o Remote Config não funciona no Expo Go.

Depois de vincular o projeto à sua conta EAS, gere uma *development build* com `npx eas-cli@latest build --profile development --platform android`. Instale o APK gerado no aparelho e execute `npx expo start --dev-client` para abrir a aplicação no servidor local.

## Funcionalidades

- Login e registo demonstrativos com validação de campos. Não há autenticação real.
- Dashboard com saldo calculado em cêntimos, histórico, estados vazios e opção para remover as transações de exemplo.
- Receitas e despesas com categorias, validação e persistência local através de AsyncStorage.
- Banner Dica do Dia controlado por Remote Config quando o Firebase está configurado. Em caso de falha ou sem configuração, o valor seguro por defeito é `true`.

## Firebase Remote Config (Android)

O código utiliza `@react-native-firebase/app`, `@react-native-firebase/analytics` e `@react-native-firebase/remote-config`, que dependem de módulos nativos. Para ativar:

1. Crie um projeto Firebase e registe uma aplicação Android com o identificador `com.finance.managerapp`, definido no `app.json`.
2. Transfira o ficheiro `google-services.json` e coloque-o na raiz do projeto. O `app.json` já aponta para este caminho. Este ficheiro contém identificadores públicos da aplicação Firebase; não partilhe chaves privadas ou tokens.
3. No Firebase Console, abra **Remote Config**, crie o parâmetro booleano `show_daily_tip`, defina como `true` ou `false`, e publique as alterações.
4. Gere uma *development build* para Android e instale-a no aparelho. Após atualizar plugins ou configuração nativa, gere a build novamente. O Expo Go não carrega o módulo Remote Config.

Sem o ficheiro `google-services.json` e um projeto Firebase criado, o SDK não consegue procurar parâmetros remotos; a aplicação mantém o banner visível através do padrão local. O modo de demonstração continua disponível.

## Estrutura

A organização do projeto reflete a seguinte arquitetura:

- `src/app/`: Rotas do Expo Router (`_layout.tsx`, `dashboard.tsx`, `index.tsx`, `register.tsx`, `transaction.tsx`).
- `src/components/`: Componentes de interface partilhados (`ActionButton.tsx`).
- `src/context/`: Estado global da aplicação (`FinanceContext.tsx`).
- `src/screens/`: Ecrãs específicos da aplicação (`LoginScreen.tsx`).
- `src/services/`: Serviços de integração e persistência (`remoteConfig.ts`, `storage.ts`, `transactionStore.ts`).
- `src/types/` e `src/utils/`: Tipagens TypeScript e funções de formatação monetária.
- `tests/`: Ficheiros de teste da aplicação e regras locais.

## Equipa

- Camily Vitoria Maciel — RM566520
- Eduarda Weiss — RM564434
- Lucas Nunes Soares — RM566503
