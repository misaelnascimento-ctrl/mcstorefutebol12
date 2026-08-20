import React, { useState, useMemo } from 'react';
import { Size, ProductVariant, WholesaleTier } from '../types';
import { Minus, Plus, ShoppingCart, Check, Sparkles, Layers, Info, CheckCircle2 } from 'lucide-react';

interface WholesaleGridProps {
  productId: string;
  productName: string;
  variants: ProductVariant[];
  wholesaleTiers: WholesaleTier[];
  currentCartTotalQuantity: number;
  onAddBatchToCart: (items: { size: Size; quantity: number }[]) => void;
}

const DEFAULT_ALL_SIZES: Size[] = ['P', 'M', 'G', 'GG', 'XG', '2XG', '3XG', 'Juvenil'];

export function WholesaleGrid({
  productId,
  productName,
  variants,
  wholesaleTiers,
  currentCartTotalQuantity,
  onAddBatchToCart,
}: WholesaleGridProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  const availableSizes = useMemo<Size[]>(() => {
    if (variants && variants.length > 0) {
      return variants.map((v) => v.size as Size);
    }
    return DEFAULT_ALL_SIZES;
  }, [variants]);

  const variantMap = useMemo(() => {
    const map = new Map<string, ProductVariant>();
    variants.forEach((v) => map.set(v.size, v));
    return map;
  }, [variants]);

  const totalSelectedInGrid = useMemo(() => {
    return (Object.values(quantities) as number[]).reduce((acc: number, q: number) => acc + (q || 0), 0);
  }, [quantities]);

  const projectedTotalCart = currentCartTotalQuantity + totalSelectedInGrid;

  const currentUnitPrice = useMemo(() => {
    const qty = projectedTotalCart > 0 ? projectedTotalCart : currentCartTotalQuantity || 1;
    for (const tier of wholesaleTiers) {
      if (qty >= tier.minQuantity) {
        if (tier.maxQuantity === undefined || qty <= tier.maxQuantity) {
          return tier.unitPrice;
        }
      }
    }
    return wholesaleTiers[0]?.unitPrice || 60;
  }, [projectedTotalCart, currentCartTotalQuantity, wholesaleTiers]);

  const gridSubtotal = totalSelectedInGrid * currentUnitPrice;

  const handleQuantityChange = (size: Size, delta: number) => {
    const stock = variantMap.get(size)?.stock ?? 0;
    setQuantities((prev) => {
      const current = prev[size] || 0;
      const next = Math.max(0, Math.min(stock, current + delta));
      return { ...prev, [size]: next };
    });
  };

  const handleDirectInput = (size: Size, val: string) => {
    const stock = variantMap.get(size)?.stock ?? 0;
    const parsed = parseInt(val, 10);
    const num = isNaN(parsed) ? 0 : Math.max(0, Math.min(stock, parsed));
    setQuantities((prev) => ({ ...prev, [size]: num }));
  };

  const handleQuickPreset = (qtyPerSize: number) => {
    const newQty: Record<string, number> = {};
    availableSizes.forEach((size) => {
      const stock = variantMap.get(size)?.stock ?? 0;
      newQty[size] = Math.min(stock, qtyPerSize);
    });
    setQuantities(newQty);
  };

  const handleReset = () => {
    setQuantities({});
  };

  const handleAddAll = () => {
    const itemsToAdd = availableSizes
      .filter((size) => (quantities[size] || 0) > 0)
      .map((size) => ({
        size,
        quantity: quantities[size] || 0,
      }));

    if (itemsToAdd.length === 0) return;

    onAddBatchToCart(itemsToAdd);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      handleReset();
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Tier Price Preview Banner */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {wholesaleTiers.map((tier, idx) => {
          const isActive =
            projectedTotalCart >= tier.minQuantity &&
            (tier.maxQuantity === undefined || projectedTotalCart <= tier.maxQuantity);

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-600">
                {tier.maxQuantity ? `${tier.minQuantity} a ${tier.maxQuantity} pçs` : `${tier.minQuantity}+ pçs`}
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                R$ {tier.unitPrice.toFixed(2).replace('.', ',')}
              </div>
              {isActive && (
                <div className="text-[10px] font-black text-emerald-700 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Faixa Ativa
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="text-xs font-bold text-slate-600">Montagem Rápida de Grade:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickPreset(2)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            +2 de cada
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset(5)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            +5 de cada
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset(10)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            +10 de cada
          </button>
          {totalSelectedInGrid > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold underline px-1 cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Size Matrix Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="grid grid-cols-12 bg-slate-100/90 px-4 py-2.5 text-xs font-black text-slate-600 uppercase tracking-wider border-b border-slate-200">
          <div className="col-span-3">Tamanho</div>
          <div className="col-span-3 text-center">Estoque B2B</div>
          <div className="col-span-4 text-center">Quantidade</div>
          <div className="col-span-2 text-right">Subtotal</div>
        </div>

        <div className="divide-y divide-slate-100">
          {availableSizes.map((size) => {
            const variant = variantMap.get(size);
            const stock = variant?.stock ?? 0;
            const isOutOfStock = stock <= 0;
            const currentQty = quantities[size] || 0;
            const rowSubtotal = currentQty * currentUnitPrice;

            return (
              <div
                key={size}
                className={`grid grid-cols-12 items-center px-4 py-3 transition-colors ${
                  currentQty > 0 ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                }`}
              >
                {/* Size Label */}
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-slate-900">
                    {size}
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                    {variant?.sku || `SKU-${size}`}
                  </span>
                </div>

                {/* Stock info */}
                <div className="col-span-3 text-center">
                  {isOutOfStock ? (
                    <span className="inline-flex text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Esgotado
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        stock < 15 ? 'text-amber-600' : 'text-slate-700'
                      }`}
                    >
                      {stock} un
                    </span>
                  )}
                </div>

                {/* Controls */}
                <div className="col-span-4 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    disabled={isOutOfStock || currentQty === 0}
                    onClick={() => handleQuantityChange(size, -1)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="number"
                    min={0}
                    max={stock}
                    disabled={isOutOfStock}
                    value={currentQty === 0 ? '' : currentQty}
                    placeholder="0"
                    onChange={(e) => handleDirectInput(size, e.target.value)}
                    className="w-14 h-8 text-center bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-30"
                  >
                  </input>

                  <button
                    type="button"
                    disabled={isOutOfStock || currentQty >= stock}
                    onClick={() => handleQuantityChange(size, 1)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="col-span-2 text-right font-black text-xs sm:text-sm text-slate-900">
                  {currentQty > 0 ? (
                    <span className="text-emerald-700">
                      R$ {rowSubtotal.toFixed(2).replace('.', ',')}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Batch Action Footer */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-semibold">Resumo da Grade Selecionada:</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">{totalSelectedInGrid}</span>
            <span className="text-xs text-slate-500 font-medium">peças no lote</span>
            <span className="text-slate-300 font-light">|</span>
            <span className="text-xl font-black text-emerald-700">
              R$ {gridSubtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        <button
          id="btn-add-grade-to-cart"
          type="button"
          disabled={totalSelectedInGrid === 0}
          onClick={handleAddAll}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            addedSuccess
              ? 'bg-emerald-600 text-white'
              : totalSelectedInGrid > 0
              ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Grade Adicionada ao Carrinho!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Adicionar Grade ({totalSelectedInGrid} peças)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
