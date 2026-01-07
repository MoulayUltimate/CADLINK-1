"use client"

import { useState } from 'react'
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    DollarSign,
    ArrowRight
} from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function ProductManagement() {
    const [product, setProduct] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState<any>(null)

    useEffect(() => {
        fetch('/api/product')
            .then(res => res.json())
            .then(data => {
                setProduct(data)
                setEditData(data)
            })
            .catch(err => console.error('Failed to fetch product', err))
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            })
            if (res.ok) {
                setProduct(editData)
                setIsEditing(false)
                toast.success("Product updated successfully")
            } else {
                toast.error("Failed to update product")
            }
        } catch (err) {
            console.error('Failed to save product', err)
            toast.error("An error occurred while saving")
        } finally {
            setIsSaving(false)
        }
    }

    const calculateMargin = (price: number, cogs: number) => {
        if (price === 0) return 0
        return ((price - cogs) / price) * 100
    }

    if (!product) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0168A0]"></div>
        </div>
    )

    const margin = calculateMargin(editData.price, editData.cogs)
    const isLowMargin = margin < 20

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Product Command</h2>
                    <p className="text-gray-400">Manage your single product store.</p>
                </div>
                {isEditing ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setIsEditing(false)
                                setEditData(product)
                            }}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#0168A0] hover:bg-[#015580] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0168A0]/20 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#0168A0] hover:bg-[#015580] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0168A0]/20"
                    >
                        <Edit2 className="w-5 h-5" />
                        Edit Product
                    </button>
                )}
            </div>

            {/* Product Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 group hover:border-white/20 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-12">
                    {/* Product Info */}
                    <div className="flex items-center gap-6 min-w-[350px]">
                        <div className="w-24 h-24 bg-[#0f172a] rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black w-full mb-2"
                                />
                            ) : (
                                <h3 className="text-2xl font-black text-white">{product.name}</h3>
                            )}
                            <p className="text-xs text-gray-500">SKU: {product.id.toUpperCase()}-2024</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    In Stock: {isEditing ? (
                                        <input
                                            type="number"
                                            value={editData.stock}
                                            onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
                                            className="bg-white/5 border border-white/10 rounded px-1 w-16 text-white"
                                        />
                                    ) : product.stock}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Smart Margins */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price</p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-xl font-black">$</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editData.price}
                                        onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black w-32"
                                    />
                                ) : (
                                    <span className="text-3xl font-black text-white">{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">COGS (Cost of Goods Sold)</p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-xl font-black">$</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editData.cogs}
                                        onChange={(e) => setEditData({ ...editData, cogs: parseFloat(e.target.value) })}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black w-32"
                                    />
                                ) : (
                                    <p className="text-3xl font-black text-gray-400">{product.cogs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Profit Margin</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-3xl font-black ${isLowMargin ? 'text-orange-400' : 'text-green-400'}`}>
                                    {margin.toFixed(1)}%
                                </span>
                                {isLowMargin && (
                                    <div className="group/tip relative">
                                        <AlertTriangle className="w-5 h-5 text-orange-400 animate-pulse" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-orange-500 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none">
                                            Low margin detected! Consider raising price or reducing COGS.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Product Description</p>
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#0168A0] outline-none h-32"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

