import { Node } from "prosemirror-model";
import { EditorControl, toMarkdown } from "../editor/editor.ts";

export function selection(editor: EditorControl): string {
  const selection = editor.selection();
  // @ts-ignore I don't know why this seems to work, or how to do it better,
  // but I have a Fragment and need a Node
  const selectionContent = selection.content().content as Node;
  return toMarkdown(selectionContent);
}

export function document(editor: EditorControl): string {
  return editor.content();
}

export function before(editor: EditorControl): string {
  const selection = editor.selection();
  return paragraphsToMessages(editor.content(0, selection.from - 1));
}

export function after(editor: EditorControl): string {
  const selection = editor.selection();
  return paragraphsToMessages(editor.content(selection.to));
}

function paragraphsToMessages(text: string): string {
  return text.replace(/\n\s*\n/g, "\n---\n");
}
