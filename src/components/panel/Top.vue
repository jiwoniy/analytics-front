<template>
  <transition>
    <div class="top-panel__page">
      <button @click="save"> save </button>
    </div>
  </transition>
</template>

<script>
import eventController from '@/utils/EventController'

export default {
  name: 'TOP-Panel',
  methods: {
    save () {
      eventController.SAVE({})
    }
  }
}
</script>

<style lang="scss" scoped>
.top-panel__page {
  width: 100%;
  height: var(--app-top_panel-height);
}
</style>
