// import hash from 'object-hash'
// import moment from 'moment'

const Singleton = (() => {
  let instance

  function createInstance () {
    const object = {}
    return object
  }

  return {
    getInstance () {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    }
  }
})()

const instance = Singleton.getInstance()

export default instance
