import Main from "./Main.svelte";

export function main(target: HTMLElement) {
  return new Main({ target });
}
