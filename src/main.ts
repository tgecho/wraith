import Editor from "./editor/Editor.svelte";

export function main(target: HTMLElement) {
  return new Editor({ target });
}
