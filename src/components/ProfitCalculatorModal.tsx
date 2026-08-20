import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Sparkles, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';

interface ProfitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCatalog?: () => void;
  onOpenCart?: () => void;
}

export function ProfitCalculatorModal({
  isOpen,
  onClose,
  onGoToCatalog,
  onOpenCart,
}: ProfitCalculatorModalProps) {
  const [pieces, setPieces] = useState<number>(30);
  const [resalePrice, setResalePrice] = useState<number>(140);

  if (!isOpen) return null;

  // Wholesale cost calculation
  const getWholesaleUnitCost = (qty: number) => {
    if (qty >= 30) return 45.00;
    if (qty >= 10) return 50.00;
    return 60.00;
  };

  const unitCost = getWholesaleUnitCost(pieces);
  const totalInvestment = pieces * unitCost;
  const totalRevenue = pieces * resalePrice;
  const netProfit = totalRevenue - totalInvestment;
  const profitMarginPercent = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" /> SIMULADOR B2B
          </div>
          <h2 className="text-2xl font-black tracking-tight">Calcule seu Lucro na Revenda</h2>
          <p className="text-xs text-slate-300 mt-1">
            Veja em tempo real quanto você lucra comprando no atacado da MC Store.
          </p>
        </div>

        {/* Sliders & Controls */}
        <div className="p-6 space-y-6">
          {/* Pieces Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Quantidade de Peças:</span>
              <span className="text-base text-emerald-600 font-black">{pieces} peças</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={pieces}
              onChange={(e) => setPieces(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>10 un (Mínimo)</span>
              <span>30 un (R$ 45/un + Frete Grátis)</span>
              <span>200 un (Distribuição)</span>
            </div>
          </div>

          {/* Resale Price Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Seu Preço de Revenda Médio:</span>
              <span className="text-base text-slate-900 font-black">R$ {resalePrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <input
              type="range"
              min={90}
              max={200}
              step={5}
              value={resalePrice}
              onChange={(e) => setResalePrice(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>R$ 90 (Giro Rápido)</span>
              <span>R$ 140 (Média de Mercado)</span>
              <span>R$ 190 (Alto Padrão)</span>
            </div>
          </div>

          {/* Result Matrix Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Seu Custo Unitário:</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  R$ {unitCost.toFixed(2).replace('.', ',')} <span className="text-xs text-slate-400 font-normal">/un</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Investimento Total:</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  R$ {totalInvestment.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Faturamento Bruto:</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  R$ {totalRevenue.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-300/80 p-3 rounded-xl text-right">
                <div className="text-[11px] font-bold text-emerald-800 uppercase flex items-center justify-end gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Lucro Líquido:
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">
                  + R$ {netProfit.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] font-black text-emerald-700">
                  {profitMarginPercent.toFixed(0)}% de Retorno / Margem
                </div>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <button
            onClick={() => {
              onClose();
              onGoToCatalog();
            }}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>Montar Pedido de {pieces} Peças</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
