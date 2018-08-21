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
    <dropdown
      v-if="uiType === 'dropdown'"
      :is-un-lock="isUnLock"
      :options="options"
      :props-value="itemValue"
      @wrapperEvent="wrapperEvent">
    </dropdown>
    <multi-dropdown
      v-if="uiType === 'multi_dropdown'"
      :is-un-lock="isUnLock"
      :options="options"
      :props-value="itemValue"
      @wrapperEvent="wrapperEvent">
    </multi-dropdown>
    <switch-toggle
      v-if="uiType === 'switch-toggle'"
      :is-un-lock="isUnLock"
      :props-value="itemValue"
      @wrapperEvent="wrapperEvent">
    </switch-toggle>
    <wrapper-radio
      v-if="uiType === 'radio'"
      :is-un-lock="isUnLock"
      :options="options"
      :props-value="itemValue"
      @wrapperEvent="wrapperEvent">
    </wrapper-radio>
  </div>
</template>

<script>
import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'
import WrapperSelection from '@/components/ui/Wrapper/Selection'
import WrapperTextarea from '@/components/ui/Wrapper/Textarea'
import WrapperRadio from '@/components/ui/Wrapper/Radios'
import Dropdown from '@/components/ui/Wrapper/Dropdown'
import MultiDropdown from '@/components/ui/Wrapper/MultiDropdown'
import SwitchToggle from '@/components/ui/Wrapper/SwitchToggle'

export default {
  name: 'Wrapper-UI-Container',
  components: {
    WrapperButton,
    WrapperInput,
    WrapperTextarea,
    WrapperSelection,
    WrapperRadio,
    Dropdown,
    MultiDropdown,
    SwitchToggle
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
      type: [String, Number, Object, Array, Boolean],
      required: true
    },
    wrapperEvent: {
      type: Function,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
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
