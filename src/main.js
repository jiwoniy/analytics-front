// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import axios from 'axios'

import App from '@/App'
import router from '@/router'
import store from '@/store'

import i18n from '@/plugins/vue-i18n'
import '@/plugins/axios'

Vue.config.productionTip = false

// const ChatWidget = window.ChatWidget
// axios.post('https://flanb-demo.travelflan.com/aaa/service_token', {
//   username: 'permissions_test@travelflan.com',
//   password: 'Tour1234!@#',
//   provider: 10
// }).then(function (result) {
//   console.log(result)
//   /* eslint-disable no-new */
// new ChatWidget(document.getElementById('widgetContainer'), {
//   provider_uid: 1234,
//   provider_id: 10,
//   userToken: result.data.token,
//   width: 375
// })
// })
/* eslint-disable no-new */
// new ChatWidget(document.getElementById('widgetContainer'), {})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})
