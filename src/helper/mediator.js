// https://itnext.io/decouple-vuex-actions-with-the-mediator-pattern-58a8879de1b4
// store-moderator.js
import eventController from '@/utils/EventController'

export default function configureMediator (store, router) {
  // listen to mutations
  store.subscribe(async ({ type, payload }, state) => {
    switch (type) {
      case 'myProject/SET_SELECTED_WORKSHEETS':
        eventController.RIGHT_PANEL()
        break
      case 'myProject/UPDATE_SELECTED_WORKSHEETS':
        store.dispatch('myProject/updateWorksheetsByMediator', payload)
        break
      default:
        break
    }
  })
}
