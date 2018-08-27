<template>
  <section class="Readonly-palete__section">
    <Split>
      <SplitArea :size="80">
        <svg-palete
          :read-only="readOnly">
        </svg-palete>
      </SplitArea>

      <SplitArea :size="20">
        <node-manager
          :read-only="readOnly">
        </node-manager>
      </SplitArea>
    </Split>

    <div class="modal-close" @click="modalClose">
      <img src="/static/img/close-solid.svg" />
    </div>

  </section>
</template>

<script>
import NodeManager from '@/components/NodeManager'
import SvgPalete from '@/components/common/Palete'

export default {
  name: 'Readonly-Palete-Section',
  components: {
    SvgPalete,
    NodeManager
  },
  props: {
    readOnly: {
      type: Boolean,
      default: () => false
    },
    // get from modal comp
    modalClose: {
      type: Function,
      default: () => null
    }
  },
  data () {
    return {
      split_size: {
        left: 80,
        right: 20
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Readonly-palete__section {
  position: relative;
  width: 100%;
  height: 100%;

  .modal-close {
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 45px;
    height: 45px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
