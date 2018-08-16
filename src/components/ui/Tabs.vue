<template>
  <section class="tabs__section">
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
</template>

<script>
export default {
  name: 'Tabs-Section',
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

<style lang="scss" scoped>
.tabs__section {
  width: 100%;
  ul {
    list-style: none;
    display: flex;
    flex: 1 0 0;
  }
}

.tabs__section .tabs {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
