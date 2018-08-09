<template>
  <div>
    <textarea id="yourcode" cols="40" rows="10">
      import turtle
      t = turtle.Turtle()
      t.forward(100)
      print "Hello World"
    </textarea>
    <br />
    <button type="button" @click="run()">Run</button>
    <pre id="output" ></pre>
    <div id="mycanvas"></div>
  </div>
</template>

<script>
export default {
  name: 'Python-Editor',
  data () {
    return {
      scripts: [
        'https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js',
        'http://www.skulpt.org/static/skulpt.min.js',
        'http://www.skulpt.org/static/skulpt-stdlib.js'
      ]
    }
  },
  methods: {
    builtinRead (x) {
      if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined) {
        // throw "File not found: '" + x + "'"
        console.log('---file not found')
      }
      return window.Sk.builtinFiles['files'][x]
    },
    out (text) {
      const mypre = document.getElementById('output')
      mypre.innerHTML = mypre.innerHTML + text
    },
    run () {
      const prog = document.getElementById('yourcode').value
      const mypre = document.getElementById('output')
      mypre.innerHTML = ''
      window.Sk.pre = 'output'
      /* eslint-disable */
      Sk.configure({ output:this.out, read: this.builtinRead });
      // window.Sk.configure({output: this.out, read: this.builtinRead})
      (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas'

      const myPromise = window.Sk.misceval.asyncToPromise(function () {
        return window.Sk.importMainWithBody('<stdin>', false, prog, true)
      })
      myPromise.then(function (mod) {
        console.log('success')
      }, function (err) {
        console.log(err.toString())
      })
    }
  },
  mounted () {
    const head = document.head
    this.scripts.forEach((src) => {
      let script = document.createElement('script')
      script.setAttribute('src', src)
      script.setAttribute('text', 'text/javascript')
      script.onload = () => {
        console.log(`load: ${src}`)
      }
      script.async = true
      head.appendChild(script)
    })
  }
}
</script>

<style lang="scss" scroped>
</style>
