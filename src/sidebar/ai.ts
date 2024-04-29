import OpenAI from "openai";

export class AiConnection {
  private ai: OpenAI;

  constructor() {
    this.ai = new OpenAI({
      apiKey: "ollama",
      dangerouslyAllowBrowser: true,
      baseURL: `${document.location.origin}/v1`,
    });
  }

  async chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    const result = await this.ai.chat.completions.create({
      model: "llama3",
      messages,
    });
    return result.choices[0].message.content;
  }
}
