<template>
  <el-dialog
    title="请选择参数适用的版本"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
  >
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group
      v-model="checkedVersions"
      @change="handleCheckedVersionsChange"
    >
      <el-checkbox
        v-for="version in checkVersionList"
        :label="version"
        :key="version"
      >{{version}}</el-checkbox>
    </el-checkbox-group>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="sure"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      isIndeterminate: true,
      currentParmaName: '',
      checkAll: false,
      checkedVersions: [],
    };
  },
  props: {
    checkVersionList: {
      type: Array,
      default:[]
    }
  },
  methods: {
    sure() {
      this.dialogVisible = false
      this.$emit('selectedVersion', {name:this.currentParmaName,versions: this.checkedVersions})
    },
    show(arr,name) {
      this.dialogVisible = true;
      this.checkedVersions = arr
      this.currentParmaName = name
    },
    handleCheckAllChange(val){
      this.checkedVersions = val ? this.checkVersionList : [];
      this.isIndeterminate = false;
    },
    handleCheckedVersionsChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkVersionList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkVersionList.length;
    },

  }
};
</script>

<style lang="stylus" scoped></style>
