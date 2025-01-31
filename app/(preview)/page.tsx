"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";

// No separate import for a code preview container is needed.
// When the "Code Preview" action is triggered, your AI returns a message
// whose content includes the SandpackWithButtons component.
export default function Home() {
  const { sendMessage } = useActions();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  // Updated suggested actions for React components
  const suggestedActions = [
    { 
      title: "Basic Counter", 
      label: "useState example", 
      action: "Show me a basic counter component using useState" 
    },
    { 
      title: "Todo List", 
      label: "state management", 
      action: "Create a simple todo list component" 
    },
    { 
      title: "Form Input", 
      label: "controlled component", 
      action: "Show me a form input with controlled components" 
    },
    { 
      title: "useEffect Demo", 
      label: "lifecycle example", 
      action: "Create a component demonstrating useEffect" 
    },
    {
      title: "Custom Hook",
      label: "hook example",
      action: "Show me how to create a custom React hook",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <header className="py-4 bg-blue-500 text-white text-center font-bold text-xl">
        React Component Playground
      </header>

      {/* Chat Area */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-3 w-full max-w-[600px] mx-auto"
        >
          {messages.length === 0 && (
            <motion.div
              className="h-[350px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="border rounded-lg p-6 text-zinc-500 text-sm dark:text-zinc-400">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <VercelIcon size={16} />
                  <span>+</span>
                  <MasonryIcon />
                </p>
                <p>Welcome! Ask about your smart home or request a code preview.</p>
                <p>
                  Learn more at{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400 underline"
                    href="https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-react-components"
                    target="_blank"
                  >
                    Vercel AI SDK
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          )}
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Actions */}
        {messages.length === 0 && (
          <div className="grid grid-cols-2 gap-2 max-w-[600px] mx-auto mt-4">
            {suggestedActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * index }}
                onClick={async () => {
                  // Log the user's command.
                  setMessages((prev) => [
                    ...prev,
                    <Message
                      key={prev.length}
                      role="user"
                      content={action.action}
                    />,
                  ]);
                  // Trigger the AI action. For "Show me the code preview", your AI should return a message
                  // that renders <SandpackWithButtons />.
                  const response: ReactNode = await sendMessage(action.action);
                  setMessages((prev) => [...prev, response]);
                }}
                className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {action.label}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      {/* Input Field */}
      <footer className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="max-w-[600px] mx-auto">
          <form
            className="flex gap-2 items-center"
            onSubmit={async (event) => {
              event.preventDefault();
              setMessages((prev) => [
                ...prev,
                <Message key={prev.length} role="user" content={input} />,
              ]);
              setInput("");
              const response: ReactNode = await sendMessage(input);
              setMessages((prev) => [...prev, response]);
            }}
          >
            <input
              ref={inputRef}
              className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-md px-3 py-2 outline-none text-zinc-800 dark:text-zinc-300"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}