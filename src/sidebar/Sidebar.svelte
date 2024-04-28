<script lang="ts">
  import { type EditorControl } from "../editor/editor";
  export let editor: EditorControl;

  function onClick() {
    console.log("markdown:", editor.content);
  }
</script>

<div class="actions">
  <button on:click={onClick}>Hello</button>
</div>

<style>
  .actions {
    padding: 1rem;
  }
</style>
