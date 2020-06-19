<template>
  <div class="output-wrap">
    <div class="btn-group">
      <el-button type="text" icon="el-icon-document-copy" @click="showModel">从模板仓库中复制</el-button>
      <el-button type="text" icon="el-icon-upload" @click="saveModel">保存至模板仓库</el-button>
    </div>
    <el-form  size="small"
    :model="outputData">
      <el-form-item label="模型名称：" required>
        <el-input
          placeholder="请输入输出模型名称"
          v-model="outputData.modelName"
        ></el-input>
      </el-form-item>
      <el-form-item label="出参填写：">
         <table>
            <thead>
              <tr>
                <td>出参名称</td>
                <td>参数类型</td>
                <td>描述</td>
                <td>操作</td>
              </tr>
            </thead>
            <tbody
              v-if="!params.length"
              class="no-param"
            >
              <tr>
                <td colspan="6">暂无参数</td>
              </tr>

            </tbody>
            <tbody v-else>
              <tr
                v-for="(item,index) of params"
                :key="index"
              >
                <td>
                  <div
                    v-text="item.parameterCode"
                    contenteditable="true"
                    @blur="handleName(item, $event)"
                  >
                  </div>
                </td>
                <td class="is-required">
                  <select v-model="item.parameterType">
                    <option value="0">String</option>
                    <option value="1">List</option>
                    <option value="2">Map</option>
                  </select>
                </td>
                <td class="intro">
                  <div
                    contenteditable="true"
                    v-html="item.parameterDescribe"
                    @blur="handleIntro(item,$event)"
                  >
                  </div>
                </td>
                <td class="handle">
                  <el-button
                    size="mini"
                    @click="del_param(index)"
                  >删除</el-button>
                </td>
              </tr>
            </tbody>
        </table>
        <div class="add-wrapper">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="add_param"
          >添加参数</el-button>
        </div>
      </el-form-item>
    </el-form>
    <storage ref="storage" @used="copyParams"></storage>
  </div>
</template>

<script>
  import Storage from './storage.vue'
  export default {
    props:['outputModelName', 'outputModelDetailList'],
    data() {
      return {
        outputData: {
          modelName: ''
        },
        params: [

        ]
      }
    },
    watch: {
      outputModelName(newVal) {
        this.outputData.modelName = newVal
      },
      outputModelDetailList(arr) {
        this.params = arr.slice()
      }
    },
    methods: {
      add_param() {
        this.params.push({
          parameterCode: "", //参数变量名
          parameterType: '0', // 是否必填
          parameterDescribe: "" // 参数描述
        });
      },
      del_param(i) {
        this.params.splice(i, 1)
      },
      handleName(item, e) {
        item.parameterCode = e.target.innerText.trim()
      },
      handleIntro(item, e) {
        item.parameterDescribe = e.target.innerHTML
      },
      async saveModel() {
        let res = await this.$http.post('/OpsDev/orderDataParserOutputModel/addOrderDataParserOutputModel', {
          modelName:this.outputData.modelName,
          orderDataParserOutputModelDetailsList:this.params
        })
        if(res.status == 'success') {
          alert('保存成功')
        }else if(res.status == 'fail') {
          alert(`${res.msg}`)
        }
      },
      showModel() {
        this.$refs.storage.show()
      },
      copyParams(parmas) {
        console.log(parmas)
        this.params = parmas.slice()
      }
    },
    components: {
      Storage,
    },
  }
</script>

<style lang="stylus" scoped>
.output-wrap
  width 80%
  margin 10px auto
  .el-input
    width 300px
table
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;
  font-size 12px
  thead
    background-color: #ddd;
    td
      padding: 6px 0;
  .no-param
    td
      padding: 6px 0;
  td
    padding: 2px 4px;
    border: 1px solid #ccc;

    &.is-required
      width: 9%;
    &.intro
      width: 50%;
      text-align: left;
    &.handle
      width: 2em;


.add-wrapper
  text-align: right
.btn-group
  text-align right
  .el-button
    margin-left 30px
</style>
