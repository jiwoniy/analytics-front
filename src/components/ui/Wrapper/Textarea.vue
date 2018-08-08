<template>
  <div class="textarea-wrapper">
    <label v-if="!isUnlock">
      {{ value }}
    </label>
    <textarea v-if="isUnlock" @input="eventHandler" :value="value" />
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Textarea',
  props: {
    isUnlock: {
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
}
</style>
