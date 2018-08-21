<template>
  <div class="textarea__container">
    <textarea
      @focus="onFocus"
      :value="value"
      :disabled="!isUnLock"
    />
  </div>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'Wrapper-Textarea',
  props: {
    isUnLock: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: [String, Number],
      default: () => ''
    }
  },
  methods: {
    eventHandler (value) {
      this.$emit('wrapperEvent', value)
    },
    onFocus () {
      eventController.SHOW_MODAL({
        position: 'center',
        size: 'medium',
        contentComponent: 'CodeEditor',
        params: {
          codeValue: this.value,
          mode: 'python',
          readOnly: false,
          callback: this.eventHandler
        }
      })
    }
  }
}
</script>

<style scoped>
.textarea__container {
  background-color: #ffffff;
  /* width: 100%; */
}

.textarea__container textarea {
  width: 100%;
  height: 200px;
  resize: none;
}
</style>
