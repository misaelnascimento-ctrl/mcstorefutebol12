import React, { useState } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { calculateCartTotals } from '../utils/pricing';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle,
  Ticket,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  productsMap: Record<string, Product>;
  coupons?: Coupon[];
  appliedCoupon?: Coupon | null;
  onApplyCoupon?: (coupon: Coupon | null) => void;
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  productsMap,
  coupons = [],
  appliedCoupon = null,
  onApplyCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, productsMap, appliedCoupon);
  const percentToFreeShipping = Math.min(100, (totals.totalQuantity / 30) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const found = coupons.find(c => c.code.toUpperCase() === code && c.active);
    if (!found) {
      setCouponError('Cupom inválido ou expirado.');
      return;
    }

    if (totals.totalQuantity < (found.minPieces || 1)) {
      setCouponError(`Este cupom exige no mínimo ${found.minPieces} peças no carrinho.`);
      return;
    }

    if (onApplyCoupon) {
      onApplyCoupon(found);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Carrinho de Atacado
                </h2>
                <span className="bg-slate-100 text-slate-700 text-xs font-black px-2 py-0.5 rounded-full border border-slate-200">
                  {totals.totalQuantity} peças
                </span>
              </div>
              <button
                id="btn-close-cart-drawer"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Wholesale Progress Meter */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {totals.totalQuantity >= 30 ? (
                    <span className="text-emerald-700 font-black">SUPER ATACADO ATIVADO (R$ 45/un)!</span>
                  ) : totals.totalQuantity >= 10 ? (
                    <span className="text-slate-800">Faixa Padrão de Atacado (R$ 50/un)</span>
                  ) : (
                    <span className="text-amber-700">Mínimo de 10 peças para atacado</span>
                  )}
                </span>
                <span className="text-emerald-700 font-black">
                  {totals.totalQuantity}/30 peças
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentToFreeShipping}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                {totals.totalQuantity < 10 ? (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Faltam <strong>{10 - totals.totalQuantity} peças</strong> para o pedido mínimo
                  </span>
                ) : totals.totalQuantity < 30 ? (
                  <span className="text-emerald-800 font-medium">
                    Adicione mais <strong>{30 - totals.totalQuantity} peças</strong> para pagar R$ 45/un + <strong>FRETE GRÁTIS</strong>!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis e R$ 45/peça.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Seu carrinho está vazio</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Selecione os mantos no catálogo e utilize a grade rápida para montar seu pedido no atacado.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Explorar 150+ Modelos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="py-3.5 flex gap-3.5 items-center">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.productName}
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded border border-slate-200">
                        Tam: {item.size}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.size, -1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.size, 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.productId, item.size)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">
                      R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* Coupon Form */}
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cupom <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}% OFF` : `R$ ${appliedCoupon.discountValue} OFF`})</span>
                    </div>
                    <button
                      onClick={() => onApplyCoupon && onApplyCoupon(null)}
                      className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <Ticket className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Cupom de Desconto"
                          className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-rose-600 font-bold">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totals.totalQuantity} peças):</span>
                  <span className="font-bold text-slate-900">
                    R$ {totals.subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Desconto do Cupom:</span>
                    <span>- R$ {totals.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Frete (Correios / Jadlog):</span>
                  <span className="font-bold text-emerald-700">
                    {totals.isFreeShipping ? 'GRÁTIS' : `R$ ${totals.shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total do Pedido:</span>
                  <span className="text-emerald-700 text-xl">
                    R$ {totals.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                id="btn-proceed-to-checkout"
                disabled={!totals.meetsMinimumOrder}
                onClick={onProceedCheckout}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                  totals.meetsMinimumOrder
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25 hover:scale-[1.01] cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {totals.meetsMinimumOrder ? (
                  <>
                    <span>Ir para o Pagamento Seguro</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>Adicione mais {totals.piecesLeftForMinOrder} peças para finalizar</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mercado Pago • Pix com Aprovação Imediata</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
