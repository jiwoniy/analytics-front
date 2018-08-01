import projetSchema from '@/api/mockup/project-schema.json'
import worksheetSchema from '@/api/mockup/worksheets-schema.json'

const localStorage = window.localStorage

function StorageFun () {
  this.storage = {
    projects: JSON.parse(window.localStorage.getItem('projects')) || projetSchema.projects,
    worksheets: JSON.parse(window.localStorage.getItem('worksheets')) || worksheetSchema.worksheets
  }
  return {
    getProjects: () => {
      return this.storage.projects
    },
    getWorksheets: (projectId) => {
      return this.storage.worksheets[projectId]
    },
    updateWorksheet: (projectId, worksheetId, worksheet) => {
      const currentProjectWorksheet = this.storage.worksheets[projectId]
      const findIndex = currentProjectWorksheet.findIndex(worksheet => worksheet.id === worksheetId)
      this.storage.worksheets[projectId][findIndex] = worksheet
      localStorage.setItem('worksheets', JSON.stringify(this.storage.worksheets))
      return this.storage.worksheets[projectId][findIndex]
    },
    deleteWorksheet: (projectId, worksheetId) => {
      const currentProjectWorksheet = this.storage.worksheets[projectId]
      const findIndex = currentProjectWorksheet.findIndex(worksheet => worksheet.id === worksheetId)
      currentProjectWorksheet.splice(findIndex, 1)
      this.storage.worksheets[projectId] = currentProjectWorksheet
      localStorage.setItem('worksheets', JSON.stringify(this.storage.worksheets))
      return 'success'
    }
  }
}

// function localStorageInit () {
// localStorage.clear()

// if (!localStorage.getItem('projects')) {
//   localStorage.setItem('projects', JSON.stringify(projetSchema.projects))
// }

// if (!localStorage.getItem('worksheets')) {
//   localStorage.setItem('worksheets', JSON.stringify(worksheetSchema.worksheets))
// }
// }

// function storageInit (storage) {
//   // localStorage.clear()
//   storage.projects = JSON.parse(window.localStorage.getItem('projects')) || projetSchema.projects
//   storage.worksheets = JSON.parse(window.localStorage.getItem('worksheets')) || worksheetSchema.worksheets
//   return storage
// }

// localStorageInit()
// storageInit()

const storageFun = new StorageFun()

export default storageFun
