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
      case 'myProject/UPDATE_WORKSHEETS':
        const { updateType, activateWorksheetId: worksheetId } = payload
        store.dispatch('myProject/syncWorksheetsWithServer', { worksheetId, updateType })
        break
      default:
        break
    }
  })
}
