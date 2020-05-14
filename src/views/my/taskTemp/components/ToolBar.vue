<template>
    <!-- 工具栏 -->
    <div id="toolbar" class="toolbar">
      <el-button size="small" icon="el-icon-arrow-left" class="back" @click="$router.back()">返回</el-button>
      <i data-command="undo" class="command iconfont icon-undo disable" title="撤销"></i>
      <i data-command="redo" class="command iconfont icon-redo disable" title="恢复"></i>
      <span class="separator"></span>
      <i data-command="copy" class="command iconfont icon-copy-o disable" title="复制"></i>
      <i data-command="paste" class="command iconfont icon-paster-o disable" title="粘贴"></i>
      <i data-command="delete" class="command iconfont icon-delete-o disable" title="删除"></i>
      <span class="separator"></span>
      <i data-command="save" v-if="isShow" class="command addiconfont addicon-save" title="保存本地"></i>
      <i data-command="upload" v-if="isShow" class="command upload">提交</i>
    </div>
</template>
<script>
export default {
  name:'Toolbar',
  data() {
    return {
      isShow: true
    }
  },
  created() {
    let from = this.$route.query.from
    if(from =='detail') {
      this.isShow = false
    }
  }
}
</script>
<style lang="stylus" scoped>
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.eot?t=1522149591264'); /* IE9*/
  src: url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.eot?t=1522149591264#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
  url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.ttf?t=1522149591264') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.svg?t=1522149591264#iconfont') format('svg'); /* iOS 4.1- */
}
@font-face {
  font-family: 'addiconfont';  /* project id 1290485 */
  src: url('//at.alicdn.com/t/font_1290485_zlzipqkudqi.eot');
  src: url('//at.alicdn.com/t/font_1290485_zlzipqkudqi.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1290485_zlzipqkudqi.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1290485_zlzipqkudqi.woff') format('woff'),
  url('//at.alicdn.com/t/font_1290485_zlzipqkudqi.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1290485_zlzipqkudqi.svg#iconfont') format('svg');
}
.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.addiconfont {
  font-family:"addiconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.toolbar .upload {
  width:auto !important
}
.addicon-save:before {
  content: "\ec09"
}
.icon-cut:before { content: "\e8a2"; }

.icon-actual-size-o:before { content: "\e8a3"; }

.icon-copy-o:before { content: "\e8a4"; }

.icon-delete-o:before { content: "\e8a5"; }

.icon-fit:before { content: "\e8a6"; }

.icon-select:before { content: "\e8a7"; }

.icon-paster-o:before { content: "\e8a8"; }

.icon-redo:before { content: "\e8a9"; }

.icon-to-front:before { content: "\e8aa"; }

.icon-undo:before { content: "\e8ab"; }

.icon-zoom-in-o:before { content: "\e8ac"; }

.icon-ungroup:before { content: "\e8ad"; }

.icon-zoom-out-o:before { content: "\e8ae"; }

.icon-group:before { content: "\e8af"; }

.icon-to-back:before { content: "\e8b0"; }
.toolbar
  padding: 8px 0px;
  width: 100%;
  border: 1px solid #E9E9E9;
  height: 32px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  .separator
    display inline-block
    vertical-align middle
    width 1px
    height 14px
    margin: 0 4px
    background-color #E9E9E9
  .command
    width: 27px;
    height: 27px;
    margin: 0px 6px;
    border-radius: 2px;
    padding-left: 4px;
    display: inline-block;
    border: 1px solid rgba(2,2,2,0);
    cursor pointer
    &:nth-of-type(1)
      margin-left 24px
    &.disable
      color rgba(0,0,0,.2)
      cursor default
.back
  margin-left 12px
</style>


