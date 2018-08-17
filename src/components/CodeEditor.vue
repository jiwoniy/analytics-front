<template>
  <section class="Editor__section">
    <textarea
      id="codeEditor"
      class="code"
      v-model="codeValue">
    </textarea>
  </section>
</template>

<script>
// https://codemirror.net/#description
import CodeMirror from 'codemirror'
import 'codemirror/mode/python/python'
import 'codemirror/mode/sql/sql'

export default {
  name: 'Editor-Section',
  props: {
    mode: {
      type: String,
      default: () => 'python'
    },
    passModalParams: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      codeValue: '',
      originalCode: null
    }
  },
  mounted () {
    this.originalCode = document.getElementById('codeEditor')
    if (this.passModalParams) {
      this.codeValue = this.passModalParams.codeValue
      this.originalCode.value = this.codeValue
      this.mode = this.passModalParams.mode
    }

    const myCodeMirror = CodeMirror.fromTextArea(this.originalCode, {
      mode: this.mode,
      autofocus: true,
      lineNumbers: true
      // value: this.originalCode
      // readOnly: true
    })

    myCodeMirror.on('change', (cm, changes) => {
      myCodeMirror.save()
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

  .code {
    height: 100%;
    width: 100%;
  }
}
</style>
