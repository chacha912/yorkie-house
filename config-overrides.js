const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@yorkie-house/src': path.resolve(__dirname, 'src'),
  })
);
