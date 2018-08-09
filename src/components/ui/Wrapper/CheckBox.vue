<template>
  <div class="checkbox-wrapper">
    <input
      type="checkbox"
      @input="eventHandler"
    />
    <label>
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'Wrapper-CheckBox',
  props: {
    isUnLock: {
      type: Boolean,
      default: () => false
    },
    label: {
      type: String,
      default: () => 'lksdjlksf'
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
.checkbox-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.checkbox-wrapper input {
  margin: 0px 0.4rem;
}
</style>
