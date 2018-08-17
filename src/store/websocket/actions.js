import Vue from 'vue'
import VueNativeSocket from 'vue-native-websocket'

import store from '@/store'
import { appConf } from '@/config'

Vue.use(VueNativeSocket, appConf.end_point, {
  store,
  connectManually: true
})

// function sendSocket (socket, sendMessage) {
//   if (socket && !_isEmpty(sendMessage)) {
//     socket.send(JSON.stringify(sendMessage))
//   }
// }

export default {
  setSocket: ({ commit, state }, socket = {}) => {
    commit('SET_SOCKET', socket)
  },
  setSocketConnecting: ({ commit, state }, payload) => {
    commit('SET_SOCKET_CONNECT', payload)
  },
  sendMessage: ({ dispatch, commit, state }, payload) => {
    // sendSocket(state.socket, sendMessage)
  }
}
