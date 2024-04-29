<script lang="ts">
  import { onMount } from "svelte";
  import { EditorControl } from "./editor.ts";
  import { debounce } from "lodash-es";

  let editorNode: HTMLDivElement;
  export let editor: EditorControl;

  function save() {
    localStorage.setItem("wraith_content", editor.content);
  }

  onMount(() => {
    editor = new EditorControl({
      target: editorNode,
      initialContent: localStorage.getItem("wraith_content") || "",
      onChange: debounce(save, 500, { maxWait: 4000 }),
    });
  });
</script>

<div class="editor" bind:this={editorNode} />

<style>
  .editor {
    display: flex;
    height: 100vh;
  }
  .editor :global(.ProseMirror) {
    /* Make sure line width is capped at 60em, but nicely centered, with the
    clickable active area still filling the margins. */
    padding: 1rem max(1rem, calc((100cqw - 60em) / 2));
    flex: 1;
    overflow: auto;
    outline: none;
  }

  .editor :global(.ProseMirror :first-child) {
    margin-top: 0;
  }

  @keyframes pulse {
    0%,
    100% {
      background-color: #12f33f;
    }
    50% {
      background-color: #e2f32b;
    }
  }
  .editor :global(.ProseMirror .pending) {
    animation: pulse 1s infinite;
  }
</style>
