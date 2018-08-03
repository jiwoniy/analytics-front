<template>
  <div>
    <label v-if="!isEditable">
      {{ value }}
    </label>
    <input v-if="isEditable" :type="inputType" @input="eventHandler" :value="value" />
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Input',
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
  data () {
    return {
      inputType: 'text'
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
</style>
