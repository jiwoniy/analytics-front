<template>
  <div id="app">
    <!-- <div id="tf-widget-container"></div> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
  // mounted () {
  //   /* eslint-disable no-new */
  //   /* eslint-disable no-undef */
  //   new ChatWidget(document.getElementById('tf-widget-container'), {
  //     provider_id: 10
  //   })
  // }
}
</script>

<style lang="scss">
@import './styles/global.scss';
</style>

<style>
html {
  height: 100%;
}

head {
  height: 0px;
}

body {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  height: 100%;
}
</style>
