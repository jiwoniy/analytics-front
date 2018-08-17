export default {
  SET_SOCKET: (state, socket) => {
    state.socket = socket
  },
  SET_SOCKET_CONNECT: (state, payload) => {
    state.isConnecting = payload
  },
  SOCKET_CONNECT: (state, connected) => {
    state.connected = true
    state.isConnecting = false
  },
  SOCKET_ONOPEN: (state) => {
    state.connected = true
  },
  SOCKET_ONMESSAGE: (state, message) => {
    // define message
  },
  SOCKET_ONERROR: (state) => {
    state.connected = false
  },
  SOCKET_ONCLOSE: (state) => {
    state.connected = false
  }
}
