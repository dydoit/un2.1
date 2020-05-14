<template>
  <div id="contextmenu" class="contextmenu">
    <div data-status="node-selected" class="menu">
        <div data-command="copy" class="command">
          <span>复制</span>
          <span>copy</span>
        </div>
        <div data-command="delete" class="command">
          <span>删除</span>
          <span>delete</span>
        </div>
    </div>
    <div data-status="edge-selected" class="menu">
        <div ton data-command="delete" class="command">
          <span>删除</span>
          <span>delete</span>
        </div>
    </div>
    <div data-status="group-selected" class="menu">
        <div data-command="copy" class="command">
          <span>复制</span>
          <span>copy</span>
        </div>
        <div data-command="unGroup" class="command">解组</div>
        <div data-command="delete" class="command">
          <span>删除</span>
          <span>delete</span>
        </div>
      </div>
    <div data-status="canvas-selected" class="menu">
        <div data-command="undo" class="command">
          <span>撤销</span>
          <span>undo</span>
        </div>
        <div data-command="clear" class="command">
          <span>重做</span>
          <span>redo</span>
         </div>
        <div data-command="pasteHere" class="command">
          <span>粘贴</span>
          <span>pasteHere</span>
        </div>
    </div>
    <div data-status="multi-selected" class="menu">
        <div data-command="copy" class="command">
          <span>复制</span>
          <span>copy</span>
        </div>
        <div data-command="pasteHere" class="command">
          <span>粘贴</span>
          <span>pasteHere</span>
         </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'contextmenu'
  }
</script>

<style lang="stylus" scoped>
.contextmenu
  display: none
  width: 200px;
  background: white;
  box-shadow: 0px 1px 4px rgba(0,0,0,0.25);
  color: #000;
  .command
    display: flex
    justify-content: space-between
    padding: 6px
    font-size 12px
    cursor pointer
    &:hover
      background: #E6F7FF
  .disable
    cursor: default
    color rgba(0,0,0,.25)
    &:hover
      background: none
</style>
