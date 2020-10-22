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
// next.config.js
const withSourceMaps = require('@zeit/next-source-maps');
const withSentry = require('kamilogorek/next-sentry-source-maps');

module.exports = withSentry(withSourceMaps({
  webpack(config, options) {
    return config
  }
}))
```

Then you can run a regular build command and source maps will be outputted and uploaded to Sentry for the bundles

```bash
npm run build
```

### Configuring plugin

TBD