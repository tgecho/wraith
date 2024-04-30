<script lang="ts">
  import FilePicker from "./FilePicker.svelte";
  import Editor from "./editor/Editor.svelte";
  import { EditorControl } from "./editor/editor";
  import Sidebar from "./sidebar/Sidebar.svelte";

  let editor: EditorControl;

  function getPath() {
    return document.location.hash.slice(1).trim();
  }

  let path = getPath();
  window.addEventListener("hashchange", () => {
    path = getPath();
  });
</script>

<div class="main">
  <div class="left">
    {#if path}<Editor bind:editor {path} />
    {:else}
      <h2 class="pick">Pick a file to begin</h2>
    {/if}
  </div>
  <div class="right">
    {#if path}
      <Sidebar {editor} {path} />
    {:else}
      <FilePicker />
    {/if}
  </div>
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
  .pick {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
