import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export type PendingDecoration = Decoration & {
  type: { attrs: { id: string; block: string } };
};

export function findDecorationById(
  state: DecorationSet,
  id: string,
): PendingDecoration | undefined {
  return (state.find() as PendingDecoration[]).find(
    (d) => d.type.attrs.id === id,
  );
}

export function decorations() {
  const plugin: Plugin = new Plugin({
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        let updated = set.map(tr.mapping, tr.doc);
        const decorations = tr.getMeta("decorations");
        if (decorations) {
          for (const d of decorations) {
            if (d?.add) {
              updated = updated.add(tr.doc, [d?.add]);
            }
            if (d?.remove) {
              const toRemove = findDecorationById(updated, d?.remove);
              if (toRemove) {
                updated = updated.remove([toRemove]);
              }
            }
          }
        }
        return updated;
      },
    },
    props: {
      decorations(state) {
        return plugin.getState(state);
      },
    },
  });
  return plugin;
}
