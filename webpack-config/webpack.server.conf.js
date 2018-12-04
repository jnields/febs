const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = {

  output: {
    libraryTarget: 'commonjs2',
  },
  target: 'node',

  plugins: [
    new VueSSRServerPlugin(),
  ],

};
