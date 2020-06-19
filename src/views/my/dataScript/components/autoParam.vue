<template>
  <div class="wrapper">
    <div class="radio-group">
      <p>请选择自定义参数格式</p>
      <el-radio v-model="radio" label="1">普通String格式</el-radio>
      <el-radio v-model="radio" label="2">JSON格式</el-radio>
    </div>
    <el-input v-model="paramStr" v-show="radio==1" placeholder="请输入参数" size="small"></el-input>
    <div class="json-group" v-show="radio==2">
      <div class="json-list">
        <p class="title">
          <span>paramKey</span>
          <span>paramValue</span>
        </p>
        <p v-for="(item,index) in params" :key="index">
           <el-input v-model="item.paramKey"></el-input>
           <el-input v-model="item.paramValue"></el-input>
          <i class="el-icon-close" @click="del(index)"></i>
        </p>
        <p class="add-btn">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">添加参数</el-button>
        </p>
      </div>
      <div class="codemirror-wrap">
        <code-view :value="paramJson"></code-view>
      </div>
    </div>
  </div>
</template>

<script>
  import codeView from './codeView.vue'
  export default {
    data() {
      return {
        radio: '1', // 默认1
        params:[],
        paramStr: '',
        paramJson: '[]'
      }
    },
    watch: {
      customType(newValue) {
        this.radio = this.customType
         if(this.radio==1) {
            this.paramStr = this.customParameter
          }else {
            this.paramJson = this.customParameter
            try{
              this.params = JSON.parse(this.customParameter)
            }catch(err){
              console.log(err)
            }
          }
      }
    },
    props: ['customParameter', 'customType'],
    methods: {
      add() {
        this.params.push({
          paramKey: '',
          paramValue: ''
        })
      },
      del(i) {
        this.params.splice(i,1)
      }
    },
    components: {
      codeView
    },
  }
</script>

<style lang="stylus" scoped>
.wrapper
  margin 10px 20px
  .radio-group
    margin-bottom 10px
    p
      margin-bottom 8px
  >.el-input
      width 500px
.json-group
  display flex
  justify-content space-between
  p
    margin-bottom 10px
  .title
    span
      display inline-block
      width 250px
      margin-right 6px
      font-weight 600
  .el-input
    width 250px
    margin-right 6px
  i
    cursor pointer
  .add-btn
    margin-top 10px
.codemirror-wrap
  flex 1
  margin-left 10px
  border 1px solid #ccc
</style>
