<template>
  <div class="test-wrap">
    <div class="top">
      <div class="part1">
        <div class="left">
          <span class="back">
            <i class="el-icon-back"></i>返回
          </span>
          <el-select v-model="runMode" placeholder="请选择运行模式" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>历史版本</span>
          <div class="about-group">
            <span>关于</span>
            <ul>
              <li>开发手册</li>
              <li>API手册</li>
              <li>关于Studio</li>
            </ul>
          </div>

        </div>
        <div class="right">
          <span>开发者：张三</span>
          <span>所属公司：广东省分公司</span>
          <span>所属专业：无线网</span>
        </div>
      </div>
      <div class="part2">
        <i class="iconfont icon-baocun" title="保存"></i>
        <i class="iconfont icon-fabu" title="发布"></i>
        <el-cascader placeholder="配置运行网元" :options="netData" :show-all-levels="false" size="mini"></el-cascader>
        <i class="iconfont icon-yunhang" title="运行"></i>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        runMode: '',
        options: [
          {
            label: '智能运行',
            value: '智能运行'
          },
          {
            label: '强制网元运行',
            value: '强制网元运行'
          }
        ],
        netData: [
          {
            value: 'CX600 V600R008C10SPC300',
            label: 'CX600 V600R008C10SPC300',
            children: [
              {label: "TaiPingGongYeQu(0208-4)",value: "TaiPingGongYeQu(0208-4)"},
              {label: "KeCun(0304-3)", value: "KeCun(0304-3)"}
            ]
          },
           {
            label: 'CX600 V600R008C10SPC302',
            value: 'CX600 V600R008C10SPC302',
            children: [
              {label: "TaiPingGongYeQu(0208-4)",value: "TaiPingGongYeQu(0208-4)"},
              {label: "KeCun(0304-3)", value: "KeCun(0304-3)"}
            ]
          }
        ],
        activeName: 'first'
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .part1
    display flex
    justify-content space-between
    line-height 36px
    padding 0 14px
    border-bottom 1px solid #ddd
    font-size 14px
    .left
      > span
          margin-left 20px
          cursor pointer
          &.back
            margin-left 0
      .about-group
        display inline-block
        position relative
        margin-left 20px
        ul
          display none
          position absolute
          width 100px
          padding-left 20px
          top 100%
          margin-top 2px
          left -20px
          line-height 2
          background #fff
          border 1px solid #eee
          border-radius 2px
          font-size 14px
          li
            cursor pointer
    .el-select
      width 120px
      margin-left 15px
    .right
      span
        margin-left 40px
  .part2
    display flex
    align-items center
    height 34px
    padding 0 14px
    background rgba(242, 242, 242, 1)
    >i
      margin-right 10px
      cursor pointer
      font-size 20px
      &.icon-baocun
        color #409eff
      &.icon-yunhang
        margin-left 20px
        color #409eff

</style>
