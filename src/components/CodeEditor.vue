<template>
  <section class="Editor__section">
    <textarea id="code" class="code" v-model="codeValue">
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
    code: {
      type: String,
      default: () => ''
    },
    mode: {
      type: String,
      default: () => 'python'
    }
  },
  data () {
    return {
      codeValue: null,
      originalCode: null
    }
  },
  mounted () {
    this.originalCode = document.getElementById('code')
    CodeMirror.fromTextArea(this.originalCode, {
      mode: this.mode,
      lineNumbers: true,
      value: this.codeValue
    })

    // myCodeMirror.on('change', (cm) => {
    //   myCodeMirror.save()
    // })
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
