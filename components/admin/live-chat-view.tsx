"use client"

import { useState, useEffect, useRef } from 'react'
import {
    MessageCircle,
    Send,
    Loader2,
    User,
    Search,
    MoreVertical,
    CheckCircle2,
    Clock,
    ArrowLeft
} from 'lucide-react'

interface Message {
    id: string
    sender: 'user' | 'admin'
    text: string
    timestamp: number
}

interface ChatSession {
    id: string
    lastMessage: string
    lastTimestamp: number
    unreadCount: number
    messages?: Message[]
}

export function LiveChatView() {
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isLoadingSessions, setIsLoadingSessions] = useState(true)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Fetch all sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/chat?admin=true')
                if (!res.ok) throw new Error('Failed to fetch sessions')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setSessions(data)
                } else {
                    console.error('Sessions data is not an array:', data)
                    setSessions([])
                }
            } catch (err) {
                console.error('Failed to fetch sessions', err)
                setSessions([])
            } finally {
                setIsLoadingSessions(false)
            }
        }

        fetchSessions()
        const interval = setInterval(fetchSessions, 10000)
        return () => clearInterval(interval)
    }, [])

    // Fetch messages for selected session
    useEffect(() => {
        if (!selectedSessionId) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?sessionId=${selectedSessionId}&admin=true`)
                const data = await res.json()
                if (data.messages) {
                    setMessages(data.messages)
                }
            } catch (err) {
                console.error('Failed to fetch messages', err)
            } finally {
                setIsLoadingMessages(false)
            }
        }

        setIsLoadingMessages(true)
        fetchMessages()
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [selectedSessionId])

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputText.trim() || !selectedSessionId || isSending) return

        const text = inputText.trim()
        setInputText('')
        setIsSending(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: selectedSessionId,
                    text,
                    sender: 'admin'
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
        <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in duration-500">
            {/* Session List */}
            <div className={`w-full lg:w-80 flex flex-col bg-card backdrop-blur-md border border-border rounded-3xl overflow-hidden ${selectedSessionId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-border">
                    <h3 className="text-xl font-black text-foreground mb-4">Conversations</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:border-[#0168A0] outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoadingSessions ? (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="w-6 h-6 text-[#0168A0] animate-spin" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12 opacity-30">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                            <p className="text-sm font-bold">No active chats</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${selectedSessionId === session.id
                                    ? 'bg-[#0168A0] text-white shadow-lg shadow-[#0168A0]/20'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-sm truncate">{session.id}</span>
                                        {session.unreadCount > 0 && (
                                            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                                {session.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs opacity-60 truncate">{session.lastMessage}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-card backdrop-blur-md border border-border rounded-3xl overflow-hidden ${!selectedSessionId ? 'hidden lg:flex' : 'flex'}`}>
                {selectedSessionId ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedSessionId(null)}
                                    className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 bg-[#0168A0]/20 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-[#0168A0]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{selectedSessionId}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4"
                        >
                            {isLoadingMessages ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-[#0168A0] animate-spin" />
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${msg.sender === 'admin'
                                            ? 'bg-[#0168A0] text-white rounded-tr-none'
                                            : 'bg-muted text-foreground border border-border rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                            <div className="flex items-center gap-1 mt-1 opacity-50 text-[10px]">
                                                <Clock className="w-3 h-3" />
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-6 bg-muted/50 border-t border-border">
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-card border border-border rounded-2xl px-5 py-4 text-foreground text-sm focus:border-[#0168A0] outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isSending}
                                    className="p-4 bg-[#0168A0] hover:bg-[#015580] text-white rounded-2xl transition-all disabled:opacity-50"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-2">Select a Conversation</h3>
                        <p className="text-sm font-bold max-w-xs">Choose a chat from the left to start responding to your customers.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
