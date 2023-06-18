"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const endOfChatRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    endOfChatRef.current && endOfChatRef.current.scrollIntoView({ behavior: "instant" });
  }, [messages, lastMessage?.content]);

  return (
    <section className="container">
      <div className="chat">
        {messages.length > 0
          ? messages.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                {m.content}
              </div>
            ))
          : null}

        <div ref={endOfChatRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input value={input} placeholder="Send a message" onChange={handleInputChange} />
      </form>
    </section>
  );
}
