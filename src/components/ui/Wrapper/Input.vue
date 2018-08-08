<template>
  <div class="input-wrapper">
    <label v-if="!isUnLock">
      {{ value }}
    </label>
    <input
      v-if="isUnLock"
      :type="inputType"
      @input="eventHandler"
      :value="value" />
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Input',
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
.input-wrapper {
  width: 100%;
}

.input-wrapper input {
  width: calc(100% - 0.4rem);
}
</style>
