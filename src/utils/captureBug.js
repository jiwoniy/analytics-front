/*
 * Automatically notifies Bugsnag when window.onerror is called
 */

export default {
  init: (client) => {
    const onerror = (messageOrEvent, url, lineNo, charNo, error) => {
      // Ignore errors with no info due to CORS settings
      if (lineNo === 0 && /Script error\.?/.test(messageOrEvent)) {
        console.log('error 1')
        console.log(messageOrEvent)
        // client._logger.warn('Ignoring cross-domain or eval script error. See docs: https://tinyurl.com/y94fq5zm')
        return
      }

      // any error sent to window.onerror is unhandled and has severity=error
      // const handledState = { severity: 'error', unhandled: true, severityReason: { type: 'unhandledException' } }

      // let report
      if (error) {
        if (error.name && error.message) {
          console.log('error 2')
          console.log(error.name)
          console.log(error.message)
          // report = new client.BugsnagReport(error.name, error.message, decorateStack(client.BugsnagReport.getStacktrace(error), url, lineNo, charNo), handledState)
        } else {
          console.log('error 3')
          // report = new client.BugsnagReport('window.onerror', String(error), decorateStack(client.BugsnagReport.getStacktrace(error, 1), url, lineNo, charNo), handledState)
          // report.updateMetaData('window onerror', { error })
        }
      } else if ((typeof messageOrEvent === 'object' && messageOrEvent !== null) && !url && !lineNo && !charNo && !error) {
        const name = messageOrEvent.type ? `Event: ${messageOrEvent.type}` : 'window.onerror'
        const message = messageOrEvent.message || messageOrEvent.detail || ''
        console.log('error 4')
        console.log(name)
        console.log(message)
        // report = new client.BugsnagReport(name, message, client.BugsnagReport.getStacktrace(new Error(), 1).slice(1), handledState)
        // report.updateMetaData('window onerror', { event: messageOrEvent })
      } else {
        console.log('error 5')
        // report = new client.BugsnagReport('window.onerror', String(messageOrEvent), decorateStack(client.BugsnagReport.getStacktrace(error, 1), url, lineNo, charNo), handledState)
        // report.updateMetaData('window onerror', { event: messageOrEvent })
      }

      // client.notify(report)

      if (typeof prevOnError === 'function') prevOnError(messageOrEvent, url, lineNo, charNo, error)
    }

    const prevOnError = window.onerror
    window.onerror = onerror
  }
}

// const decorateStack = (stack, url, lineNo, charNo) => {
//   const culprit = stack[0]
//   if (!culprit) return stack
//   if (!culprit.fileName) culprit.setFileName(url)
//   if (!culprit.lineNumber) culprit.setLineNumber(lineNo)
//   if (!culprit.columnNumber) {
//     if (charNo !== undefined) {
//       culprit.setColumnNumber(charNo)
//     } else if (window.event && window.event.errorCharacter) {
//       culprit.setColumnNumber(window.event && window.event.errorCharacter)
//     }
//   }
//   return stack
// }
