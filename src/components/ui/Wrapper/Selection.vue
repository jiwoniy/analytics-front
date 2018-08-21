<template>
  <div
    class="select__container"
    :id="compId"
  >
    <select
      :id="`selectComp${compId}`"
      @change="eventHandler"
      :disabled="!isUnLock"
    >
      <option
        v-if="showPlaceholder"
        disabled
      > {{ placeholder }} </option>
      <option
        id="selectOption"
        v-for="(entry, idx) in options"
        :key="`options-${idx}`"
        :value="entry.value"
      > {{ entry.value }}
      </option>
    </select>

  </div>
</template>

<script>
export default {
  name: 'Wrapper-Selector-Comp',
  props: {
    isUnLock: {
      type: Boolean,
      default: () => false
    },
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
      required: true
    },
    propsValue: {
      type: Object,
      required: true
    }
  },
  beforeMount () {
    this.compId = this._uid
  },
  data () {
    return {
      compId: null,
      selectComp: null
    }
  },
  methods: {
    eventHandler (event) {
      this.setFindIndex(event.target.value)
      const option = this.options.find(option => option.value === event.target.value)
      this.$emit('wrapperEvent', option)
    },
    setFindIndex (currentValue) {
      const index = this.options.findIndex(option => option.value === currentValue)
      this.selectComp.selectedIndex = index
    }
  },
  mounted () {
    this.selectComp = document.getElementById(`selectComp${this.compId}`)
    if (this.propsValue && this.propsValue.value) {
      this.setFindIndex(this.propsValue.value)
    }
  },
  watch: {
    propsValue (newValue) {
      this.setFindIndex(newValue.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.select__container {
  width: 100%
}

.select__container select {
  /*hide original SELECT element:*/
  width: calc(100% - 0.4rem);
}

</style>
