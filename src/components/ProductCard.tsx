import React from 'react';
import { Product } from '../types';
import { Sparkles, Eye, ShoppingCart, Star, Layers, ShieldCheck, Flame } from 'lucide-react';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({
  product,
  onSelect,
  onQuickAdd,
}: ProductCardProps) {
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const minTierPrice = product.wholesaleTiers[product.wholesaleTiers.length - 1]?.unitPrice || 45;
  const standardTierPrice = product.wholesaleTiers[1]?.unitPrice || 50;
  const maxProfitUnit = product.basePrice - minTierPrice;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/80 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Floating Badge */}
      <div className="flex items-center justify-between gap-2 absolute top-6 left-6 right-6 z-10 pointer-events-none">
        {product.badge ? (
          <span className="inline-flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
            {product.badge.includes('Vendido') ? <Flame className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-emerald-400" />}
            {product.badge}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
            1:1 Oficial
          </span>
        )}

        <span className="text-[10px] font-bold bg-white/95 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
          {product.season}
        </span>
      </div>

      {/* Image Showcase */}
      <div 
        onClick={() => onSelect(product)}
        className="relative w-full aspect-square rounded-2xl bg-slate-100 overflow-hidden cursor-pointer group-hover:scale-[1.01] transition-transform"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <span className="bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Ver Grade & Fotos HD
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="mt-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-bold text-emerald-700 uppercase">{product.club}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating?.toFixed(1) || '4.9'}</span>
              <span className="text-slate-400">({product.reviewsCount || 24})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="text-sm font-black text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Sizes Badges */}
          <div className="flex items-center gap-1 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold mr-1">Tamanhos:</span>
            {product.variants.map((v) => (
              <span
                key={v.size}
                className={`w-6 h-5 rounded-md text-[10px] font-black flex items-center justify-center border ${
                  v.stock > 0
                    ? 'bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-300 line-through'
                }`}
              >
                {v.size}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Matrix Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Preço Atacado:</span>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 line-through mr-1.5">
                R$ {product.basePrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-lg font-black text-slate-900">
                R$ {standardTierPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200 text-emerald-700 font-bold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Super Atacado (30+):
            </span>
            <span className="text-xs font-black text-emerald-800">
              R$ {minTierPrice.toFixed(2).replace('.', ',')} /un
            </span>
          </div>

          <div className="text-[10px] text-slate-500 font-medium bg-white px-2 py-1 rounded-lg border border-slate-200 text-center">
            Lucro estimado: <strong className="text-emerald-600">R$ {maxProfitUnit.toFixed(2).replace('.', ',')} /peça</strong>
          </div>
        </div>

        {/* CTA Button */}
        <button
          id={`btn-open-grade-${product.id}`}
          onClick={() => onSelect(product)}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/15 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Montar Grade no Atacado</span>
        </button>
      </div>
    </div>
  );
}
