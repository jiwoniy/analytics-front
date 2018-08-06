import uuidv4 from 'uuid/v4'

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
    createProject: ({ projectName, projectDesc }) => {
      const projectId = uuidv4()
      const newProject = {
        id: projectId,
        name: projectName,
        desc: projectDesc
      }
      this.storage.projects.push(newProject)
      localStorage.setItem('projects', JSON.stringify(this.storage.projects))
      this.storage.worksheets[projectId] = []
      localStorage.setItem('worksheets', JSON.stringify(this.storage.worksheets))
      return newProject
    },

    // worksheets
    getWorksheets: (projectId) => {
      return this.storage.worksheets[projectId]
    },
    createWorksheet: (projectId, { worksheetName, worksheetDesc }) => {
      const worksheetId = uuidv4()
      const newWorksheet = {
        id: worksheetId,
        name: worksheetName,
        desc: worksheetDesc
      }

      if (this.storage.worksheets[projectId]) {
        this.storage.worksheets[projectId].push(newWorksheet)
      } else {
        this.storage.worksheets[projectId] = []
        this.storage.worksheets[projectId].push(newWorksheet)
      }

      localStorage.setItem('worksheets', JSON.stringify(this.storage.worksheets))
      return newWorksheet
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
      this.storage.pipelines[worksheetId] = {
        nodes: pipeline.nodes || {},
        links: pipeline.links || {}
      }
      localStorage.setItem('pipelines', JSON.stringify(this.storage.pipelines))
      return this.storage.pipelines[worksheetId]
    }
  }
}

// localStorage.clear()
const storageFun = new StorageFun()

export default storageFun
