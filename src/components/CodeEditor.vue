<template>
  <section class="Editor__section">
    <div class="editor__container">
      <textarea
        id="codeEditor"
        v-model="codeValue">
      </textarea>
    </div>

    <div class="modal-bottom__container" >
      <wrapper-button
        :click-event="clickOk"
        :button-text="$t('Ok')">
      </wrapper-button>
      <wrapper-button
        :click-event="clickCancel"
        :button-text="$t('Cancel')">
      </wrapper-button>
    </div>

  </section>
</template>

<script>
// https://codemirror.net/#description
import CodeMirror from 'codemirror'
import 'codemirror/mode/python/python'
import 'codemirror/mode/sql/sql'

import WrapperButton from '@/components/ui/Wrapper/Button'

export default {
  name: 'Editor-Section',
  components: {
    WrapperButton
  },
  props: {
    mode: {
      type: String,
      default: () => 'python'
    },
    passModalParams: {
      type: Object,
      default: () => null
    },
    modalClose: {
      type: Function,
      default: () => null
    }
  },
  data () {
    return {
      codeValue: '',
      originalCode: null,
      readOnly: false
    }
  },
  i18n: {
    messages: {
      'en': {
        'Ok': 'Ok',
        'Cancel': 'Cancel'
      },
      'ko': {
        'Ok': '적용',
        'Cancel': '취소'
      }
    }
  },
  methods: {
    clickOk () {
      if (this.passModalParams.callback) {
        this.passModalParams.callback(this.codeValue)
      }

      if (this.modalClose) {
        this.modalClose()
      }
    },
    clickCancel () {
      if (this.modalClose) {
        this.modalClose()
      }
    }
  },
  mounted () {
    this.originalCode = document.getElementById('codeEditor')
    if (this.passModalParams) {
      this.codeValue = this.passModalParams.codeValue
      this.originalCode.value = this.codeValue
      this.mode = this.passModalParams.mode
      this.readOnly = this.passModalParams.readOnly
    }

    const myCodeMirror = CodeMirror.fromTextArea(this.originalCode, {
      mode: this.mode,
      autofocus: true,
      lineNumbers: true,
      readOnly: this.readOnly
    })

    myCodeMirror.on('change', (cm, changes) => {
      myCodeMirror.save()
      if (!this.readOnly) {
        this.codeValue = cm.getValue()
      }
    })
  }
}
</script>

<style lang="scss" scroped>
@import 'codemirror/lib/codemirror.css';
.Editor__section {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.Editor__section {
  .editor__container {
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    height: 100%;
  }
}
</style>
