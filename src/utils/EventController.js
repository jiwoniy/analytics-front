import { eventsBus, events } from '@/events'

function EventController () {
  this.listner = {}

  Object.keys(events).forEach(key => {
    this[key] = (payload) => {
      eventsBus.$emit(events[key], payload)
    }

    this.addListner = function (methodName, callbackFunction) {
      this.listner[methodName] = callbackFunction
    }

    this.removeListner = function (methodName) {
      if (this.listner[methodName]) {
        delete this.listner[methodName]
      }
    }

    const that = this
    this[`on${key}`] = function (payload) {
      if (that.listner[key]) {
        that.listner[key](payload)
      }
    }

    eventsBus.$on(events[key], this[`on${key}`])
  })

  return this
}

const eventController = new EventController()

export default eventController
