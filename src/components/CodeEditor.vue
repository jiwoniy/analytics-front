<template>
  <div class="editor">
    <textarea id="code" class="code" v-model="codeValue">
    </textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/python/python'

export default {
  name: 'Python-Editor',
  props: {
    code: {
      type: String,
      default: () => ''
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
      mode: 'python',
      lineNumbers: true,
      value: this.codeValue
      // mode: 'text/x-python',
      // singleLineStringErrors: false
      // styleActiveLine: true
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
