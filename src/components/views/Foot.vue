<template>
  <footer id="Footer" class="Footer__section">

    <div v-if="!isOpen" class="footer--fixed">
      <span @click="openReport" class='report'> {{ $t('Report') }} </span>
    </div>

    <div v-show="isOpen" class="report">
      <div id="draggable" class="split" draggable="true"></div>
      <div class="area">
        <img class="close" @click="closeRerpot" src="/static/img/times-solid.svg" />
        <slot></slot>
      </div>
    </div>

  </footer>
</template>

<script>

export default {
  name: 'Footer-Section',
  i18n: {
    messages: {
      'en': {
        'Report': 'Report'
      },
      'ko': {
        'Report': '리포트'
      }
    }
  },
  data () {
    return {
      Footer: null,
      draggable: null,
      isOpen: false
    }
  },
  methods: {
    // drag (event) {
    // },
    // dragStart () {
    // },
    dragEnd (event) {
      this.Footer.style.height = `${window.innerHeight - event.screenY}px`
    },
    openReport () {
      this.isOpen = true
      this.Footer.style.height = '300px'
    },
    closeRerpot () {
      this.isOpen = false
      this.Footer.style.height = '30px'
    }
  },
  mounted () {
    this.Footer = document.getElementById('Footer')
    this.draggable = document.getElementById('draggable')
    this.draggable.addEventListener('dragend', this.dragEnd, true)
  }
}
</script>

<style lang="scss" scoped>
.Footer__section {
  position: fixed;
  width: 100%;
  background-color: #ffffff;
  height: var(--app-foot-panel-height);
  bottom: 0px;
}

.footer--fixed {
  width: 100%;
  height: var(--app-foot-panel-height);
  .report {
    padding: 0.4rem;
    cursor: pointer;
    font: italic bold 12px/30px Georgia, serif;
  }
  // background: no-repeat url('~/static/img/report.svg');
}

.report {
  width: 100%;
  position: relative;

  .split {
    width: 100%;
    height: 5px;
    cursor: row-resize;
    background-color: #eee;
    background-repeat: no-repeat;
    border-bottom: 2px solid gray;
  }

  .area {
    height: calc(100% - 10px);
    background-color: #ffffff;
  }

  .close {
    position: absolute;
    right: 0px;
    width: 30px;
    height: 30px;
    color: #676a6c;
  }
}
</style>
