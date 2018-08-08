<template>
  <transition>
    <section class="create-worksheet">

      <div class="contents header">
        <h1> {{ $t('Create Worksheet') }} </h1>
      </div>

      <div class="contents body">
        <label>
          {{ $t('Worksheet name') }}
        </label>
        <wrapper-input
          :is-un-lock="true"
          v-model="worksheetName"
          @wrapperEvent="(value) => wrapperEvent('worksheetName', value)">
        </wrapper-input>

        <label>
          {{ $t('Description') }}
        </label>
        <wrapper-textarea
          :is-un-lock="true"
          v-model="worksheetDesc"
          @wrapperEvent="(value) => wrapperEvent('worksheetDesc', value)">
        </wrapper-textarea>
      </div>

      <div class="contents bottom" >
        <wrapper-button
          :click-event="clickCreateWorksheet"
          :button-text="$t('Create')">
        </wrapper-button>
        <wrapper-button
          :click-event="clickCancel"
          :button-text="$t('Cancel')">
        </wrapper-button>
      </div>
    </section>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'
import WrapperTextarea from '@/components/ui/Wrapper/Textarea'

export default {
  name: 'Create-Worksheet',
  components: {
    WrapperButton,
    WrapperInput,
    WrapperTextarea
  },
  i18n: {
    messages: {
      'en': {
        'Create': 'Create',
        'Cancel': 'Cancel',
        'Create Worksheet': 'Create Worksheet',
        'Worksheet name': 'Worksheet name',
        'Description': 'Description'
      },
      'ko': {
        'Create': '생성',
        'Cancel': 'Cancel',
        'Create Worksheet': '워크시트 생성',
        'Worksheet name': '워크시트명',
        'Description': '설명'
      }
    }
  },
  data () {
    return {
      worksheetName: '',
      worksheetDesc: ''
    }
  },
  props: {
    // get from modal comp
    modalClose: {
      type: Function,
      default: () => null
    }
  },
  methods: {
    ...mapActions({
      createWorksheet: 'myProject/createWorksheet'
    }),
    wrapperEvent (key, value) {
      this[key] = value
    },
    clickCreateWorksheet () {
      if (this.worksheetName && this.worksheetName.length) {
        this.createWorksheet({
          worksheetName: this.worksheetName,
          worksheetDesc: this.worksheetDesc
        })
        if (this.modalClose) {
          this.modalClose()
        }
      }
    },
    clickCancel () {
      if (this.modalClose) {
        this.modalClose()
      }
    }
  }
}
</script>

<style lang="scss" scroped>
.create-worksheet {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 400px;
  height: 300px;
  background-color: #eee;

  .contents {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}
</style>
