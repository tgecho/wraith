import { mount } from "svelte";
import Main from "./Main.svelte";

export function main(target: HTMLElement) {
  return mount(Main, { target });
}
