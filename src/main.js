import Vue from 'vue'

import App from '@/App'
import router from '@/router'
import store from '@/store'

// global components
import TreeItem from '@/components/ui/TreeItem'
import Modal from '@/components/ui/Modal'
import Loader from '@/components/ui/Loader'

// plugins
import i18n from '@/plugins/vue-i18n'
import '@/plugins/vue-split-panel'
import '@/plugins/axios'
import '@/plugins/localStorage' // Use localstorage before api created

Vue.config.productionTip = false

// global components
Vue.component('tree-item', TreeItem)
Vue.component('modal', Modal)
Vue.component('loader', Loader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})
