<template>
  <section
    id="rightPanel"
    class="right-panel__page"
  >

    <transition name="fade">
      <slot name="data-manage"></slot>
    </transition>

  </section>
</template>

<script>
export default {
  name: 'Right-Panel'
}
</script>

<style lang="scss" scoped>
.right-panel__page {
  display: block;
  position: relative;
  margin: 0 10px;
  background-color: #ffffff;
}

.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(calc(100% - 250px));
  }
}
</style>
