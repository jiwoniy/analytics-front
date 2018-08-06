<template>
  <div class="textarea-wrapper">
    <label v-if="!isEditable">
      {{ value }}
    </label>
    <textarea v-if="isEditable" @input="eventHandler" :value="value" />
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Textarea',
  props: {
    isEditable: {
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
  width: 300px;
}
</style>
