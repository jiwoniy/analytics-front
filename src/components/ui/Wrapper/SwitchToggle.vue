<template>
  <div class="Toggle-Switch__container">
    <label class="switch">
      <input
        :disabled="!isUnLock"
        type="checkbox"
        @input="eventHandler"
        :checked="value">
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'Toggle-Switch-Comp',
  props: {
    isUnLock: {
      type: Boolean,
      required: () => false
    },
    propsValue: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      value: false
    }
  },
  methods: {
    eventHandler () {
      const current = this.value
      this.$emit('wrapperEvent', !current)
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

<style lang="scss" scoped>
.Toggle-Switch__container {
  position: relative;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  /* -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px); */
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
