<template>
  <div
    class="select-wrapper"
    :id="compId"
  >
    <select
      :id="`selectComp${compId}`"
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
        :value="entry.value"
      > {{ entry.value }}
      </option>
    </select>

  </div>
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
  /*hide original SELECT element:*/
  display: none;
  width: calc(100% - 0.4rem);
}

</style>
