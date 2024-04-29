type Action = {
  label: string;
  prompt: string;
};

export function loadActions(): Action[] {
  try {
    return JSON.parse(localStorage.getItem("wraith_actions") || "[]");
  } catch (e) {
    console.error("Failed to load actions", e);
    return [];
  }
}

export function saveActions(actions: Action[]) {
  localStorage.setItem("wraith_actions", JSON.stringify(actions));
}
