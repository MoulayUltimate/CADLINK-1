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
import { mockProducts } from '@/app/admin/lib/mock-data'

export function ProductManagement() {
    const [products, setProducts] = useState(mockProducts)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const calculateMargin = (price: number, cogs: number) => {
        if (price === 0) return 0
        return ((price - cogs) / price) * 100
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Product Command</h2>
                    <p className="text-gray-400">Manage inventory and optimize profit margins.</p>
                </div>
                <button className="bg-[#0168A0] hover:bg-[#015580] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0168A0]/20">
                    <Plus className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-[#0168A0] focus:ring-1 focus:ring-[#0168A0] outline-none transition-all"
                    />
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all">
                    Filters
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => {
                    const margin = calculateMargin(product.price, product.cogs)
                    const isLowMargin = margin < 20

                    return (
                        <div key={product.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                {/* Product Info */}
                                <div className="flex items-center gap-4 min-w-[300px]">
                                    <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center border border-white/5">
                                        <Package className="w-8 h-8 text-[#0168A0]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white">{product.name}</h3>
                                        <p className="text-xs text-gray-500">SKU: {product.id.toUpperCase()}-2024</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Smart Margins */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Price</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-white">${product.price.toLocaleString()}</span>
                                            <Edit2 className="w-3 h-3 text-gray-600 cursor-pointer hover:text-white transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">COGS</p>
                                        <p className="text-xl font-black text-gray-400">${product.cogs.toLocaleString()}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Profit Margin</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xl font-black ${isLowMargin ? 'text-orange-400' : 'text-green-400'}`}>
                                                {margin.toFixed(1)}%
                                            </span>
                                            {isLowMargin && (
                                                <div className="group/tip relative">
                                                    <AlertTriangle className="w-4 h-4 text-orange-400 animate-pulse" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-orange-500 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none">
                                                        Low margin detected! Consider raising price or reducing COGS.
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <button className="p-3 bg-white/5 hover:bg-[#0168A0]/20 text-gray-400 hover:text-[#0168A0] rounded-xl transition-all border border-transparent hover:border-[#0168A0]/30">
                                        <TrendingUp className="w-5 h-5" />
                                    </button>
                                    <button className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/30">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5">
                                        View Details
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
