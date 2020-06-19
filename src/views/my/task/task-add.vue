<template>
  <div class="wrap">
    <el-form
      size="small"
      :model="form"
    >
      <el-form-item
        label="任务名称："
        required
      >
        <el-input
          v-model="form.taskName"
          :disabled="handleType=='read'"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="描述："
        required
      >
        <el-input
          type="textarea"
          v-model="form.taskDescribe"
          :disabled="handleType=='read'"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-radio>巡检任务</el-radio>
      </el-form-item>
      <el-form-item label="选择专业:" v-if="roleId=='1'">
        <el-select v-model="form.profession" :disabled="handleType=='read'">
          <el-option v-for="item of professionList" :key="item.dictValue" :value="item.dictValue" :label="item.dictNameZh"></el-option>
        </el-select>
      </el-form-item>
      <p><span class="required">*</span>任务消息通知：(多个收件人用逗号隔开)</p>
      <el-form-item>
        <div class="notice-way">
          <el-checkbox
            label="电子邮箱"
            :disabled="handleType=='read'"
            v-model="isEmail"
          ></el-checkbox>
          <el-input
            placeholder="请输入邮箱地址"
            :disabled="handleType=='read'"
            v-model="form.emailAddress"
          ></el-input>
        </div>
        <div class="notice-way">
          <el-checkbox
            label="手机短信"
            :disabled="handleType=='read'"
            v-model="isPhone"
          ></el-checkbox>
          <el-input
            placeholder="请输入手机号码"
            :disabled="handleType=='read'"
            v-model="form.messageAddress"
          ></el-input>
        </div>
        <div class="notice-way">
          <el-checkbox
            label="微信"
            v-model="isWx"
            :disabled="handleType=='read'"
          ></el-checkbox>
          <el-select v-model="form.wxType" @change="handleChangeWx" :disabled="handleType=='read'">
            <el-option v-for="item of wxTypes" :value="item.value" :key="item.value" :label="item.label"></el-option>
          </el-select>
          <el-select v-model="wxQun" v-if="form.wxType=='0'"
          :disabled="handleType=='read'"
          @change="handleChangeQun"
           placeholder="请选择群名">
            <el-option v-for="item of wxQunList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="wxPersonId" v-if="form.wxType=='0'" placeholder="请选择微信名" :disabled="handleType=='read'">
            <el-option v-for="item of wxQunPersonList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
           <el-select v-model="wxPersonId" v-if="form.wxType=='1'" placeholder="请选择微信好友名" :disabled="handleType=='read'">
            <el-option v-for="item of wxFriends" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-button
        type="primary"
        v-if="handleType == 'add'"
        @click="sub"
      >保存且进入下一步，新增任务步骤</el-button>
      <el-button
        type="primary"
        v-if="handleType == 'read'"
        @click="seeStep"
      >进入下一步，查看任务步骤</el-button>
       <el-button
        type="primary"
        v-if="handleType == 'modify'"
        @click="saveModify"
      >保存</el-button>
       <el-button
        type="primary"
        v-if="isSavedModify"
        @click="goModifyStep"
      >去修改任务步骤</el-button>
    </el-form>
  </div>
</template>

