import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import common from './common'
import pipelineMeta from './pipelineMeta'
import myProject from './myProject'

import configureMediator from '@/helper/mediator'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common,
    pipelineMeta,
    myProject
    // auth
  },

  strict: debug,
  // plugins: []
  plugins: debug ? [createLogger(), configureMediator] : [configureMediator]
})
