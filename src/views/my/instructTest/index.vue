<template>
  <div class="test-wrap">
    <div class="top">
      <div class="part1">
        <div class="left">
          <span class="back">
            <i class="el-icon-back"></i>返回
          </span>
          <el-select
            v-model="runMode"
            placeholder="请选择运行模式"
            size="mini"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
        <i
          class="iconfont icon-baocun"
          title="保存"
        ></i>
        <i
          class="iconfont icon-fabu"
          title="发布"
        ></i>
        <el-cascader
          placeholder="配置运行网元"
          :options="netData"
          :show-all-levels="false"
          size="mini"
        ></el-cascader>
        <i
          class="iconfont icon-yunhang"
          title="运行"
        ></i>
      </div>
    </div>
    <div class="content">
      <div class="content-part1">
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="解析脚本"
            name="first"
          >
            <p style="color:red">这是一段解析脚本</p>
          </el-tab-pane>
          <el-tab-pane
            label="输出模型"
            name="second"
          >
            <output-model></output-model>
          </el-tab-pane>
          <el-tab-pane
            label="输入模型"
            name="third"
          >
            <input-model></input-model>
          </el-tab-pane>
          <el-tab-pane
            label="定时任务补偿"
            name="fourth"
          >参数说明</el-tab-pane>
          <el-tab-pane
            label="定时任务补偿"
            name="fifth"
          >历史版本</el-tab-pane>
        </el-tabs>
      </div>
      <div class="content-part2" :style="{height: footHeight+'px'}">
        <el-tabs  v-model="activeTab"
          type="border-card"
          id="el_tabs"
          @tab-click="handleChangeTab">
             <el-tab-pane
                label="报文"
                name="报文"
              >
                <p style="color:red">报文</p>
              </el-tab-pane>
              <el-tab-pane
                label="运行结果"
                name="运行结果"
              >
                <p style="color:red">运行结果</p>
              </el-tab-pane>
              <el-tab-pane
                label="示例报文"
                name="示例报文"
              >
                <p style="color:red">示例报文</p>
              </el-tab-pane>
              <el-tab-pane
                label="示例运行结果"
                name="示例运行结果"
              >
                <p style="color:red">示例运行结果</p>
              </el-tab-pane>
               <el-tab-pane
                label="属性"
                name="属性"
              >
                <p style="color:red">属性</p>
              </el-tab-pane>
          </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
const divHeight = 200
import outputModel from "./components/outputModel.vue";
import inputModel from './components/inputModel.vue'
export default {
  data() {
    return {
      runMode: "",
      options: [
        {
          label: "智能运行",
          value: "智能运行"
        },
        {
          label: "强制网元运行",
          value: "强制网元运行"
        }
      ],
      netData: [
        {
          value: "CX600 V600R008C10SPC300",
          label: "CX600 V600R008C10SPC300",
          children: [
            {
              label: "TaiPingGongYeQu(0208-4)",
              value: "TaiPingGongYeQu(0208-4)"
            },
            { label: "KeCun(0304-3)", value: "KeCun(0304-3)" }
          ]
        },
        {
          label: "CX600 V600R008C10SPC302",
          value: "CX600 V600R008C10SPC302",
          children: [
            {
              label: "TaiPingGongYeQu(0208-4)",
              value: "TaiPingGongYeQu(0208-4)"
            },
            { label: "KeCun(0304-3)", value: "KeCun(0304-3)" }
          ]
        }
      ],
      activeName: "third",
      footHeight: divHeight,
      prevY: '',
      isCanMove: true,
      activeTab: '报文'
    };
  },
  mounted() {
    let div = document.querySelector('#el_tabs > .el-tabs__header')
    div.onmousedown = (e) => {
      this.prevY = e.clientY
      this.isCanMove = true
      document.addEventListener('mousemove', this.move)
      document.onmouseup = (e) => {
        this.isCanMove = false
      }
    }

  },
  methods: {
    move(e) {
      if(this.isCanMove) {
        let moveLength = e.clientY - this.prevY
        this.footHeight  = this.footHeight - moveLength
        if (this.footHeight < 80) {
          this.footHeight = 80
        } else if (this.footHeight > document.body.clientHeight - 200) {
              this.footHeight = document.body.clientHeight - 200
        }else {
          this.prevY = e.clientY
        }
      }

    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChangeTab() {

    }
  },
  components: {
    outputModel,
    inputModel
  }
};
</script>

<style lang="stylus" scoped>
.test-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;

  .content {
    flex: 1;
    overflow: hidden;
    display flex
    flex-direction column
    .content-part1 {
      flex:1;
      overflow:auto
    }
    .content-part2 {
      overflow hidden;
      transform: translateZ(0);
      .el-tabs >>> .el-tabs__header {
        cursor: row-resize;
      }
    }
    .el-tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;

      & >>> .el-tabs__content {
        flex: 1;
        overflow: auto;
      }
      & >>> .el-tabs__header {
        margin: 0;
      }
      & >>> .el-tabs__item  {
        height 30px
        line-height 30px
        font-size 12px
      }

    }
  }

  .part1 {
    display: flex;
    justify-content: space-between;
    line-height: 36px;
    padding: 0 14px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;

    .left {
      > span {
        margin-left: 20px;
        cursor: pointer;

        &.back {
          margin-left: 0;
        }
      }

      .about-group {
        display: inline-block;
        position: relative;
        margin-left: 20px;

        ul {
          display: none;
          position: absolute;
          width: 100px;
          padding-left: 20px;
          top: 100%;
          margin-top: 2px;
          left: -20px;
          line-height: 2;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 2px;
          font-size: 14px;

          li {
            cursor: pointer;
          }
        }
      }
    }

    .el-select {
      width: 120px;
      margin-left: 15px;
    }

    .right {
      span {
        margin-left: 40px;
        font-size: 12px;
      }
    }
  }

  .part2 {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 14px;
    background: rgba(242, 242, 242, 1);

    >i {
      margin-right: 10px;
      cursor: pointer;
      font-size: 20px;

      &.icon-baocun {
        color: #409eff;
      }

      &.icon-yunhang {
        margin-left: 20px;
        color: #409eff;
      }
    }
  }
}
</style>
