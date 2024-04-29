import { Decoration } from "prosemirror-view";
import {
  fromMarkdown,
  toMarkdown,
  type EditorControl,
} from "../editor/editor.ts";
import { AiConnection } from "./ai.ts";
import { Node } from "prosemirror-model";
import { Selection } from "prosemirror-state";

function isCompleteBlockSelection(selection: Selection): boolean {
  const { $from, $to } = selection;
  const parentsAreBlock = $from.parent.isBlock && $to.parent.isBlock;
  const isAtStart = $from.parentOffset === 0;
  const isAtEnd = $to.parentOffset === $to.parent.content.size;
  return Boolean(parentsAreBlock && isAtStart && isAtEnd);
}

const REPLACEMENTS: Record<
  string,
  (editor: EditorControl, param?: string) => string
> = {
  selection: (editor) => {
    const selection = editor.selection();
    // @ts-ignore I don't know why this seems to work, or how to do it better,
    // but I have a Fragment and need a Node
    const selectionContent = selection.content().content as Node;
    return toMarkdown(selectionContent);
  },
  document: (editor) => {
    return editor.content;
  },
};

export async function replace(
  ai: AiConnection,
  editor: EditorControl,
  prompt: string,
) {
  console.log("rawPrompt", prompt);
  const hydratedPrompt = prompt.replace(/\{(\w+)\}/g, (raw, key) => {
    return REPLACEMENTS[key]?.(editor) ?? raw;
  });
  console.log("hydratedPrompt", hydratedPrompt);
  const request = ai.chat([
    {
      role: "system",
      content: `You always fulfill the user's requests concisely. Input and output are markdown. Avoid commentary.`,
    },
    {
      role: "user",
      content: hydratedPrompt,
    },
  ]);

  const selection = editor.selection();
  const id = (Date.now() + Math.random()).toString();
  editor.update((tr) =>
    tr.setMeta("decorations", [
      {
        add: Decoration.inline(selection.from, selection.to, {
          id,
          block: isCompleteBlockSelection(selection).toString(),
          class: "pending",
        }),
      },
    ]),
  );
  let result = await request;
  result = result?.replace(/(\n\s*)+/g, "\n\n") || null;
  const pending = editor.getPending(id);
  if (pending) {
    let replacement = (result && fromMarkdown(result)) || editor.createNode("");
    const isBlock = JSON.parse(pending.type.attrs.block);
    // TODO: I think we can do a better job of detecting when the beginning or
    // end are inline and merging with the before/after nodes appropriately.
    if (!isBlock) {
      replacement = editor.createNode(replacement.textContent);
    }

    editor.update((tr) =>
      tr
        .setMeta("decorations", [{ remove: id }])
        .replaceRangeWith(
          isBlock ? pending.from - 1 : pending.from,
          pending.to,
          replacement,
        ),
    );
  }
}
