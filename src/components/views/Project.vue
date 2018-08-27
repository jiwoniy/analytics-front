<template>
  <section class="Project__section">
    <main-panel></main-panel>
    <modal
      :modalId="'projectModal'"
      v-show="showModal"
      @close="modalClose"
      :size="modal.modalSize"
      :position="modal.modalPosition"
      :pass-modal-params="modal.passModalParams"
      :is-need-accept="modal.isNeedAccept"
      :content-component="modal.contentComponent"
    >
    </modal>
  </section>
</template>

<script>
import eventController from '@/utils/EventController'
import MainPanel from '@/components/views/Main'

export default {
  name: 'Project-Section',
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
        callback: null,
        contentComponent: null
      },
      showModal: false
    }
  },
  methods: {
    modalClose (accept) {
      if (this.modal.isNeedAccept) {
        this.modal.contentComponent = null
        if (this.modal.callback) {
          this.modal.callback(accept)
        }
        this.showModal = false
      } else {
        this.showModal = false
        this.modal.contentComponent = null
        if (this.modal.callback) {
          this.modal.callback()
        }
      }
    }
  },
  mounted () {
    eventController.addListner('SHOW_MODAL', (payload) => {
      const { position, size, params, isNeedAccept, callback, contentComponent } = payload
      this.showModal = true
      this.modal.passModalParams = params || null
      this.modal.isNeedAccept = isNeedAccept || false
      this.modal.callback = callback || null
      this.modal.contentComponent = contentComponent || null

      this.modal.modalPosition = position || 'center'
      this.modal.modalSize = size || 'small'
    })
  }
}
</script>

<style scoped>
.Project__section {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - var(--app-top-panel-height));
}
</style>
