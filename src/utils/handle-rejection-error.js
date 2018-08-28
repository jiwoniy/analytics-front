import ErrorStackParser from 'error-stack-parser'
// const hasStack = require('../../base/lib/has-stack')
// const { reduce } = require('../../base/lib/es-utils')
// const isError = require('iserror')

/*
 * Automatically notifies Bugsnag when window.onunhandledrejection is called
 */

// Given `err` which may be an error, does it have a stack property which is a string?
const hasStack = err =>
  !!err &&
  (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
  typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
  err.stack !== `${err.name}: ${err.message}`

// eslint-disable-next-line
let _listener
export default {
  init: (client) => {
    const listener = event => {
      let error = event.reason

      if (event.detail && event.detail.reason) {
        error = event.detail.reason
      }

      const handledState = {
        severity: 'error',
        unhandled: true,
        severityReason: { type: 'unhandledPromiseRejection' }
      }

      const report = {}
      if (error && hasStack(error)) {
        // if it quacks like an Error…
        report.name = error.name
        report.message = error.message
        report.stacktrace = ErrorStackParser.parse(error)
        report.handledState = handledState
        // report = new client.BugsnagReport(error.name, error.message, ErrorStackParser.parse(error), handledState)
      } else {
        // if it doesn't…
        const msg = 'Rejection reason was not an Error. See "Promise" tab for more detail.'
        report.name = error && error.name ? error.name : 'UnhandledRejection'
        report.message = error && error.message ? error.message : msg
        report.stacktrace = []
        report.handledState = handledState
      }
      console.log('--error--')
      console.log(report)

      // client.notify(report)
    }

    if ('addEventListener' in window) {
      window.addEventListener('unhandledrejection', listener)
    } else {
      window.onunhandledrejection = (reason, promise) => {
        listener({ detail: { reason, promise } })
      }
    }
    _listener = listener
  },
  destroy: () => {
    if (_listener) {
      if ('addEventListener' in window) {
        window.removeEventListener('unhandledrejection', _listener)
      } else {
        window.onunhandledrejection = null
      }
    }
    _listener = null
  }
}
