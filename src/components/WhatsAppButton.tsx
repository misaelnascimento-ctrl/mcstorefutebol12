import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20cat%C3%A1logo%20de%20atacado%20MC%20Store"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 transition-all duration-300 hover:scale-110 group border-2 border-emerald-300/40"
      id="whatsapp-floating-btn"
      title="Falar com Consultor B2B no WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-zinc-950 stroke-zinc-950" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
      </div>
      <span className="hidden sm:inline font-black text-xs tracking-tight uppercase">
        Atendimento Atacado
      </span>
    </a>
  );
};
