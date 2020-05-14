<template>
  <div id="itempannel" class="itempannel">
      <!-- 踩坑：注意 class必须是getItem，否则无法拖拽-->
      <!-- 增加data-sign属性来判断箭头出入 -->
    <div class="getItem start" data-type="node" data-shape="flow-circle" data-size="72*72" data-sign="start" data-label="开始" data-color="#FA8C16">
      <span title="开始">开始</span>
    </div>
    <div class="getItem direct"  data-type="node" data-sign="instruct" data-shape="flow-rect" data-size="120*48" data-label="指令" data-color="#1890FF">
      <span title="指令">指令</span>
    </div>
    <div class="getItem loop"  data-type="node" data-sign="loop" data-shape="flow-rhombus" data-size="80*72" data-label="循环" data-color="#FFFF00">
      <span title="指令">循环</span>
    </div>
    <div class="getItem port" data-type="node" data-sign="http" data-shape="flow-capsule" data-size="80*48" data-label="接口" data-color="#722ED1">
      <span title="接口">接口</span>
    </div>
    <div class="getItem end" data-type="node" data-shape="flow-circle" data-size="72*72" data-sign="end" data-label="结束" data-color="#CD2626">
      <span>结束</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'itempannel'
  }

</script>

<style lang="stylus" scoped>
  // 元素板
  .itempannel
    width: 100px;
    height 100%
    padding-top 10px
    background: #F7F9FB;
    border-right: 1px solid #E6E9ED;
    color #666
    font-size 12px
    user-select none
    >div
      cursor move
    .getItem
      margin-bottom 20px
      text-align: center
      color #666
    .start,.end
      margin-left auto
      margin-right auto
      width 60px
      height 60px
      line-height 60px
      border-radius 50%
    .start
      border 1px solid #98F5FF
      background-color #ADFF2F
      color #fff
    .end
      border 1px solid #DDA0DD
      background-color #CD5B45
      color #fff
    .direct
      width 80px
      height 36px
      margin-left auto
      margin-right auto
      line-height 36px
      border-radius 2px
      border 1px solid #B9D3EE
      background-color #ADD8E6
    .loop
      width 80px
      height 36px
      margin-left auto
      margin-right auto
      line-height 36px
      border-radius 2px
      background-color #FFF68F
    .port
      width 80px
      height 36px
      margin-left auto
      margin-right auto
      line-height 36px
      border-radius 18px
      border 1px solid #96CDCD
      background-color #9AFF9A
</style>
