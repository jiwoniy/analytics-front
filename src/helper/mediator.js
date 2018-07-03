// https://itnext.io/decouple-vuex-actions-with-the-mediator-pattern-58a8879de1b4
// store-moderator.js
export default function configureMediator (store, router) {
  // listen to mutations
  store.subscribe(async ({ type, payload }, state) => {
    switch (type) {
      case 'user/SET_TOKEN':
        // const { success, error } = await store.dispatch('auth/postWidgetToken', state.user.token)
        // console.log(success)
        // console.log(error)
        // TODO success get user info
        break
      case 'common/SET_ALERT':
        const { actionType, callback } = payload
        if (actionType === 'response' && callback) {
          const { action } = payload
          if (action) {
            callback(action)
          }
        }
        break
      default:
        break
    }
  })
}
