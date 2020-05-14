<template>
  <el-dialog :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    class="dialog-wrapper">
    <el-form :model="form" :rules="rules" size="small" ref="dispathForm">
      <div class="form-wrap">
        <el-form-item label="常量中文名称" prop="paramKeyZh" :label-width="formLabelWidth">
          <el-input v-model="form.paramKeyZh" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="常量名称" prop="paramKey" :label-width="formLabelWidth">
          <el-input v-model="form.paramKey" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="常量值" prop="paramValue" :label-width="formLabelWidth">
          <el-input v-model="form.paramValue" autocomplete="off"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="sub">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapMutations, mapGetters} from 'vuex'
export default {
  name: "Model",
  props: ["title"],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        paramKeyZh: "",
        paramKey: "",
        paramValue: ''
      },
      rules: {
        paramKeyZh: [{required: true, message:'请输入常量中文名称'}],
        paramKey:  [{required: true, message:'请输入常量名称'}],
        paramValue: [{required: true, message:'请输入常量值'}]
      },
      formLabelWidth: "110px"
    };
  },
  computed: {
     ...mapGetters({
        variableList: 'drag/variableList',
        constantList: 'drag/constantList'
     })
  },
  methods: {
    ...mapMutations({
      constAdd: 'drag/constAdd'
    }),
    hide() {
      this.dialogFormVisible = false;
    },
    show() {
      this.dialogFormVisible = true;
    },
    sub() {
      let flag = false
      this.$refs.dispathForm.validate(valid => {
          if(valid) {
            console.log('验证通过')
          } else {
            console.log('验证不通过')
            flag = true
          }
      })
      if(flag) {
        return
      }
      let paramKey = this.form.paramKey
      let varconList = [...this.variableList, ...this.constantList]
      let isExit = varconList.find(item =>item.paramKey == paramKey)
      if(isExit) {
        this.$message({
          message: `${paramKey}已存在`,
          type: 'warning'
        });
        return
      }
      this.constAdd({...this.form})
      this.hide()
    }
  }
};
</script>

<style lang="stylus" scoped>
.dialog-wrapper {
  >>> .el-dialog {
    width: 36%;
  }
  >>> .el-dialog__header {
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: #f5f5f5;

    .el-dialog__headerbtn {
      top: 5px;
    }

    .el-dialog__title {
      font-size: 14px;
    }
  }
}

.dialog-footer {
  text-align: center;
}

.form-wrap {
  width: 80%;
  margin: 0 auto;
}
</style>
