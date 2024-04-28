<script lang="ts">
  import { onMount } from "svelte";
  import { EditorControl } from "./editor.ts";

  let editorNode: HTMLDivElement;
  export let editor: EditorControl;

  onMount(() => {
    editor = new EditorControl(
      editorNode,
      `# Hello, world!

*This is a test*

- A list`,
    );
  });
</script>

<div class="editor" bind:this={editorNode} />

<style>
  .editor {
    display: flex;
    flex: 1;
  }
  .editor :global(.ProseMirror) {
    /* Make sure line width is capped at 60em, but nicely centered, with the
    clickable active area still filling the margins. */
    padding: 1rem max(1rem, calc((100cqw - 60em) / 2));
    flex: 1;
    overflow: auto;
    outline: none;
  }
</style>
