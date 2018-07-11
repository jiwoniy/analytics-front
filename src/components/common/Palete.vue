<template>
  <transition>
    <div id="svgContainer" class="palete"></div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as d3Selection from 'd3-selection'

import eventController from '@/utils/EventController'
import GraphCreator from '@/utils/graph/graph-creator'

export default {
  name: 'Svg-palete',
  data () {
    return {
      svgContainer: null,
      svgGraph: null,
      leftPanelWidth: null
    }
  },
  props: {
    openRightPanel: {
      type: Function,
      default: () => {}
    },
    isOpenLeftPanel: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    ...mapGetters({
      currentWorkflow: 'workflow/getCurrentWorkflow'
    })
  },
  methods: {
    ...mapActions({
      setCurrentWorkflow: 'workflow/setCurrentWorkflow'
    }),
    svgContainerResize () {
      d3Selection.select('#svgContainer').select('svg')
        .attr('width', this.isOpenLeftPanel ? this.width : this.width + this.leftPanelWidth)
        .attr('height', this.height)
    },
    setGraph (svgContainer, options) {
      this.svgGraph = new GraphCreator(svgContainer, {
        ...options,
        nodeSelectCallback: this.nodeSelect,
        saveFile: this.currentWorkflow
      })
      this.svgGraph.setIdCt(2)
    },
    removeSvgGraph () {
      if (this.svgGraph) {
        this.svgContainer.remove()
      }
    },
    setSvgContainer () {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // TODO make constant
      const leftPanelWidth = 250
      const topPanelHeight = 50

      const margin = { top: 10, right: 10, bottom: 10, left: 10 }
      this.width = windowWidth - leftPanelWidth - margin.left - margin.right
      this.height = windowHeight - topPanelHeight - margin.top - margin.bottom

      this.svgContainer = d3Selection.select('#svgContainer').append('svg')
        .attr('width', this.width)
        .attr('height', this.height)

      this.setGraph(this.svgContainer, {
        width: this.width,
        height: this.height
      })
    },
    nodeSelect (nodeItem) {
      if (nodeItem.status.selected) {
        this.openRightPanel({
          open: true,
          item: nodeItem
        })
      } else {
        this.openRightPanel({
          open: false
        })
      }
    },
    init () {
      this.setSvgContainer()
    }
  },
  mounted () {
    eventController.addListner('SEND_DATA_TRANSFER', (payload) => {
      const { data } = payload
      this.svgGraph.addNode(data)
    })

    eventController.addListner('SAVE', () => {
      const saveFile = this.svgGraph.save()
      this.setCurrentWorkflow(saveFile)
    })

    eventController.addListner('EDIT', () => {
      this.svgGraph.setEditable(true)
    })

    eventController.addListner('REFRESH', () => {
      this.removeSvgGraph()
    })

    eventController.addListner('LOAD', () => {
      this.removeSvgGraph()
      this.setSvgContainer()
    })

    this.init()

    this.$nextTick(() => {
      this.leftPanelWidth = document.getElementById('leftPanel').offsetWidth
    })
  },
  watch: {
    isOpenLeftPanel (newVal) {
      this.svgContainerResize()
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/graph-creator.scss';
</style>

<style lang="scss" scoped>
.palete {
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgb(248, 248, 248)
}
</style>
