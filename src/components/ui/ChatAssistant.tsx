import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";

// Backend API URL
const API_BASE_URL = "http://localhost:8000/api";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
};

export const ChatAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Hi! I'm Mindful, your AI financial coach. I've analyzed your recent transactions—what would you like to know about your spending habits?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [
                    ...prev,
                    { id: (Date.now() + 1).toString(), role: "ai", content: data.reply }
                ]);
            } else {
                throw new Error("API error");
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: "ai", content: "Sorry, I'm having trouble connecting to my servers right now. Please try again later." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-card rounded-lg border border-border shadow-card flex flex-col h-[400px]"
        >
            <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="font-display font-semibold text-foreground">Mindful AI Coach</h3>
                    <p className="text-xs text-muted-foreground">Ask me about your spending patterns</p>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                            }`}>
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${msg.role === "user"
                                ? "bg-accent text-accent-foreground rounded-tr-sm"
                                : "bg-secondary text-secondary-foreground rounded-tl-sm"
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-secondary rounded-tl-sm flex items-center gap-1">
                            <Loader2 size={14} className="animate-spin text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-border bg-background/50 rounded-b-lg">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Why was my entertainment flagged?"
                        className="w-full bg-secondary/50 border border-border rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 top-1.5 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
