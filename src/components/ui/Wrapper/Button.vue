<template>
  <button class="button__default">
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
    }
  }
}
</script>

<style lang="scss" scoped>
.button__default {
  background-color: var(--app-button-color);
  border: none;
  color: white;
  padding: 0.9rem 1.8rem;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
}
</style>
