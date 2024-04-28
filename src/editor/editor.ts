import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { exampleSetup } from "./setup.ts";

function createState(content: string) {
  return EditorState.create({
    doc: defaultMarkdownParser.parse(content) || undefined,
    plugins: exampleSetup({ schema }),
  });
}

export class Editor {
  private view: EditorView;

  constructor(target: HTMLElement, initialContent: string) {
    this.view = new EditorView(target, {
      state: createState(initialContent),
    });
  }

  destroy() {
    this.view.destroy();
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }

  set content(content: string) {
    this.view.updateState(createState(content));
  }
}
