<template>
  <div class="checkbox__container">
    <input
      type="checkbox"
      :disabled="!isUnLock"
      @input="eventHandler"
    />
    <label>
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'Wrapper-CheckBox-Comp',
  props: {
    isUnLock: {
      type: Boolean,
      default: () => false
    },
    label: {
      type: String,
      default: () => 'label'
    },
    propsValue: {
      type: Boolean,
      required: () => false
    }
  },
  data () {
    return {
      value: false
    }
  },
  methods: {
    eventHandler () {
      this.$emit('wrapperEvent', !this.value)
    }
  },
  mounted () {
    this.value = this.propsValue
  },
  watch: {
    propsValue (newValue) {
      this.value = newValue
    }
  }
}
</script>

<style scoped>
.checkbox__container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.checkbox__container input {
  margin: 0px 0.4rem;
}
</style>
