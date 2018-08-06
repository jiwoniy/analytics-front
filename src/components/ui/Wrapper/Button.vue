<template>
  <button class="button-wrapper" @click="clickEvent">
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  name: 'Wrapper-Button',
  props: {
    buttonText: {
      type: String,
      default: () => ''
    },
    clickEvent: {
      type: Function,
      default: () => null
    }
  }
}
</script>

<style scoped>
.button-wrapper {
  background-color: var(--app-button-color);
  border: none;
  color: white;
  padding: 0.9rem 1.8rem;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
}
</style>
