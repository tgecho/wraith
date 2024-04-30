import { Decoration } from "prosemirror-view";
import {
  fromMarkdown,
  toMarkdown,
  type EditorControl,
} from "../editor/editor.ts";
import { AiConnection } from "./ai.ts";
import { Node } from "prosemirror-model";

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
      content: `You always fulfill the user's requests concisely. Input is markdown. Return valid markdown. Do not add new quotation marks. Do not acknowledge the request. Avoid commentary.`,
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
          class: "pending",
        }),
      },
    ]),
  );
  const result = await request;
  console.log("result", result);
  const pending = editor.getPending(id);
  if (pending) {
    editor.update((tr) => {
      let updated = tr.setMeta("decorations", [{ remove: id }]);

      let replacement =
        (result && fromMarkdown(result)) || editor.createNode("");

      const inline =
        !atBlockStart(tr.doc, pending.from) || !atBlockEnd(tr.doc, pending.to);
      if (inline) {
        replacement = editor.createNode(replacement.textContent);
      }

      const stillSelected =
        tr.selection.to === pending.to && tr.selection.from === pending.from;
      if (stillSelected) {
        updated = updated.replaceSelectionWith(replacement);
      } else {
        updated = updated.replaceRangeWith(
          pending.from,
          pending.to,
          replacement,
        );
      }

      if (!inline) {
        // clean up extra newlines added by injecting new block nodes from markdown
        const nodeBefore = tr.doc.nodeAt(pending.from - 1);
        if (nodeBefore?.content.size === 0) {
          updated = updated.delete(pending.from - 1, pending.from);
        }
      }

      return updated;
    });
  }
}

function atBlockStart(doc: Node, position: number) {
  return doc.resolve(position).parentOffset === 0;
}
function atBlockEnd(doc: Node, position: number) {
  const pos = doc.resolve(position);
  return pos.parentOffset >= pos.parent.content.size;
}
