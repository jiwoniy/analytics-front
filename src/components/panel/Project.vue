<template>
  <transition>
    <div class="div--project__page">
      <main-panel></main-panel>
      <modal
        v-show="showModal"
        @close="modalClose"
        :size="modal.modalSize"
        :position="modal.modalPosition"
        :pass-params="modal.passModalParams"
        :is-need-accept="modal.isNeedAccept"
      >
        <h3 slot="header"> custom header </h3>
      </modal>
    </div>
  </transition>
</template>

<script>
import eventController from '@/utils/EventController'
import MainPanel from '@/components/panel/Main'

export default {
  name: 'Project',
  components: {
    MainPanel
  },
  data () {
    return {
      modal: {
        modalSize: 'small',
        modalPosition: 'center',
        passModalParams: null,
        isNeedAccept: false,
        callback: null
      },
      showModal: false
    }
  },
  methods: {
    modalClose (accept) {
      if (this.modal.isNeedAccept) {
        if (this.modal.callback) {
          this.modal.callback(accept)
        }
        this.showModal = false
      } else {
        this.showModal = false
      }
    }
  },
  mounted () {
    eventController.addListner('SHOW_MODAL', (payload) => {
      const { position, size, params, isNeedAccept, callback } = payload
      this.showModal = true
      this.modal.passModalParams = params || null
      this.modal.isNeedAccept = isNeedAccept || false
      this.modal.callback = callback || null

      if (position) {
        this.modal.modalPosition = position
      }

      if (size) {
        this.modal.modalSize = size
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
