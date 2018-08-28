import Vue from 'vue'
import vSelect from 'vue-select'

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

// directives
import '@/directives/focus'

import captureBug from '@/utils/captureBug'

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  let handler = null
  let current = vm
  if (vm.$options.errorHandler) {
    handler = vm.$options.errorHandler
  } else {
    while (current.$parent) {
      current = current.$parent
      if (current.$options.errorHandler) {
        handler = current.$options.errorHandler
        break
      }
    }
  }

  if (handler) {
    handler.call(current, err, vm, info)
  }
}

// https://sentry.io/answers/capture-errors/
// https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror.html
// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   // ... handle error ...
//   return false
// }

// global components
Vue.component('v-select', vSelect)
Vue.component('tree-item', TreeItem)
Vue.component('modal', Modal)
Vue.component('loader', Loader)

captureBug.init()

/* eslint-disable no-new */
new Vue({
  el: '#dtonic-app',
  router,
  i18n,
  store,
  template: '<App/>',
  render: (h) => h(App)
})
