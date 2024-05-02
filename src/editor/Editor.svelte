<script lang="ts">
  import { EditorControl } from "./editor.ts";
  import { debounce } from "lodash-es";

  let editorNode: HTMLDivElement;
  export let editor: EditorControl | undefined;
  export let path: string;

  async function initEditor(path: string) {
    editor?.destroy();
    editor = undefined;
    const initialContent = await fetch(`/files/${path}`).then(
      (r) => (r.ok && r.text()) || "",
    );
    editor = new EditorControl({
      target: editorNode,
      initialContent,
      onChange: debounce(save, 500, { maxWait: 4000 }),
    });
  }

  async function save() {
    if (editor && path) {
      await fetch(`/files/${path}`, {
        method: "PUT",
        body: editor.content,
      });
    } else {
      console.error("No path specified");
    }
  }

  $: {
    if (path) {
      console.log("Path changed", path);
      initEditor(path);
    }
  }
</script>

{#if !editor}
  <div class="editor">Editor loading...</div>
{/if}
<div class="editor" bind:this={editorNode}></div>

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
