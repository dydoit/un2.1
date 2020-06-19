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

import "codemirror/mode/javascript/javascript";
export default {
  props: {
    value: String
  },
  watch: {
    value(newValue) {
      if(this.editor) {
        this.editor.setValue(newValue);
      }
    }
  },
  data() {
    return {
      // 内部真实的内容
      // code: "",
      // 默认配置
      options: {
        // 主题，对应主题库 JS 需要提前引入
        theme: "leetcode", // 主题
        readOnly:'nocursor'
      }
    };
  },
  mounted() {
    // this.code = this.value
    let editor = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
    this.editor = editor
    editor.setValue(this.value);


  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
