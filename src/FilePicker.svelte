<script lang="ts">
  import { onMount } from "svelte";
  import { timeAgo } from "./util/timeAgo";

  let files: string[] | undefined;
  onMount(async () => {
    files = await fetch("/files").then((r) => r.json());
  });

  function createFile(ev: SubmitEvent) {
    ev.preventDefault();
    console.log(ev);
    const name = (ev.target as HTMLFormElement)?.elements.namedItem("name") as
      | HTMLInputElement
      | undefined;
    if (name?.checkValidity()) {
      fetch(`/files/${name.value}`, { method: "PUT" }).then(() => {
        document.location.hash = name.value;
      });
    }
  }
</script>

<div class="picker">
  {#if files}
    <ul>
      {#each files as file}
        {#if file.name.endsWith(".md")}
          <li>
            <a href="#{file.name}">{file.name}</a>
            <time
              datetime={new Date(file.time).toISOString()}
              title={new Date(file.time).toLocaleString()}
              >({timeAgo(new Date(file.time))})</time
            >
          </li>
        {/if}
      {/each}
    </ul>
    <form on:submit={createFile}>
      <input name="name" placeholder="Filename" pattern="[a-zA-Z0-9_\-]+\.md" />
      <button>Create</button>
    </form>
  {:else}
    <p>Loading files...</p>
  {/if}
</div>

<style>
  .picker {
    padding: 1rem;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.5em 0;
  }
  time {
    font-size: 0.8em;
    color: #666;
  }
  form {
    display: flex;
    gap: 0.5em;
    position: relative;
    padding-top: 1em;
  }
  form:invalid {
    border-color: red;
  }
  form:invalid::after {
    content: "Please enter a filename ending in .md";
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    bottom: calc(100% - 1em);
    background: rgba(255, 0, 0, 0.5);
    padding: 0.25em 0.5em;
    color: #fff;
    font-size: 0.9em;
  }
  input {
    flex: 1;
  }
</style>
