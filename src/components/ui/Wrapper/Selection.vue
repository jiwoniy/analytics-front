<template>
  <transition>
    <div
      class="select-wrapper"
      :id="compId"
    >
      <select
        :id="`selectComp${compId}`"
        :class="{ isDisable: isDisable, isSelected: !isSelected }"
        @change="selectChange"
        :disabled="isDisable"
      >
        <option
          v-if="showPlaceholder"
          disabled
        > {{ placeholder }} </option>
        <option
          id="selectOption"
          v-for="entry in options"
          :key="entry.id"
          :value="entry"
        > {{ entry.value }}
        </option>
      </select>
        <!-- <img
          alt="down"
          src="static/btn-caret-down.svg"
        > -->

    </div>
  </transition>
</template>

<script>
export default {
  name: 'Wrapper-Input',
  props: {
    placeholder: {
      type: String,
      default: () => 'select'
    },
    showPlaceholder: {
      type: Boolean,
      default: () => false
    },
    options: {
      type: Array,
      default: () => []
    },
    isDisable: {
      type: Boolean,
      default: () => false
    }
  },
  beforeMount () {
    this.compId = this._uid
  },
  data () {
    return {
      compId: null,
      selectComp: null,
      isSelected: false
    }
  },
  methods: {
    selectChange (event) {
      if (!this.isDisable) {
        // const option = this.options[event.target.options.selectedIndex - 1]
        // if (this.postSelectChangeFunction) {
        //   this.postSelectChangeFunction(option)
        // }
        this.isSelected = true
      }
    },
    init () {
      const findIndex = this.options.findIndex(option => option.value === this.initValue)
      this.selectComp = document.getElementById(`selectComp${this.compId}`)
      if (findIndex > -1) {
        this.isSelected = true
      }
      this.selectComp.selectedIndex = findIndex + 1
    }
  },
  mounted () {
    this.init()
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style lang="scss" scoped>
.select-wrapper {
  width: 100%
}

.select-wrapper select {
  width: calc(100% - 0.4rem);
}

</style>
