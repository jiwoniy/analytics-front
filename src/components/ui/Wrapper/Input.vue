<template>
  <input :type="inputType" @input="eventHandler" :value="value"/>
</template>

<script>
export default {
  name: 'Wrapper-Input',
  props: {
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
