<template>
  <div class="editor">
    <textarea id="code" class="code" v-model="codeValue">
    </textarea>
  </div>
</template>

<script>
// https://codemirror.net/#description
import CodeMirror from 'codemirror'
import 'codemirror/mode/python/python'
import 'codemirror/mode/sql/sql'

export default {
  name: 'Python-Editor',
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
      mode: 'sql',
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
@import '@/styles/global.scss';
@import 'codemirror/lib/codemirror.css';

.editor {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  .code {
    height: 100%;
    width: 100%;
  }
}
</style>
