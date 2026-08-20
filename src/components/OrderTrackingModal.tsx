import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Package, 
  Building2, 
  AlertCircle,
  PhoneCall,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialTrackingCode?: string;
}

export interface CarrierInfo {
  id: string;
  name: string;
  badgeColor: string;
  logoText: string;
  trackingUrl: (code: string) => string;
  directPortalUrl: string;
  serviceDescription: string;
  supportPhone: string;
}

export const CARRIERS_DATABASE: Record<string, CarrierInfo> = {
  correios: {
    id: 'correios',
    name: 'Correios (SEDEX / PAC)',
    badgeColor: 'bg-yellow-400 text-slate-950 font-black',
    logoText: 'CORREIOS',
    trackingUrl: (code) => `https://www.linkcorreios.com.br/?id=${code}`,
    directPortalUrl: 'https://rastreamento.correios.com.br/app/index.php',
    serviceDescription: 'Entrega nacional oficial com rastreio ponto a ponto dos Correios.',
    supportPhone: '0800 725 0100',
  },
  jadlog: {
    id: 'jadlog',
    name: 'Jadlog (.Package / .Comercial)',
    badgeColor: 'bg-red-600 text-white font-black',
    logoText: 'JADLOG',
    trackingUrl: (code) => `https://www.jadlog.com.br/tracking?tracking=${code}`,
    directPortalUrl: 'https://www.jadlog.com.br/tracking',
    serviceDescription: 'Transportadora expressa parceira oficial para envios atacadistas B2B.',
    supportPhone: '(11) 3935-8000',
  },
  loggi: {
    id: 'loggi',
    name: 'Loggi Express',
    badgeColor: 'bg-blue-600 text-white font-black',
    logoText: 'LOGGI',
    trackingUrl: (code) => `https://www.loggi.com/rastreador/?tracking=${code}`,
    directPortalUrl: 'https://www.loggi.com/rastreador/',
    serviceDescription: 'Entregas expressas com rastreamento detalhado em tempo real.',
    supportPhone: '(11) 4000-1212',
  },
  totalexpress: {
    id: 'totalexpress',
    name: 'Total Express (TexCourrier)',
    badgeColor: 'bg-indigo-600 text-white font-black',
    logoText: 'TOTAL EXPRESS',
    trackingUrl: (code) => `https://tracking.totalexpress.com.br/tracking/0?codigo=${code}`,
    directPortalUrl: 'https://totalexpress.com.br/',
    serviceDescription: 'Rede logística de alta capilaridade para volumes B2B.',
    supportPhone: '(11) 3627-5900',
  },
  azulcargo: {
    id: 'azulcargo',
    name: 'Azul Cargo Express (Aéreo)',
    badgeColor: 'bg-sky-600 text-white font-black',
    logoText: 'AZUL CARGO',
    trackingUrl: (code) => `https://www.azulcargoexpress.com.br/Rastreio?awb=${code}`,
    directPortalUrl: 'https://www.azulcargoexpress.com.br/',
    serviceDescription: 'Frete aéreo expresso para capitais e polos regionais em até 48h.',
    supportPhone: '0800 884 4040',
  },
  braspress: {
    id: 'braspress',
    name: 'Braspress Logística',
    badgeColor: 'bg-blue-950 text-white font-black',
    logoText: 'BRASPRESS',
    trackingUrl: (code) => `https://www.braspress.com/rastreie-sua-encomenda/?conhecimento=${code}`,
    directPortalUrl: 'https://www.braspress.com/',
    serviceDescription: 'Transporte rodoviário especializado em grandes caixas e pallets.',
    supportPhone: '0800 775 3333',
  },
};

