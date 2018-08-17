<template>
  <div class="Wrapper__container">
    <wrapper-input
      v-if="uiType === 'input'"
      :is-un-lock="isUnLock"
      v-model="itemValue"
      @wrapperEvent="wrapperEvent">
    </wrapper-input>
    <wrapper-selection
      v-if="uiType === 'selector'"
      :is-un-lock="isUnLock"
      v-model="itemValue"
      @wrapperEvent="wrapperEvent">
    </wrapper-selection>
    <wrapper-textarea
      v-if="uiType === 'textarea'"
      :is-un-lock="isUnLock"
      v-model="itemValue"
      @wrapperEvent="wrapperEvent">
    </wrapper-textarea>
  </div>
</template>

<script>
import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'
import WrapperSelection from '@/components/ui/Wrapper/Selection'
import WrapperTextarea from '@/components/ui/Wrapper/Textarea'

export default {
  name: 'Wrapper-UI-Container',
  components: {
    WrapperButton,
    WrapperInput,
    WrapperTextarea,
    WrapperSelection
  },
  props: {
    isUnLock: {
      type: Boolean,
      default: () => false
    },
    uiType: {
      type: String,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    },
    itemValue: {
      type: [String, Number],
      required: true
    },
    wrapperEvent: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.Wrapper__container {
  position: relative;
}

.Wrapper__container .property-item {
  margin: 0.2rem;
}
</style>
