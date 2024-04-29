<script lang="ts">
  import { debounce } from "lodash-es";
  import { type EditorControl } from "../editor/editor";
  import { loadActions } from "./actions";
  import { AiConnection } from "./ai";
  import { replace } from "./replacement";
  export let editor: EditorControl;

  const ai = new AiConnection();
  let editing = -1;

  function runAction(prompt: string) {
    replace(ai, editor, prompt).catch(console.error);
  }

  let actions = loadActions();

  const saveActions = debounce(function saveActions() {
    console.log("saving actions", actions);
    localStorage.setItem("wraith_actions", JSON.stringify(actions));
  });
</script>

<div class="actions">
  <h2>Prompts</h2>
  {#each actions as action, index}
    {#if index === editing}
      <div class="action editing">
        <input bind:value={action.label} on:input={saveActions} />
        <textarea bind:value={action.prompt} on:input={saveActions} rows={3} />
        <div class="edit-buttons">
          <button
            on:click={() =>
              (actions = actions.filter((_, index) => index !== editing))}
            >🗑</button
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
        prompt: `Rewrite this: "{selection}"`,
      });
      editing = actions.length - 1;
      saveActions();
    }}>Add</button
  >
</div>

<style>
  h2 {
    margin: 0 0.25rem 0.25rem;
  }
  button {
    cursor: pointer;
  }

  .actions {
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .action {
    padding: 0.25rem;
    display: flex;
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
    margin: 0.25rem;
    align-self: start;
  }
</style>
