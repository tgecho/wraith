<script lang="ts">
  import { debounce } from "lodash-es";
  import { type EditorControl } from "../editor/editor";
  import {
    type Action,
    loadActions,
    saveActions as undebouncedSaveActions,
  } from "./actions";
  import { AiConnection } from "./ai";
  import { replace } from "./replacement";
  import { onMount } from "svelte";

  export let editor: EditorControl;
  export let path: string;

  const ai = new AiConnection();
  let editing = -1;

  function runAction(prompt: string) {
    replace(ai, editor, prompt).catch(console.error);
  }

  let actions: Action[] = [];
  onMount(async () => {
    actions = await loadActions();
  });

  const saveActions = debounce(function saveActions() {
    undebouncedSaveActions(actions);
  }, 1000);
</script>

<div class="actions">
  <div class="files">
    <h2>{path}</h2>
    <a href="./">⇽ Back to files</a>
  </div>

  <h3>Prompts</h3>
  {#each actions as action, index}
    {#if index === editing}
      <div class="action editing">
        <input bind:value={action.label} on:input={saveActions} />
        <textarea bind:value={action.prompt} on:input={saveActions} rows={3}
        ></textarea>
        <div class="edit-buttons">
          <button
            on:click={() => {
              actions = actions.filter((_, index) => index !== editing);
              saveActions();
            }}>🗑</button
          >
          <button on:click={() => (editing = -1)}>Done</button>
        </div>
      </div>
    {:else}
      <div class="action">
        <button
          class="run"
          on:click={() => runAction(action.prompt)}
          title={action.prompt}>{action.label}</button
        >
        <button class="edit" on:click={() => (editing = index)}>⚙</button>
      </div>
    {/if}
  {/each}
  <button
    class="add"
    on:click={() => {
      actions = actions.concat({
        label: "Label",
        prompt: `Rewrite this: {selection}`,
      });
      editing = actions.length - 1;
      saveActions();
    }}>Add</button
  >
</div>

<style>
  .files {
    margin: 0rem 0rem 1rem;
  }
  h2,
  h3 {
    margin: 0.25rem 0;
  }
  button {
    cursor: pointer;
  }

  .actions {
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action {
    display: flex;
    gap: 0.25rem;
  }

  .run {
    flex: 1;
  }

  .action.editing {
    flex-direction: column;
  }
  .edit-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .action input,
  .action textarea {
    width: 100%;
  }

  .add {
    align-self: start;
  }
</style>
