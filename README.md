# MikroTik UI

A fresh UI for MikroTik routers using RouteOS' REST APIs.

## Development environment

* [Visual Studio Code](https://code.visualstudio.com/)
* Extensions
  * [Vue Language Feature (volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  * [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

There is also an one stop extension pack for Vue Volar:

* [Vue Volar extension Pack](https://marketplace.visualstudio.com/items?itemName=MisterJ.vue-volar-extention-pack)

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Fix issues found by lint

```bash
yarn lint-fix
# or
npm run lint-fix
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