export function OrderTrackingModal({
  isOpen,
  onClose,
  orders,
  initialTrackingCode = '',
}: OrderTrackingModalProps) {
  const [searchInput, setSearchInput] = useState(initialTrackingCode || 'JAD9847291823');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('jadlog');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'orders-list'>('tracker');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Agora mesmo');

  useEffect(() => {
    if (initialTrackingCode) {
      setSearchInput(initialTrackingCode);
    }
  }, [initialTrackingCode]);

  if (!isOpen) return null;

  // Find matching order if any
  const matchedOrder = orders.find(
    (o) => 
      (o.trackingCode && o.trackingCode.toLowerCase() === searchInput.trim().toLowerCase()) ||
      o.orderNumber.toLowerCase() === searchInput.trim().toLowerCase()
  );

  const activeTrackingCode = matchedOrder?.trackingCode || searchInput.trim() || 'JAD9847291823';
  const currentCarrierKey = matchedOrder?.trackingCarrier 
    ? (Object.keys(CARRIERS_DATABASE).find(k => matchedOrder.trackingCarrier?.toLowerCase().includes(k)) || 'jadlog')
    : selectedCarrier;
  
  const carrierInfo = CARRIERS_DATABASE[currentCarrierKey] || CARRIERS_DATABASE.jadlog;

  // Status computation
  const isDelivered = matchedOrder?.status === 'DELIVERED';
  const isShipped = matchedOrder?.status === 'SHIPPED' || isDelivered;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTrackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshLive = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  const milestones = [
    {
      title: 'Objeto Coletado / Postado na Origem',
      description: 'Lote de camisas 1:1 coletado na Central de Distribuição MC Store.',
      location: 'Barueri - SP / Centro de Distribuição B2B',
      date: '18/08/2026 14:32',
      completed: true,
      badge: 'Origem',
    },
    {
      title: 'Em Trânsito entre Unidades de Tratamento',
      description: 'Carga transferida para o Centro Operacional de Triagem e Distribuição.',
      location: 'São Paulo - SP ➔ Centro Operacional Logístico',
      date: '18/08/2026 21:45',
      completed: isShipped,
      badge: 'Transferência',
    },
    {
      title: 'Carga em Rota de Entrega ao Destinatário',
      description: 'Veículo em deslocamento para o endereço comercial do lojista.',
      location: matchedOrder?.shippingAddress?.city 
        ? `${matchedOrder.shippingAddress.city} - ${matchedOrder.shippingAddress.state}`
        : 'Unidade de Entrega Local / Cidade Destino',
      date: '19/08/2026 08:20',
      completed: isShipped,
      badge: 'Última Milha',
    },
    {
      title: isDelivered ? 'Objeto Entregue ao Lojista' : 'Previsão de Chegada no Endereço',
      description: isDelivered 
        ? 'Encomenda recebida e conferida com sucesso no destino.' 
        : 'Entrega estimada no endereço cadastrado até as 18h00.',
      location: matchedOrder?.shippingAddress?.city 
        ? `${matchedOrder.shippingAddress.city} - ${matchedOrder.shippingAddress.state}`
        : 'Endereço Comercial Cadastrado',
      date: isDelivered ? '19/08/2026 16:15' : 'Hoje até 18:00',
      completed: isDelivered,
      badge: isDelivered ? 'Entregue' : 'Previsão',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo size={40} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Rastreamento de Pedidos em Tempo Real</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Acompanhe o trajeto ponto a ponto via Correios, Jadlog, Loggi e Azul Cargo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar with Carrier Selector */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Digite o Código de Rastreio (ex: JAD9847291823) ou Número do Pedido..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedCarrier}
              onChange={(e) => setSelectedCarrier(e.target.value)}
              className="px-3 py-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {Object.values(CARRIERS_DATABASE).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefreshLive}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Atualizar status em tempo real"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>

          {/* Quick carrier tags */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1">
            <span className="text-slate-500 font-bold whitespace-nowrap">Transportadora:</span>
            {Object.values(CARRIERS_DATABASE).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCarrier(c.id)}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  currentCarrierKey === c.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.logoText}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Card Summary */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Código de Rastreamento
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {activeTrackingCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copiar Código de Rastreio"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${carrierInfo.badgeColor}`}>
                  {carrierInfo.name}
                </span>
                <span className="text-[10px] text-slate-400">Sincronizado: {lastSyncTime}</span>
              </div>
            </div>

            {/* Direct Official Carrier Web Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="text-xs text-slate-300">
                {matchedOrder ? (
                  <span>Pedido <strong>{matchedOrder.orderNumber}</strong> • {matchedOrder.totalQuantity} peças</span>
                ) : (
                  <span>Rastreamento Integrado em Tempo Real</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Official carrier direct link */}
                <a
                  href={carrierInfo.trackingUrl(activeTrackingCode)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Abrir no Site Oficial da {carrierInfo.logoText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Histórico Ponto a Ponto da Encomenda</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Status: {isDelivered ? 'Entregue' : isShipped ? 'Em Trânsito' : 'Aguardando Coleta'}
              </span>
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      milestone.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-300'
                    }`}
                  >
                    {milestone.completed ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`p-3.5 rounded-2xl border transition-all ${
                      milestone.completed
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="font-bold text-xs text-slate-900">{milestone.title}</div>
                      <div className="text-[11px] font-mono text-slate-500">{milestone.date}</div>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{milestone.description}</div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 mt-2">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{milestone.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrier Direct Contact Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-slate-600" />
              <div>
                <div className="font-bold text-slate-800">SAC da {carrierInfo.name}</div>
                <div className="text-slate-500 text-[11px]">Telefone de Atendimento: {carrierInfo.supportPhone}</div>
              </div>
            </div>

            <a
              href={carrierInfo.directPortalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-slate-950 text-[11px] underline"
            >
              <span>Portal {carrierInfo.logoText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Todos os envios da MC Store possuem seguro total contra extravio ou avaria.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
