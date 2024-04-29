import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { Plugin } from "prosemirror-state";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { Schema } from "prosemirror-model";

import { buildKeymap } from "./keymap.ts";
import { buildInputRules } from "./inputrules.ts";
import { decorations } from "./decorations.ts";

export { buildKeymap, buildInputRules };

export function setup(options: {
  /** The schema to generate key bindings and menu items for. */
  schema: Schema;

  /** Can be used to [adjust](#example-setup.buildKeymap) the key bindings created. */
  mapKeys?: { [key: string]: string | false };

  /** Set to false to disable the menu bar. */
  menuBar?: boolean;

  /** Set to false to disable the history plugin. */
  history?: boolean;
}) {
  let plugins = [
    decorations(),
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
  ];
  if (options.history !== false) plugins.push(history());

  return plugins;
}
