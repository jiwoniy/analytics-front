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
// @input="eventHandler" :value="value"
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
    eventHandler (event) {
      this.$emit('wrapperEvent', event.target.value)
    },
    onFocus () {
      eventController.SHOW_MODAL({
        position: 'center',
        size: 'large',
        params: {
          codeValue: this.value,
          mode: 'python'
        },
        contentComponent: 'CodeEditor'
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
  resize: 'none'
}
</style>
