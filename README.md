This is a little experiment with creating an LLM augmented writing tool. The main idea is the ability to create bespoke "prompt buttons" that can be run against the current selection. There isn't any intrusive autocomplation, instead the emphasis is on making little tools to transform existing text.

## Install

```sh
$ pnpm install
```

## Configure

Create a `.env` file in the root of the project with the following content. You can also set these as env variables in your shell when you run the project.

In theory this can work with anything that exposes an OpenAI compatible API, but I've only used it with [Ollama](https://github.com/ollama/ollama) so far.

```
VITE_AI_HOST="http://localhost:11434"
VITE_AI_MODEL="llama3"
VITE_AI_API_KEY="ollama"
VITE_CONTENT_ROOT="~/wraith_docs"
```

## Run

```sh
$ pnpm dev
$ open http://localhost:5173/src/
```

## Creating prompt buttons

The prompt body will be sent to the AI model with one or more replacements.

For example:

```
Convert to uppercase: {selection}
```

Other replacements are defined as exported functions in `src/sidebar/replacements.ts`. Currently included:

- `{selection}`: The currently selected text
- `{document}`: The entire document
- `{before}`: All document text before the current selection
- `{after}`: All document text after the current selection

### Context length

There isn't any real protection for overflowing the LLM's maximum context length. This is mostly a problem if you're using the replacements other than `{selection}`. You can slice a replacement with `[1..2]` syntax. For example, this will take the last 1000 characters of the text before the selection:

```
{before[-1000..]}
```

Negative numbers are relative to the end of the string. Omitting the first number will start at the beginning of the string, and the omitting the second number will go to the end of the string.

### Split prompt

You can split the prompt into separate messages with `---`. For example, this will cause two user messages to be sent as part of the same prompt:

```
{before[-1000..]}
---
{selection}
```

## Error handling

There isn't any. Errors will be logged to the devtools console.
