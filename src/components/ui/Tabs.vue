<template>
  <transition>
    <section class="tabs-container">
      <ul class="tabs">
        <li v-for="(tab, idx)  in tabs"
          :class="{ 'is-active': tab.isActive }"
          :key="`tab${idx}`"
        >
          <p @click="selectTab(tab)">
            {{ tab.name }}
          </p>
        </li>
      </ul>

      <div class="tabs-details">
        <slot></slot>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'Tabs',
  data () {
    return {
      tabs: []
    }
  },
  created () {
    this.tabs = this.$children
  },
  methods: {
    selectTab (selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
    }
  }
}
</script>

<style scoped>
.tabs-container {
  width: 100%;
}

.tabs-container .tabs {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

ul {
  list-style: none;
  display: flex;
  flex: 1 0 0;
}
</style>
