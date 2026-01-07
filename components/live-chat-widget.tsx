"use client"

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react'

interface Message {
    id: string
    sender: 'user' | 'admin'
    text: string
    timestamp: number
}

export function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Initialize session
    useEffect(() => {
        let id = localStorage.getItem('chat_session_id')
        if (!id) {
            id = 'sess_' + Math.random().toString(36).substring(7)
            localStorage.setItem('chat_session_id', id)
        }
        setSessionId(id)
    }, [])

    // Polling for new messages
    useEffect(() => {
        if (!sessionId || !isOpen) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?sessionId=${sessionId}`)
                const data = await res.json()
                if (data.messages) {
                    setMessages(data.messages)
                }
            } catch (err) {
                console.error('Failed to fetch messages', err)
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [sessionId, isOpen])

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputText.trim() || !sessionId || isSending) return

        const text = inputText.trim()
        setInputText('')
        setIsSending(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    text,
                    sender: 'user'
                })
            })
            const data = await res.json()
            if (data.messages) {
                setMessages(data.messages)
            }
        } catch (err) {
            console.error('Failed to send message', err)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            {isOpen && (
                <div
                    className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white border border-gray-200 rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-[#0168A0] to-[#015580] text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest">Live Support</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold opacity-80">Online & Ready</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-[#f8fafc]"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                                <MessageCircle className="w-12 h-12 text-[#0168A0]" />
                                <p className="text-[#0168A0] text-sm font-bold">How can we help you today?</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-sm ${msg.sender === 'user'
                                            ? 'bg-[#0168A0] text-white rounded-tr-none'
                                            : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                        <div className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isSending}
                                className="p-4 bg-[#0168A0] hover:bg-[#015580] text-white rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-[#0168A0]/20 active:scale-95"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-[#0168A0] hover:bg-[#015580] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 group relative"
            >
                <div className="absolute inset-0 bg-[#0168A0] rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
            </button>
        </div>
    )
}
