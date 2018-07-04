<template>
  <transition>
    <section class="main-panel__page">
      <div ref="dragable">
        <left-panel
          id="leftPanel"
          v-show="isLeftPanelShow"
          :blocks="blocks"
        >
        </left-panel>
        <work-panel
          id="rightPanel"
          class="Working__page"
          :class="{ 'isLeftActive': isLeftPanelShow }"
        >
        </work-panel>
      </div>

      <right-panel v-show="isRightPanelShow"></right-panel>
    </section>
  </transition>
</template>

<script>
import dragula from 'dragula'
import faker from 'faker'

import { eventsBus, events } from '@/events'

import LeftPanel from '@/components/panel/Left'
import RightPanel from '@/components/panel/Right'
import WorkPanel from '@/components/panel/Working'

export default {
  name: 'Work-Panel',
  components: {
    LeftPanel,
    RightPanel,
    WorkPanel
  },
  data () {
    return {
      blocks: [],
      isLeftPanelShow: true,
      isRightPanelShow: false
    }
  },
  created () {
    for (let i = 0; i <= 10; i += 1) {
      this.blocks.push({
        id: i,
        title: faker.company.bs()
      })
    }
  },
  mounted () {
    eventsBus.$on(events.LEFT_PANEL, (payload) => {
      const { open } = payload
      this.isLeftPanelShow = open
    })

    eventsBus.$on(events.RIGHT_PANEL, (payload) => {
      const { open } = payload
      this.isRightPanelShow = open
    })

    dragula([document.getElementById('leftPanel'), document.getElementById('rightPanel')], {
      isContainer: function (el) {
        // only elements in drake.containers will be taken into account
        return false
      },
      moves: function (el, source, handle, sibling) {
        // elements are always draggable by default
        if (source.id === 'leftPanel') {
          return true
        }
        return false
      },
      accepts: function (el, target, source, sibling) {
        // elements can be dropped in any of the `containers` by default
        if (target.id === 'rightPanel' && source.id === 'leftPanel') {
          return true
        }
        return false
      },
      invalid: function (el, handle) {
        // don't prevent any drags from initiating by default
        return false
      },
      copy: true
    })
      .on('drag', (el) => {
        // console.log('--drag--')
        // console.log(el)
        el.classList.add('is-moving')
      })
      .on('drop', (block, list) => {
        // console.log('--drop--')
        // console.log(block)
        // console.log(list)
        let index = 0
        for (index = 0; index < list.children.length; index += 1) {
          if (list.children[index].classList.contains('is-moving')) break
        }
        this.$emit('update-block', block.dataset.blockId, list.dataset.status, index)
      })
      .on('dragend', (el) => {
        el.classList.remove('is-moving')
        window.setTimeout(() => {
          el.classList.add('is-moved')
          window.setTimeout(() => {
            el.classList.remove('is-moved')
          }, 600)
        }, 100)
      })
  }
}
</script>

<style lang="scss" scoped>
.main-panel__page {
  display: flex;
}
.main-panel__page .Working__page.isLeftActive {
  margin-left: 250px;
}
</style>
