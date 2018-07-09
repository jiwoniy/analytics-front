<template>
  <div id="app">
    <!-- <div id="widgetContainer"></div> -->
    <router-view/>
  </div>
</template>

<script>
// import ChatWidget from '@/utils/widget'

export default {
  name: 'App'
  // mounted () {
  // console.log(window.ChatWidget)
  /* eslint-disable no-new */
  // new ChatWidget(document.getElementById('widgetContainer'))
  // new ChatWidget(document.getElementById('widgetContainer'), {})
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
