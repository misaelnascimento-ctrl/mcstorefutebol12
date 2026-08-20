import React, { useState, useEffect } from 'react';
import { LIVE_PURCHASE_NOTIFICATIONS } from '../data/mockData';
import { PurchaseToastNotification } from '../types';
import { CheckCircle2, ShoppingBag, X, Zap } from 'lucide-react';

export function LivePurchaseToast() {
  const [currentNotification, setCurrentNotification] = useState<PurchaseToastNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let currentIndex = 0;
    
    // Initial delay before first popup
    const initialTimer = setTimeout(() => {
      setCurrentNotification(LIVE_PURCHASE_NOTIFICATIONS[0]);
      setIsVisible(true);
    }, 3500);

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % LIVE_PURCHASE_NOTIFICATIONS.length;
        setCurrentNotification(LIVE_PURCHASE_NOTIFICATIONS[currentIndex]);
        setIsVisible(true);
      }, 800);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (!currentNotification || isDismissed) return null;

  return (
    <div
      id="live-purchase-popup"
      className={`fixed bottom-5 left-4 sm:left-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3.5 shadow-xl shadow-emerald-950/10 flex items-start gap-3 relative overflow-hidden group hover:border-emerald-500 transition-colors">
        {/* Top subtle glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />

        {/* Icon / Avatar */}
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
          <ShoppingBag className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>NOVO PEDIDO NO ATACADO</span>
            <span className="text-slate-400 font-normal">• {currentNotification.timeAgo}</span>
          </div>

          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
            {currentNotification.customerName}{' '}
            <span className="font-normal text-slate-500 text-[11px]">({currentNotification.location})</span>
          </p>

          <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
            Comprei <strong className="text-emerald-600 font-bold">{currentNotification.itemCount} peças</strong> ({currentNotification.description})
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              <Zap className="w-3 h-3 text-emerald-600" />
              R$ {currentNotification.totalValue.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
              {currentNotification.paymentType} Aprovado
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="btn-dismiss-live-toast"
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
