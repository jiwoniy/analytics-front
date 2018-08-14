<template>
  <div id="dtonic-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'RootApp'
}
</script>

<style lang="scss">
@import '@/styles/global.scss';
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
  margin: 0;
  padding: 0;
  font-size: 62.5%;
  box-sizing: content-box;
  /* 14px: 1.4rem, 16px: 1.6rem, 24px: 2.4rem */
}

#dtonic-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */

  height: 100%;
}

/* remove webkit~~ */
* {
  margin: 0;
  padding: 0;
}
</style>
