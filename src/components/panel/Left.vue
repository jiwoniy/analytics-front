<template>
  <section
    id="leftPanel"
    class="left-panel__page"
  >
    <transition name="fade">
      <div class="left-panel__contents" v-show="isShow">
        <h-accordion
          :project-list="projectList"
          :selected-project="selectedProject"
          :worksheet-list="worksheetList"
          :selected-worksheet="selectedWorksheet">

          <div
            class="pipeline-item"
            slot="pipeline-item"
            v-for="pipeline in pipelineNodes"
            :key="pipeline.id">
            <tree-items
              :tree-item="pipeline"
              :is-dragable="true">
            </tree-items>
          </div>

        </h-accordion>
      </div>
    </transition>
    <div class="folder__button" @click="closeLeftPanel">
      <i v-if="isShow" class="fa fa-angle-double-left" style="font-size:24px"></i>
      <i v-if="!isShow" class="fa fa-angle-double-right" style="font-size:24px"></i>
    </div>
  </section>
</template>

<script>
import eventController from '@/utils/EventController'
import TreeItems from '@/components/ui/TreeItems'
import HAccordion from '@/components/ui/HAccordion'

export default {
  name: 'LEFT-Panel',
  components: {
    HAccordion,
    TreeItems
  },
  props: {
    pipelineNodes: {
      type: Array,
      default: () => []
    },
    projectList: {
      type: Array,
      default: () => []
    },
    selectedProject: {
      type: Object,
      default: () => {}
    },
    worksheetList: {
      type: Array,
      default: () => []
    },
    selectedWorksheet: {
      type: Object,
      default: () => {}
    },
    isShow: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    closeLeftPanel () {
      eventController.LEFT_PANEL({ open: !this.isShow })
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel__page {
  position: relative;
  display: block;
  // overflow-x: hidden;
  // overflow-y: auto;
  // width: var(--app-left_panel-width);

  .left-panel__contents {
    width: var(--app-left-panel-width);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .left-panel__contents .pipeline-item {
    cursor: pointer;
    margin: 10px;
    background: rgba(black, 0.4);
  }
}

.left-panel__page .folder__button {
  display: block;
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: calc(0px - var(--app-left-panel-folder-button));
  width: var(--app-left-panel-folder-button);
  height: var(--app-left-panel-folder-button);
  z-index: var(--app-left-panel-zIndex);
  i {
    position: relative;
    top: 40%;
    transform: perspective(1px) translateY(-50%);
  }
}

.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  0% {
    transform: translateX(-250px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
