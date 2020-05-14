<template>
  <el-dialog
    title="请选择指令执行的版本"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
     width="30%"
  >
  <div>
    <el-radio @change="getNet" v-model="selectedVersion" v-for="item of venderList" :key="item" :label="item"></el-radio>
  </div>
  <div v-if="netList.length" class="net-list">
    <p v-for="item of netList" :key="item.id">
      <el-radio @change="handleChange(item)" v-model="selectedNetId" :label="item.netId">{{item.name}}</el-radio>
    </p>
  </div>
   <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sure">确 定</el-button>
   </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        selectedVersion: '',
        netList: [],
        selectedNetId: '',
        selectedNetName: ''
      }
    },
    props:{
      venderList: {
        type: Array
      },
      netType: {
        required: true
      },
      company: {
        required: true
      }
    },
    watch: {
      venderList() {
        this.netList = []
        this.selectedVersion = ''
        this.selectedNetId = ''
        this.selectedNetName = ''
      }
    },
    methods: {
      show() {
        this.dialogVisible = true
      },
      handleChange({name}) {
        this.selectedNetName = name
      },
      hide() {
        this.dialogVisible = false
      },
      sure() {
        if(this.selectedVersion&&this.selectedNetId) {
          this.$emit('setVersion', {
            selectedVersion: this.selectedVersion,
            selectedNetId: this.selectedNetId,
            selectedNetName: this.selectedNetName
          })
          this.dialogVisible = false
        }

      },
      async getNet(){
        this.selectedNetId = ''
        this.selectedNetName = ''
        let res = await this.$http.get('/OpsDev/order/getNetListByVersion', {
          params: {
            company: this.company,
            netType: this.netType,
            version: this.selectedVersion
          }
        })
        if(res.list) {
          this.netList = res.list
        }
      }
    },
  }
</script>

<style lang="stylus" scoped>
.net-list
  padding-left 10px
  margin-top 10px
</style>
