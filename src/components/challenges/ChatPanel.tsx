import React, { useMemo, useRef, useState } from "react";

interface ChatMessageItem {
  userId?: string;
  profilePic?: string;
  message?: string;
  Message?: string;
  time?: number;
  Time?: number;
}

interface ChatPanelProps {
  messages: ChatMessageItem[];
  onSend: (text: string) => void;
  currentUserId?: string;
}

const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "😎", "🤗", "👍", "🔥", "🎉", "🥳", "🚀", "✨", "💯", "🙌", "🤝", "💡", "🧠", "🛠️"
];

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSend, currentUserId }) => {
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => Array.isArray(messages) ? messages : [], [messages]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [items.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    try {
      console.debug('[UI][ChatPanel] onSend', text);
      onSend(text);
    } catch (e) {
      alert(e)
    }
    setInput("");
  };

  const appendEmoji = (e: string) => {
    setInput((prev) => prev + e);
    setShowEmojis(false);
  };

  return (
    <div className="border border-zinc-800/50 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-950">
      <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Chat</h2>
        <span className="text-xs text-zinc-400">{items.length} messages</span>
      </div>
      <div ref={listRef} className="p-3 space-y-2 max-h-64 overflow-y-auto">
        {items.length > 0 ? (
          items.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-2 ${m.userId === currentUserId ? 'justify-end' : ''}`}>
              {m.userId !== currentUserId && (
                <img src={m.profilePic || "/avatar.png"} alt="pfp" className="w-6 h-6 rounded-full border border-zinc-800" />
              )}
              <div className={`max-w-[70%] ${m.userId === currentUserId ? 'bg-emerald-700/30 border-emerald-500/40' : 'bg-zinc-800/50 border-zinc-700'} border rounded px-3 py-2`}>
                <div className="text-2xs text-zinc-400 mb-1">{new Date(((m.time ?? m.Time) || 0) * 1000).toLocaleTimeString()}</div>
                <div className="text-sm whitespace-pre-wrap break-words">{m.message ?? m.Message}</div>
              </div>
              {m.userId === currentUserId && (
                <img src={m.profilePic || "/avatar.png"} alt="pfp" className="w-6 h-6 rounded-full border border-zinc-800" />
              )}
            </div>
          ))
        ) : (
          <div className="text-xs text-zinc-500">No messages yet.</div>
        )}
      </div>
      <div className="p-3 border-t border-zinc-800/60">
        <form className="flex gap-2 items-center" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <button
            type="button"
            className="px-2 py-2 border border-zinc-700 rounded text-lg hover:bg-zinc-900"
            onClick={() => setShowEmojis((s) => !s)}
            aria-label="Toggle emoji picker"
          >
            😊
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-3 py-2 bg-primary  rounded text-sm hover:opacity-90 disabled:opacity-50"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
        {showEmojis && (
          <div className="mt-2 p-2 border border-zinc-800 rounded bg-zinc-900 grid grid-cols-10 gap-1 max-h-40 overflow-y-auto">
            {EMOJIS.map((e) => (
              <button key={e} className="text-xl hover:scale-110 transition" onClick={() => appendEmoji(e)}>{e}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;


