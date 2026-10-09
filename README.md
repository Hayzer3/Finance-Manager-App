# Finance Manager

Aplicativo acadêmico de controle financeiro pessoal, feito com Expo, React Native e TypeScript. A versão atual é demonstrativa: os dados das movimentações ficam no aparelho e login/cadastro não autenticam usuários.

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

Abra o Expo Go no Android e escaneie o QR code do terminal. O `--go` é necessário porque o projeto inclui `expo-dev-client`, que faz o Expo CLI procurar uma development build por padrão. No Expo Go, o banner usa o padrão local; os módulos Firebase exigem uma development build e Remote Config não funciona no Expo Go.

Depois de vincular o projeto à sua conta EAS, gere uma development build com `npx eas-cli@latest build --profile development --platform android`. Instale o APK gerado no aparelho e execute `npx expo start --dev-client` para abrir o app no servidor local.

## Funcionalidades

- Login e cadastro demonstrativos com validação de campos. Não há autenticação real.
- Dashboard com saldo calculado em centavos, histórico, estados vazios e opção para remover as transações de exemplo.
- Receitas e despesas com categorias, validação e persistência local usando AsyncStorage.
- Banner Dica do Dia controlado por Remote Config quando o Firebase está configurado. Em falha ou sem configuração, o valor seguro padrão é `true`.

## Firebase Remote Config (Android)

O código usa `@react-native-firebase/app`, `@react-native-firebase/analytics` e `@react-native-firebase/remote-config`, que dependem de módulos nativos. Para habilitar:

1. Crie um projeto Firebase e registre um app Android com o identificador `com.finance.managerapp`, definido em `app.json`.
2. Baixe o `google-services.json` e coloque-o na raiz do projeto. O `app.json` já aponta para esse caminho. Esse arquivo contém identificadores públicos do app Firebase; não compartilhe chaves privadas ou tokens.
3. No Firebase Console, abra **Remote Config**, crie o parâmetro booleano `show_daily_tip`, defina `true` ou `false`, publique as alterações.
4. Gere uma development build para Android e instale-a no aparelho. Após atualizar plugins ou configuração nativa, gere a build novamente. Expo Go não carrega o módulo Remote Config.

Sem o arquivo `google-services.json` e um projeto Firebase criado, o SDK não consegue buscar parâmetros remotos; o app mantém o banner visível pelo padrão local. O modo de demonstração continua disponível.

## Estrutura

- `src/app/`: rotas Expo Router (login, cadastro, dashboard e nova transação).
- `src/components/`: componentes compartilhados.
- `src/context/`: estado e cálculos de transações.
- `src/services/`: persistência e Remote Config.
- `src/types/` e `src/utils/`: modelo e formatação monetária.

## Equipe

- Camily Vitoria Maciel — RM566520
- Eduarda Weiss — RM564434
- Lucas Nunes Soares — RM566503
