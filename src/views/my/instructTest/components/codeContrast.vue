<template>
  <div id="codeMirror">

  </div>
</template>

<script>
  import * as CodeMirror from 'codemirror'
  import 'codemirror/addon/merge/merge.js'
  import 'codemirror/lib/codemirror.css'
    // 引入主题后还需要在 options 中指定主题才会生效
  import 'codemirror/theme/cobalt.css'
  import './codeMirr/leetcode.css'
  // 对应语法高亮
  import 'codemirror/mode/python/python'
  export default {
    data() {
      return {
        code: 'import util.UtilsHwSW as hwSWUtil',
        code2:'import util.UtilsHwSW as hwS '
      }
    },
    mounted() {
       var target = document.getElementById('codeMirror');
       var panes = 2
       target.innerHTML = ''
      //  CodeMirror(document.getElementById('codeMirror'), {
      //    value: this.code,
      //    lineNumbers: true,
      //    theme: "leetcode", // 主题
      //    mode: "python",
      //    foldGutter: false,
      //  })
      CodeMirror.MergeView(target, {
        value: this.code, //左边旧代码
        orig: this.code2, // 右边新代码
        lineNumbers: true, //行号
        theme: "leetcode",
        mode: "python",
        origLeft: null, //两行对比设置成null就可以了
        collapseIdentical: false,
        connect: null,
        revertButtons:false,
      })
    }
  }
</script>

<style scoped>

</style>
