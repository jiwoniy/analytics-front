// https://itnext.io/decouple-vuex-actions-with-the-mediator-pattern-58a8879de1b4
// store-moderator.js
import eventController from '@/utils/EventController'

export default function configureMediator (store, router) {
  // listen to mutations
  store.subscribe(async ({ type, payload }, state) => {
    switch (type) {
      case 'myProject/SET_SELECTED_WORKSHEETS':
        eventController.RIGHT_PANEL({
          item: payload,
          type: 'worksheet'
        })
        break
      case 'user/SET_TOKEN':
        // const { success, error } = await store.dispatch('auth/postWidgetToken', state.user.token)
        // console.log(success)
        // console.log(error)
        // TODO success get user info
        break
      default:
        break
    }
  })
}
