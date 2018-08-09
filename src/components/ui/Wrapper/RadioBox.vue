<template>
  <div>
    <div
      class="radio-wrapper"
      v-for="(option) in options"
      :key="option.id">
        <input
          type="radio"
          @input="eventHandler"
          :name="name"
          :value="option.value">
        <label> {{ option.label }} </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Radio',
  props: {
    isUnLock: {
      type: Boolean,
      default: () => false
    },
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    eventHandler (event) {
      if (this.isUnLock) {
        this.$emit('wrapperEvent', event.target.value)
      }
    }
  }
}
</script>

<style scoped>
.radio-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.radio-wrapper input {
  margin: 0px 0.4rem;
}
</style>
