<template>
  <div class="dropdown__container">
    <v-select
      multiple
      :disabled="!isUnLock"
      :options="options"
      :value="value"
      :on-change="onChange">
    </v-select>
  </div>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'

export default {
  name: 'Wrapper-Multi-Dropdown',
  props: {
    placeholder: {
      type: String,
      default: () => 'select value'
    },
    isUnLock: {
      type: Boolean,
      default: () => false
    },
    options: {
      type: Array,
      default: () => []
    },
    propsValue: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      value: null,
      isInit: true
    }
  },
  methods: {
    onChange (selectOption) {
      if (selectOption) {
        this.$emit('wrapperEvent', selectOption)
      }
    }
  },
  mounted () {
    if (this.propsValue) {
      this.value = _cloneDeep(this.propsValue)
    }
  },
  watch: {
    propsValue (newValue) {
      this.value = _cloneDeep(this.propsValue)
    }
  }
}
</script>

<style scoped>
.dropdown__container {
}
</style>
