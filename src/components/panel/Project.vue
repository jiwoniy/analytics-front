<template>
  <transition>
    <div class="div--Project__page">
      <main-panel></main-panel>
      <modal v-if="showModal" @close="showModal = false" :size="modalSize" :position="modalPosition">
        <h3 slot="header">custom header</h3>
      </modal>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

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
  methods: {
    ...mapActions({
      getProjects: 'myProject/getProjects'
    })
  },
  created () {
    this.getProjects()
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
.div--Project__page {
  height: 100%;
  display: flex;
  flex-direction: row;
}
</style>
