<template>
  <div class="textarea-wrapper">
    <label v-if="!isUnLock">
      {{ value }}
    </label>
    <textarea
      @focus="onFocus"
      v-if="isUnLock"
      :value="value"
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
.textarea-wrapper {
  width: 100%;
}

.textarea-wrapper textarea{
  width: calc(100% - 0.4rem);
  height: 10rem;
  resize: none
}
</style>
