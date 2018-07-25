<template>
  <input :type="inputType" />
</template>

<script>
export default {
  name: 'Wrapper-Input',
  data () {
    return {
      inputType: 'text'
    }
  }
}
</script>

<style scoped>
</style>
