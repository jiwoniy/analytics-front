// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import axios from 'axios'

import App from '@/App'
import router from '@/router'
import store from '@/store'

import TreeItem from '@/components/ui/TreeItem'

import i18n from '@/plugins/vue-i18n'
import '@/plugins/axios'

Vue.config.productionTip = false

Vue.component('tree-item', TreeItem)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})
