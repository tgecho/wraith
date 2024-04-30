export type Action = {
  label: string;
  prompt: string;
};

export async function loadActions(): Promise<Action[]> {
  try {
    const prompts = await fetch("/files/prompts.json").then(
      (r) => r.ok && r.json(),
    );
    return (
      prompts || JSON.parse(localStorage.getItem("wraith_prompts") || "[]")
    );
  } catch (e) {
    console.error("Failed to load actions", e);
    return [];
  }
}

export async function saveActions(actions: Action[]) {
  const json = JSON.stringify(actions, null, 2);
  localStorage.setItem("wraith_prompts", json);
  return fetch("/files/prompts.json", {
    method: "PUT",
    body: json,
    headers: { "Content-Type": "application/json" },
  });
}
