"use client"

import { useState } from 'react'
import {
    Code2,
    Save,
    Play,
    AlertTriangle,
    CheckCircle2,
    Trash2,
    Plus,
    History
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

    const [activeScriptId, setActiveScriptId] = useState<string | null>(null)
    const activeScript = scripts.find(s => s.id === activeScriptId)

    const handleSave = () => {
        toast.success('Script configuration saved successfully')
    }

    const handleToggle = (id: string) => {
        setScripts(scripts.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ))
        toast.success('Script status updated')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-foreground">Integration Command</h2>
                    <p className="text-muted-foreground">Manage tracking codes and third-party scripts.</p>
                </div>
                <button className="bg-[#0168A0] hover:bg-[#015580] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0168A0]/20">
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
                                <span>Last edited 2d ago</span>
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
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-bold text-foreground">{activeScript.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeScript.enabled ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {activeScript.enabled ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(activeScript.id)}
                                        className={`p-2 rounded-lg transition-colors ${activeScript.enabled
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {activeScript.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                    <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                                        <History className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-400 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 bg-muted border border-border rounded-xl p-4 font-mono text-sm text-foreground overflow-auto mb-6 relative group">
                                <textarea
                                    value={activeScript.code}
                                    onChange={(e) => {
                                        const newScripts = scripts.map(s =>
                                            s.id === activeScript.id ? { ...s, code: e.target.value } : s
                                        )
                                        setScripts(newScripts)
                                    }}
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
                                    <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors flex items-center gap-2">
                                        <Play className="w-4 h-4" />
                                        Test Script
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-[#0168A0] hover:bg-[#015580] text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-[#0168A0]/20"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <Code2 className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-bold">Select a script to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

