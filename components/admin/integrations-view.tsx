"use client"

import { useState, useEffect } from 'react'
import {
    Code2,
    Save,
    Play,
    AlertTriangle,
    CheckCircle2,
    Trash2,
    Plus,
    History,
    Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface Script {
    id: string
    name: string
    code: string
    location: 'head' | 'body'
    enabled: boolean
}

export function IntegrationsView() {
    const [scripts, setScripts] = useState<Script[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeScriptId, setActiveScriptId] = useState<string | null>(null)

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const res = await fetch('/api/admin/scripts')
                if (res.ok) {
                    const data = await res.json()
                    setScripts(data)
                    if (data.length > 0) {
                        setActiveScriptId(data[0].id)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch scripts', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchScripts()
    }, [])

    const activeScript = scripts.find(s => s.id === activeScriptId)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/admin/scripts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scripts)
            })
            if (res.ok) {
                toast.success('Script configuration saved successfully')
            } else {
                toast.error('Failed to save scripts')
            }
        } catch (err) {
            toast.error('Failed to save scripts')
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddScript = () => {
        const newScript: Script = {
            id: `script-${Date.now()}`,
            name: 'New Tracking Script',
            code: '<!-- Add your script here -->',
            location: 'head',
            enabled: false
        }
        setScripts([...scripts, newScript])
        setActiveScriptId(newScript.id)
        toast.success('New script added')
    }

    const handleDeleteScript = (id: string) => {
        if (!confirm('Are you sure you want to delete this script?')) return
        const newScripts = scripts.filter(s => s.id !== id)
        setScripts(newScripts)
        if (activeScriptId === id) {
            setActiveScriptId(newScripts.length > 0 ? newScripts[0].id : null)
        }
        toast.success('Script deleted')
    }

    const handleToggle = (id: string) => {
        setScripts(scripts.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ))
    }

    const updateActiveScript = (updates: Partial<Script>) => {
        setScripts(scripts.map(s =>
            s.id === activeScriptId ? { ...s, ...updates } : s
        ))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#0168A0]" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-foreground">Integration Command</h2>
                    <p className="text-muted-foreground">Manage tracking codes and third-party scripts.</p>
                </div>
                <button
                    onClick={handleAddScript}
                    className="bg-[#0168A0] hover:bg-[#015580] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0168A0]/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Script
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Script List */}
                <div className="space-y-4">
                    {scripts.length > 0 ? scripts.map((script) => (
                        <div
                            key={script.id}
                            onClick={() => setActiveScriptId(script.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${activeScriptId === script.id
                                ? 'bg-[#0168A0]/10 border-[#0168A0] ring-1 ring-[#0168A0]'
                                : 'bg-card border-border hover:bg-muted'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${script.enabled ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                                        <Code2 className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-foreground text-sm">{script.name}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${script.enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-11">
                                <span className="uppercase font-bold tracking-wider">{script.location}</span>
                                <span>•</span>
                                <span>{script.enabled ? 'Active' : 'Disabled'}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 bg-card border border-dashed border-border rounded-2xl text-center">
                            <p className="text-muted-foreground text-sm font-bold">No scripts integrated yet</p>
                        </div>
                    )}
                </div>

                {/* Editor */}
                <div className="lg:col-span-2 bg-card backdrop-blur-md border border-border rounded-2xl p-6 flex flex-col h-[600px]">
                    {activeScript ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4 flex-1">
                                    <input
                                        type="text"
                                        value={activeScript.name}
                                        onChange={(e) => updateActiveScript({ name: e.target.value })}
                                        className="text-lg font-bold text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-[#0168A0] outline-none transition-all px-1 py-0.5"
                                    />
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeScript.enabled ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {activeScript.enabled ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(activeScript.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeScript.enabled
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {activeScript.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                    <select
                                        value={activeScript.location}
                                        onChange={(e) => updateActiveScript({ location: e.target.value as 'head' | 'body' })}
                                        className="bg-muted text-foreground text-sm font-bold px-3 py-2 rounded-lg outline-none border border-border"
                                    >
                                        <option value="head">Head</option>
                                        <option value="body">Body</option>
                                    </select>
                                    <button
                                        onClick={() => handleDeleteScript(activeScript.id)}
                                        className="p-2 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 bg-muted border border-border rounded-xl p-4 font-mono text-sm text-foreground overflow-auto mb-6 relative group">
                                <textarea
                                    value={activeScript.code}
                                    onChange={(e) => updateActiveScript({ code: e.target.value })}
                                    className="w-full h-full bg-transparent outline-none resize-none"
                                    spellCheck={false}
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Editor Mode</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-2 rounded-lg text-xs font-bold">
                                    <AlertTriangle className="w-4 h-4" />
                                    Changes affect live site immediately
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-[#0168A0] hover:bg-[#015580] text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-[#0168A0]/20 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <Code2 className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-bold">Select a script to edit or add a new one</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
