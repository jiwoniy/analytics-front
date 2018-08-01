import projetSchema from '@/api/mockup/project-schema.json'
import worksheetSchema from '@/api/mockup/worksheets-schema.json'
import pipelinesSchema from '@/api/mockup/pipelines-schema.json'

const localStorage = window.localStorage

function StorageFun () {
  this.storage = {
    projects: JSON.parse(window.localStorage.getItem('projects')) || projetSchema.projects,
    worksheets: JSON.parse(window.localStorage.getItem('worksheets')) || worksheetSchema.worksheets,
    pipelines: JSON.parse(window.localStorage.getItem('pipelines')) || pipelinesSchema.pipelines
  }
  return {
    // projects
    getProjects: () => {
      return this.storage.projects
    },

    // worksheets
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
    },

    // pipelines
    getPipelines: (worksheetId) => {
      return this.storage.pipelines[worksheetId]
    },
    updatePipeline: (projectId, worksheetId, pipeline) => {
      const currentPipeline = this.storage.pipelines[worksheetId]
      console.log(currentPipeline)
      // const findIndex = currentProjectWorksheet.findIndex(worksheet => worksheet.id === worksheetId)
      // this.storage.worksheets[projectId][findIndex] = worksheet
      // localStorage.setItem('worksheets', JSON.stringify(this.storage.worksheets))
      // return this.storage.worksheets[projectId][findIndex]
    }
  }
}

// localStorage.clear()
const storageFun = new StorageFun()

export default storageFun
