import Vue from 'vue'
import App from './bubble.vue'
var vueBubble = require('../src/index.js')


Vue.use(vueBubble)


new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App)
})
