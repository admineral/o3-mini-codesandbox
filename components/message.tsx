"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <div className="px-4">
      <div className="ml-0 max-w-[700px]">
        <motion.div
          className="flex flex-row gap-2 first-of-type:pt-4 mt-1"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
            <BotIcon />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-2">
              <Markdown>{text}</Markdown>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  const containsSandpack = typeof content === 'string' ? 
    content.includes('Sandpack') : 
    String(content).includes('Sandpack');

  return (
    <div className={containsSandpack ? 'w-full' : 'px-4'}>
      <div className={containsSandpack ? 'w-full' : 'ml-0 max-w-[700px]'}>
        <motion.div
          className={`flex flex-row gap-2 ${
            containsSandpack 
              ? 'first-of-type:pt-8 mt-2 px-4' 
              : 'first-of-type:pt-4 mt-1'
          }`}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
            {role === "assistant" ? <BotIcon /> : <UserIcon />}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-2">
              {content}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
