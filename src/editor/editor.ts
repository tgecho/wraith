import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { setup } from "./setup.ts";
import { Node } from "prosemirror-model";
import { PendingDecoration, findDecorationById } from "./decorations.ts";

function createState(content: string) {
  return EditorState.create({
    doc: fromMarkdown(content),
    plugins: setup({ schema }),
  });
}

export function fromMarkdown(content: string, inline: boolean = false) {
  return defaultMarkdownParser.parse(content) || undefined;
}

export function toMarkdown(node: Node) {
  return defaultMarkdownSerializer.serialize(node);
}

export class EditorControl {
  private view: EditorView;

  constructor(options: {
    target: HTMLElement;
    initialContent: string;
    onChange: (editor: EditorControl) => void;
  }) {
    const editor = this;

    const view = new EditorView(options.target, {
      state: createState(options.initialContent),
      dispatchTransaction(transaction) {
        let newState = view.state.apply(transaction);
        view.updateState(newState);
        options.onChange?.(editor);
      },
    });

    this.view = view;
  }

  destroy() {
    this.view.destroy();
  }

  content(start = 0, end: number = this.view.state.doc.content.size) {
    const slice = this.view.state.doc.slice(start, end);
    // @ts-ignore I don't know why this seems to work, or how to do it better,
    // but I have a Fragment and need a Node
    const content = slice.content as Node;
    return toMarkdown(content);
  }

  selection() {
    return this.view.state.selection;
  }

  update(createTransaction: (tr: Transaction) => Transaction) {
    this.view.updateState(
      this.view.state.apply(createTransaction(this.view.state.tr)),
    );
  }

  createNode(text: string) {
    return this.view.state.schema.text(text);
  }

  getPending(id: string): PendingDecoration | undefined {
    const state = this.view.state.plugins[0].getState(this.view.state);
    return findDecorationById(state, id);
  }
}
