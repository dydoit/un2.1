<template>
  <div>
    <div class="top">
      <div class="part">
        <el-select
          v-model="value"
          placeholder="请选择"
          size="mini"
          @change="handleChangeId"
        >
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.versionNum"
              :value="item.id"
            >
              <span style="float: left">{{ item.versionNum }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.versionDescribe}}</span>
            </el-option>
          </el-option-group>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          v-show="!isContrast"
          @click="addContrast"
        >添加对比
        </el-button>
        <el-button
          type="primary"
          size="mini"
          v-show="isContrast"
          @click="closeContrast"
        >关闭对比
        </el-button>
      </div>
      <div
        class="part"
        v-if="isContrast"
      >
        <el-select
          v-model="value2"
          placeholder="请选择"
          size="mini"
        >
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.versionNum"
              :value="item.id"
            >
              <span style="float: left">{{ item.versionNum }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.versionDescribe}}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
    </div>

    <div id="codeMirror">

    </div>
  </div>
</template>

<script>
import * as CodeMirror from "codemirror";
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/merge/merge.css"
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "./codeMirr/leetcode.css";
// 对应语法高亮
import "codemirror/mode/python/python";
export default {
  props: ["id", "list", "currentCode"],
  data() {
    return {
      value: "",
      value2: "",
      code: "",
      code2: " ",
      codeObj: {},
      isContrast: false
    };
  },
  computed: {
    options() {
      let currentCode = this.currentCode;
      let arr = [
        {
          label: "开发环境",
          options: [
            {
              id: "开发环境",
              versionNum: "开发环境",
              versionDescribe: "正在编辑的代码",
              analysisCode: currentCode
            }
          ]
        }
      ];
      let list = this.list.reduce(
        (last, cur) => {
          return {
            ...last,
            options: [...last.options, cur]
          };
        },
        {
          label: "生产环境",
          options: []
        }
      );
      return arr.concat(list);
    }
  },

  mounted() {
    this.value = this.id;
    this.codeObj = this.list.reduce(
        (last, cur) => {
          return {
            ...last,
            [cur.id]: cur.analysisCode
          };
        },
        { '开发环境': this.currentCode }
    );
  },
  watch: {
    value(newValue) {
      this.handleChangeId(newValue);
    },
    value2(newValue) {
      this.handleChangeTargetId(newValue)
    }
  },
  methods: {
    handleChangeId(val) {
      this.code = this.codeObj[val];
      this.initCodeMirror()
    },
    initCodeMirror() {
      var target = document.getElementById("codeMirror");
      target.innerHTML = "";
      if(!this.isContrast) {
         CodeMirror(document.getElementById('codeMirror'), {
          value: this.code,
          lineNumbers: true,
          theme: "leetcode", // 主题
          mode: "python",
          foldGutter: false
        })
      }else {
        CodeMirror.MergeView(target, {
          value: this.code, //左边旧代码
          orig: this.code2, // 右边新代码
          lineNumbers: true, //行号
          theme: "leetcode",
          mode: "python",
          origLeft: null, //两行对比设置成null就可以了
          collapseIdentical: false,
          connect: null,
          highlightDifferences: true,
          revertButtons: false
        });
      }

    },
    handleChangeTargetId(val) {
      this.code2 = this.codeObj[val]
      this.initCodeMirror()
    },
    addContrast() {
      this.isContrast = true;
      this.value2 = "开发环境"
    },
    closeContrast() {
      this.isContrast = false
      this.value2 = ''
    }
  }
};
</script>

<style lang="stylus" scoped>
.top
  display flex
  margin-bottom 10px
  .part
    flex 1
    .el-button
      margin-left 8px
</style>
