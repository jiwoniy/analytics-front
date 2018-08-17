import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import common from './common'
import websocket from './websocket'
import pipelineMeta from './pipelineMeta'
import myProject from './myProject'
import metaNode from './metaNode'

import configureMediator from '@/helper/mediator'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common,
    websocket,
    pipelineMeta,
    metaNode,
    myProject
    // auth
  },

  strict: debug,
  // plugins: []
  plugins: debug ? [createLogger(), configureMediator] : [configureMediator]
})
