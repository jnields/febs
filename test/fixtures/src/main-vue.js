// main.js
const Vue = require('vue');
const App = require('./app.vue');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render(createElement) {
    return createElement(App);
  },
});
