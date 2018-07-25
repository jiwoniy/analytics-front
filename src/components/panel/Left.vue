<template>
  <section
    id="leftPanel"
    class="left-panel__page"
  >
    <transition name="fade">
      <div class="left-panel__contents">
        <h-accordion
          :worksheet-list="worksheetList"
          :selected-worksheet="selectedWorksheet"
        >
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
  </section>
</template>

<script>
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
    worksheetList: {
      type: Array,
      default: () => []
    },
    selectedWorksheet: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel__page {
  width: 100%;
  position: relative;
  display: block;

  .left-panel__contents {
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
