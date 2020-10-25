# Next.js + Source Maps + Sentry

Upload source maps to Sentry during production build in your Next.js project

## Installation

```
npm install kamilogorek/next-sentry-source-maps
```

or

```
yarn add kamilogorek/next-sentry-source-maps
```

### Usage with environment variables

Create a next.config.js

```js
const { withSentrySourceMaps } = require('kamilogorek/next-plugin-sentry');

module.exports = withSentrySourceMaps({
  webpack(config, options) {
    return config
  }
})
```

Then you can run a regular build command and source maps will be outputted and uploaded to Sentry for the bundles

```bash
npm run build
```

### Configuring plugin

If you want to configure Sentry Webpack Plugin, you need to use non-preconfigured version of wrappers instead.

```js
const { withSentry, withSourceMaps } = require('kamilogorek/next-plugin-sentry');

const sentry = withSentry({
  configKey: 'configValue'
})
const sourceMaps = withSourceMaps({
  devtool: 'hidden-source-map'
})

module.exports = sentry(sourceMaps({
  webpack(config, options) {
    return config
  }
}))
```