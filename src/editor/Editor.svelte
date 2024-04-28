<script lang="ts">
  import { onMount } from "svelte";
  import { Editor } from "./editor.ts";

  let editorNode: HTMLDivElement;
  let editor: Editor;

  onMount(() => {
    editor = new Editor(editorNode, "Hello world");
  });
</script>

<div class="editor" bind:this={editorNode} />
