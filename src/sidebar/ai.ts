import OpenAI from "openai";

const env = (import.meta as { env?: Record<string, string> }).env;

export class AiConnection {
  private ai: OpenAI;

  constructor() {
    this.ai = new OpenAI({
      apiKey: env?.VITE_AI_API_KEY ?? "ollama",
      dangerouslyAllowBrowser: true,
      baseURL: `${document.location.origin}/v1`,
    });
  }

  async chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    const result = await this.ai.chat.completions.create({
      model: env?.VITE_AI_MODEL || "llama3",
      messages,
    });
    return result.choices[0].message.content;
  }
}
