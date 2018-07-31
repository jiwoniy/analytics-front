// https://itnext.io/decouple-vuex-actions-with-the-mediator-pattern-58a8879de1b4
// store-moderator.js
import eventController from '@/utils/EventController'

export default function configureMediator (store, router) {
  // listen to mutations
  store.subscribe(async ({ type, payload }, state) => {
    switch (type) {
      case 'myProject/SET_ACTIVATE_WORKSHEETS':
        eventController.RIGHT_PANEL()
        break
      case 'myProject/DELETE_ACTIVATE_WORKSHEETS':
        store.dispatch('myProject/updateWorksheets', {
          ...payload,
          updateType: 'delete'
        })
        break
      case 'myProject/UPDATE_CURRENT_WORK_PIPELINE_NODE':
        store.dispatch('myProject/updateCurrentWorkNodeByMediator', payload)
        break
      default:
        break
    }
  })
}
