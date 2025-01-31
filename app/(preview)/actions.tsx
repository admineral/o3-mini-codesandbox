// app/(preview)/actions.tsx
import { Message, TextStreamMessage } from "@/components/message";
import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
// Import the Sandpack component that renders code sent by the model.
import SandpackActionReceiver from "@/components/SandpackActionReceiver";

const sendMessage = async (message: string) => {
  "use server";

  const messagesState = getMutableAIState<typeof AI>("messages");

  messagesState.update([
    ...(messagesState.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: openai("gpt-4o-mini"),
    system: `\
- you are a friendly code assistant
- reply in lower case
`,
    messages: messagesState.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messagesState.done([
          ...(messagesState.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);
        contentStream.done();
      } else {
        contentStream.update(content);
      }
      return textComponent;
    },
    tools: {
      renderSandpackCode: {
        description:
          "Render a live code preview using the provided React component code.",
        parameters: z.object({
          code: z.string().min(1, "Code must be a valid React component. Example: 'export default function MyComponent() { return <div>Hello</div> }'"),
        }),
        generate: async function* ({ code }) {
          const toolCallId = generateId();

          messagesState.done([
            ...(messagesState.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "renderSandpackCode",
                  args: { code },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "renderSandpackCode",
                  toolCallId,
                  result: `Rendering the provided code in a live preview.`,
                },
              ],
            },
          ]);

          return (
            <Message
              role="assistant"
              content={<SandpackActionReceiver code={code} />}
            />
          );
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: { sendMessage },
  onSetAIState: async ({ state, done }) => {
    "use server";
    if (done) {
      // Optionally, save to a database.
    }
  },
});