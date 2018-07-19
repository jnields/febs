// main.js
const Vue = require('vue');
const App = require('./app-lint-errors.vue');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render(createElement) {
    return createElement(App);
  },
});
