<template>
      <textarea ref="textarea" size="mini"></textarea>
</template>

<script type="text/ecmascript-6">
  // 引入全局实例
  import _CodeMirror from 'codemirror'

  // 核心样式
  import 'codemirror/lib/codemirror.css'
  // 引入主题后还需要在 options 中指定主题才会生效
  import 'codemirror/theme/cobalt.css'
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/lint/lint.css'
  import 'codemirror/addon/hint/show-hint.css'
  import "./leetcode.css"

 // 需要引入具体的语法高亮库才会有对应的语法高亮效果
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/indent-fold";

import "codemirror/addon/comment/comment.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/keymap/sublime.js";

import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/matchbrackets.js";

  import 'codemirror/mode/python/python'

  import 'codemirror/addon/lint/lint'
  import 'codemirror/addon/hint/show-hint'


  // 尝试获取全局实例
  const CodeMirror = window.CodeMirror || _CodeMirror
  //eval
  export default {
    props: {
      // 外部传入的内容，用于实现双向绑定
      value: String,
      // 外部传入的语法类型
      language: {
        type: String,
        default: null
      },
      data: ''
    },
    data () {
      return {
        // 内部真实的内容
        code: '',
        // 默认的语法类型
        mode: 'python',
        // 编辑器实例
        coder: null,
        // 默认配置
        options: {
          // 主题，对应主题库 JS 需要提前引入
          //theme: 'default',
          theme: "leetcode", // 主题
          keyMap: "sublime", // 快键键风格
          lineNumbers: true, // 显示行号
          smartIndent: true, // 智能缩进
          indentUnit: 4, // 智能缩进单位为4个空格长度
          indentWithTabs: true, // 使用制表符进行智能缩进
          lineWrapping: true, //
          lint: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
          foldGutter: true, // 启用行槽中的代码折叠
          autofocus: true, // 自动聚焦
          matchBrackets: true, // 匹配结束符号，比如"]、}"
          autoCloseBrackets: true, // 自动闭合符号
        }
      }
    },
    mounted () {
      // 初始化
      this._initialize()
    },
    methods: {
      // 初始化
      _initialize () {
        // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
        let editor = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
        this.coder = editor;
        // 编辑器赋值
        this.coder.setValue(this.value || this.code)
        // 支持双向绑定
        this.coder.on('change', (coder) => {
          this.code = coder.getValue()
          if (this.$emit) {
            this.$emit('input', this.code)
          }
        })
      }

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
