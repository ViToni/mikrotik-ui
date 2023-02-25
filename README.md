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

### Start the CORS proxy

The REST API of RouterOS is only available when accessing the router by `web-ssl`.
For now `web-ssl` does not have any configuration options regarding CORS.
Per default a browser would reject access to the site without the correct headers.
The workaround is a CORS proxy which adds respective CORS headers to the response.

The [CORS proxy used](https://github.com/garmeeh/local-cors-proxy) requires the URL of the router passed via `--proxyUrl`.
For convenience this parameter can be set using the environment variable `MIKROTIK_URL`.

This variable can be set:

* in the `.env` file
* or by the shell itself

For the options above one just calls:

```bash
npm run cors-proxy
```

Another option is to pass the variable when starting the proxy:

```bash
MIKROTIK_URL=htts://192.168.88.1 npm run cors-proxy
```

#### Self-signed certificates

Behind the scenes another environment variable is already set (in `.env`) to make self-signed certificates work:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
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
