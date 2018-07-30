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
      case 'myProject/DELETE_SELECTED_WORKSHEETS':
        store.dispatch('myProject/updateWorksheets', payload)
        break
      case 'myProject/UPDATE_CURRENT_WORK_PIPELINE_NODE':
        store.dispatch('myProject/updateCurrentWorkNodeByMediator', payload)
        break
      default:
        break
    }
  })
}
