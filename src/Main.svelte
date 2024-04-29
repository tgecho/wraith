<script lang="ts">
  import Editor from "./editor/Editor.svelte";
  import { EditorControl } from "./editor/editor";
  import Sidebar from "./sidebar/Sidebar.svelte";

  let editor: EditorControl;
</script>

<div class="main">
  <div class="left"><Editor bind:editor /></div>
  <div class="right"><Sidebar {editor} /></div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
  .left,
  .right {
    display: flex;
    flex-direction: column;
  }
  .left {
    flex: 1 1 75%;
  }
  .right {
    flex: 1 1 33%;
    border-left: 1px dashed #ccc;
  }
</style>
