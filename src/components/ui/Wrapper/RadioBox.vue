<template>
  <div class="radio__container">
    <div
      v-for="(option, idx) in options"
      :key="`radio-${idx}`">
        <input
          type="radio"
          :disabled="!isUnLock"
          @change="eventHandler(option)"
          :label="option.label"
          :value="option.value"
          :checked="option.value === selected.value"
        >
        <label> {{ option.label }} </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wrapper-Radio-Comp',
  props: {
    isUnLock: {
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
  data () {
    return {
      selected: {}
    }
  },
  methods: {
    eventHandler (option) {
      this.$emit('wrapperEvent', option)
    }
  },
  mounted () {
    if (this.propsValue) {
      this.selected = this.propsValue
    }
  },
  watch: {
    propsValue (newValue) {
      this.selected = newValue
    }
  }
}
</script>

<style scoped>
.radio__container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.radio__container input {
  margin: 0px 0.4rem;
}
</style>
