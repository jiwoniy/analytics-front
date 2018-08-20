<template>
  <div class="dropdown__container">
    <v-select
      :options="options"
      v-model="value"
      :disabled="!isUnLock"
      :placeholder="placeholder"
      :on-change="onChange">
    </v-select>
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Dropdown',
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
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      value: {},
      isInit: true
    }
  },
  methods: {
    onChange (selectOption) {
      if (this.isUnLock && selectOption) {
        this.$emit('wrapperEvent', selectOption)
      }
    }
  },
  mounted () {
    if (this.propsValue) {
      this.value = this.propsValue
    }
  }
}
</script>

<style scoped>
.dropdown__container {
}
</style>
