<template>
  <textarea
    ref="textarea"
  ></textarea>
</template>

<script type="text/ecmascript-6">
import * as CodeMirror from 'codemirror'

// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/cobalt.css";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/hint/show-hint.css";
import "./codeMirr/leetcode.css";

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

import "codemirror/mode/python/python";
export default {
  props: {
    value: String
  },
  data() {
    return {
      // 内部真实的内容
      code: "",
      // 默认配置
      options: {
        // 主题，对应主题库 JS 需要提前引入
        theme: "leetcode", // 主题
        keyMap: "sublime", // 快键键风格
        lineNumbers: true, // 显示行号
        smartIndent: true, // 智能缩进
        indentUnit: 4, // 智能缩进单位为4个空格长度
        indentWithTabs: true, // 使用制表符进行智能缩进
        lineWrapping: true, //
        lint: true,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers"
        ],
        foldGutter: true, // 启用行槽中的代码折叠
        autofocus: true, // 自动聚焦
        matchBrackets: true, // 匹配结束符号，比如"]、}"
        autoCloseBrackets: true // 自动闭合符号
      }
    };
  },
  mounted() {
    this.code = this.value
    let editor = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
    editor.setValue(this.value || this.code);
    editor.on('change', code => {
      this.code = editor.getValue();
      this.$emit('codeChange', this.code)
    })
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
