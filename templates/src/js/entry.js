/* eslint-disable no-unused-vars */

// Your js entry point..go!
import Vue from '../../node_modules/vue/dist/vue.runtime.esm';
import App from './components/App.vue';

const vm = new Vue({
  el: '#app',
  render: function render(h) {
    return h(App, {
      props: {
        message: 'Hello, from Vue!',
      },
    });
  },
});

// Bring in less
require('../style/entry.less');