<script>
import {mapGetters } from "vuex"
export default {
  data() {
    return {
      isSavedModify: false,
      roleId: '',
      taskId: '',
      handleType: 'add', //进入页面的类型： read、modify, 默认给add
      form: {
        taskName: "",
        taskDescribe: "",
        noticeWay: "",
        emailAddress: "",
        messageAddress: "",
        profession: '', // 专业
        wxType: '',
        wxId: '' //微信id组合
      },
      wxQun: '' , //微信群id
      wxPersonId: '', //微信人id
      way:[],
      wxTypes: [
        {
          value: '0',
          label: '微信群'
        },
        {
          value: '1',
          label:'个人'
        }
      ],
      wxQunList: [
      ],
      wxQunPersonList: [], // 微信群成员列表
      wxFriends: [], //微信好友群
      isEmail: false,
      isPhone: false,
      isWx: false,
      isDisabled: false
    };
  },
  created() {
    let id = this.$route.query.id;
    let type = this.$route.query.type
    let OpsDevInfo = sessionStorage.getItem('OpsDevInfo')
    if(OpsDevInfo) {
      let roleObj = JSON.parse(OpsDevInfo)
      this.roleId = roleObj.roleid
      if(!id) { // id不存在说明是新增
        this.form.profession = roleObj.profession
      }
    }
    if (id) {
      this.taskId = id
      this.getDetail(id)
      this.handleType = type
    }
  },
  computed: {
    ...mapGetters(['professionList'])
  },
  methods: {
    handleChangeWx() {
      let type = this.form.wxType
      this.wxPersonId = ''
      this.wxQun = ''
      this.getWxList(type)
    },
    handleChangeQun() {
      this.wxPersonId = ''
      this.getWxGroupItems()
    },
    async getWxGroupItems  () {
      let groupNum = this.wxQun
      let res = await this.$http.get('/OpsDev/wechat/getWxListByGroup', {
        params: {groupNum}
      })
      let list = res.length? res.map(item => {
          return {
            label: item.name,
            value: item.num
          }
      }) : []
      this.wxQunPersonList = list
    },
    async getWxList (type) {
      if(type == '0' && this.wxQunList.length) {
        return
      }
      let res = await this.$http.get('/OpsDev/wechat/getWxList', {
        params: {type}
      })
      let list = res.length? res.map(item => {
          return {
            label: item.name,
            value: item.num
          }
      }) : []
      if(type == '0') { // 返回的是群
        this.wxQunList = list
      } else if(type == '1') { // 返回的是好友列表
        this.wxFriends = list
      }
    },
    async sub() {
      this.way = [];
      if (this.isEmail) {
        this.way.push("mail");
        if (!this.form.emailAddress) {
          alert("请输入邮箱地址");
          return;
        }
      }
      if (this.isPhone) {
       this.way.push("phone");
        if (!this.form.messageAddress) {
          alert("请输入手机号码");
          return;
        }
      }
      if (this.isWx) {
        this.way.push("wx");
      }
      if(!this.form.taskName) {
          alert("请输入任务名称");
          return;
      }
      if(!this.form.taskDescribe) {
        alert("请输入任务描述");
        return;
      }
      let wxId = this.form.wxType=='0'
        ? this.wxPersonId?this.wxQun+';'+this.wxPersonId:this.wxQun
        : this.wxPersonId
      let res = await this.$http.get("/OpsDev/taskExamine/addTaskExamine", {
        params: {
          ...this.form,
          wxId: wxId,
          noticeWay: this.way.join(",")
        }
      });
      if (res.status == "success") {
        this.$router.push({
          path: "/home/my-task/add-step",
          query: {
            id: res.id
          }
        });
      }else if(res.status == 'fail') {
        this.$message.error(`${res.msg}`)
      }
    },
    async getDetail (id) {
     let res = await this.$http.get('/OpsDev/taskExamine/getTaskExamineById', {
          params: {id}
     })
     let {taskName,taskDescribe,profession, emailAddress,messageAddress,wxType,wxId,noticeWay} = res
     this.way = noticeWay.split(',')
     if(wxType == '0') { // 是群
       if(wxId&&wxId.indexOf(';')>-1) { //说明既有群id又有组员id
        let arr = wxId.split(';')
        this.wxQun = arr[0]
        this.wxPersonId = arr[1]
        this.getWxGroupItems() // 请求群成员
       }else if(wxId&&wxId.indexOf(';')==-1) { //说明只有群id
        this.wxQun = wxId
       }
      this.getWxList(wxType)  //请求群列表
     } else if(wxType == '1') { //是微信好友
        this.wxPersonId = wxId
      this.getWxList(wxType) // 请求好友列表
     }
     if(noticeWay.indexOf('mail')!=-1) {
       this.isEmail = true
     }
     if(noticeWay.indexOf('phone')!=-1) {
       this.isPhone = true
     }
     if(noticeWay.indexOf('wx')!=-1) {
       this.isWx = true
     }
     this.form = {
       taskName,
       taskDescribe,
       profession,
       emailAddress,
       messageAddress,
       wxType,
       wxId,
       noticeWay
     }
     // 请求群list或者好友list
    },
    goModifyStep  () {
      this.$router.push({
        path: '/home/my-task/add-step',
        query: {
          id: this.taskId,
          type:'modify'
        }
      })
    },
    async saveModify  () {
      if(!this.taskId) {
        return
      }
      this.way = [];
      if (this.isEmail) {
        this.way.push("mail");
        if (!this.form.emailAddress) {
          alert("请输入邮箱地址");
          return;
        }
      }
      if (this.isPhone) {
       this.way.push("phone");
        if (!this.form.messageAddress) {
          alert("请输入手机号码");
          return;
        }
      }
      if (this.isWx) {
        this.way.push("wx");
      }
      if(!this.form.taskName) {
          alert("请输入任务名称");
          return;
      }
      if(!this.form.taskDescribe) {
        alert("请输入任务描述");
        return;
      }
      let wxId = this.form.wxType=='0'
        ? this.wxPersonId?this.wxQun+';'+this.wxPersonId:this.wxQun
        : this.wxPersonId
      let res = await this.$http.get('/OpsDev/taskExamine/updateTaskExamine', {
        params: {
           ...this.form,
          wxId,
          noticeWay: this.way.join(","),
          id: this.taskId
        }
      })
      if(res.status == 'success') {
        this.isSavedModify = true
      }
    },
    seeStep() {
      this.$router.push({
        path: '/home/my-task/add-step',
        query: {
          id: this.taskId,
          type:'read'
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrap {
  width: 900px;
  margin-left: 40px;
  padding-bottom: 30px;
  padding-top: 20px;
}

.el-form-item {
  display: flex;

  >>> .el-form-item__label {
    width: 8em;
    text-align: right;
  }

  >>> .el-form-item__content {
    flex: 1;
  }
}

.my-item-wrapper {
  display: flex;
}

.notice-way {
  display: flex;
  align-items center
  margin-top: 10px;

  >>> .el-checkbox {
    display: inline-block;
    width: 5em;
  }

  >>> .el-input {
    width: auto;
    margin-left: 20px;
  }
}

span.required {
  margin-right: 4px;
  color: #F56C6C;
}
</style>
