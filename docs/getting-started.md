# Getting started

## Node version

install nvm: https://github.com/nvm-sh/nvm

And then:

```
nvm use
```

## Install

```
yarn
```

## Environment

- development:

```
// .env.development.local
VUE_APP_GATEWAY=dev-gateway.flowlity.com
VUE_APP_INTEGRATION_FILENAME=<file name in the blob for reset data>
VUE_APP_INTEGRATION_URL=<DATA INTEGRATION URL FOR PREPROD>
```

- production:

```
// .env.production.local
VUE_APP_GATEWAY=app-gateway.flowlity.com
VUE_APP_INTEGRATION_FILENAME=<file name in the blob for reset data>
VUE_APP_INTEGRATION_URL=<DATA INTEGRATION URL FOR PROD>
```

## Compiles and hot-reloads for development

By default, the frontend is using the supervisor in preprod

```
yarn serve
```

~~It is possible to run the frontend using the local supervisor using~~

~~NODE_ENV='local' yarn serve~~

Or, you can run it using the supervisor in preproduction using

```
NODE_ENV='development' yarn serve
```

Or, you can run it using the supervisor in production using

```
yarn build
npx serve dist -l 8080
```

## Compiles and minifies for production

### Production

```
yarn build
```

or

```
yarn build -- --mode=production
```

### Development

```
yarn build -- --mode=development
```

### Production & Online serve

```
yarn test:host
```

## Run your tests

```
yarn test
```

### Run unit tests only

```
yarn test:unit
```

#### Run individual unit tests

```
yarn test:unit:only --collectCoverage=false --testPathPattern=path/to/test/file.spec.js
```

## Lints and fixes files

```
yarn lint
```

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
