<template>
  <transition>
    <div class="div--project__page">
      <main-panel></main-panel>
      <modal v-if="showModal" @close="showModal = false" :size="modalSize" :position="modalPosition">
        <h3 slot="header">custom header</h3>
      </modal>
    </div>
  </transition>
</template>

<script>
import eventController from '@/utils/EventController'
import MainPanel from '@/components/panel/Main'

export default {
  name: 'project',
  components: {
    MainPanel
  },
  data () {
    return {
      showModal: false,
      modalSize: 'small',
      modalPosition: 'center'
    }
  },
  mounted () {
    eventController.addListner('SHOW_MODAL', (payload) => {
      const { position, size } = payload
      this.showModal = true
      if (position) {
        this.modalPosition = position
      }

      if (size) {
        this.modalSize = size
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.div--project__page {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
</style>
