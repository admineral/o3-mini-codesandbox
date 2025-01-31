"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";

export default function Home() {
  const { sendMessage } = useActions();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

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

  const handleSubmit = async (content: string) => {
    setMessages((prev) => [
      ...prev,
      <Message key={prev.length} role="user" content={content} />,
    ]);
    setIsLoading(true);
    try {
      const response: ReactNode = await sendMessage(content);
      setMessages((prev) => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
      <main className="flex-1 overflow-y-auto pb-[76px]">
        {/* Messages Container */}
        <div ref={messagesContainerRef} className="flex flex-col w-full">
          {messages.length === 0 ? (
            <div className="px-4 py-8">
              <div className="max-w-[700px] mx-auto">
                <motion.div
                  className="border border-gray-200 dark:border-zinc-700 rounded-xl p-8 backdrop-blur-sm bg-white/50 dark:bg-zinc-800/50 shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-center text-gray-600 dark:text-zinc-300 text-lg mb-4">
                    Welcome to the React Component Generator
                  </p>
                  <p className="text-center text-gray-600 dark:text-zinc-300 mb-2">
                    Ask me to create any React component or explain React concepts.
                  </p>
                  <p className="text-center text-gray-600 dark:text-zinc-300">
                    Try clicking one of the examples below to get started!
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                  {suggestedActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * index }}
                      onClick={async () => {
                        if (isLoading) return;
                        await handleSubmit(action.action);
                      }}
                      disabled={isLoading}
                      className="group border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-medium text-gray-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">
                        {action.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full py-4">
              {messages.map((message, index) => (
                <div key={index} className="w-full">
                  {message}
                </div>
              ))}
              {isLoading && (
                <div className="px-4">
                  <div className="ml-0 max-w-[700px]">
                    <motion.div
                      className="flex flex-row gap-4 items-center mt-2"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                        <div className="size-[24px] rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Assistant is thinking...
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Field - fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
        <div className="max-w-[700px] mx-auto">
          <form
            className="flex gap-3 items-center"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!input.trim()) return;
              setInput("");
              await handleSubmit(input);
            }}
          >
            <input
              ref={inputRef}
              className="flex-1 bg-gray-100 dark:bg-zinc-700 rounded-xl px-4 py-3 outline-none text-gray-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl px-6 py-3 font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}