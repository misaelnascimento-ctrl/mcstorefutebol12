import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Package, 
  Plane, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface ShippingSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  piecesCount?: number;
}

interface ShippingOption {
  carrierId: string;
  carrierName: string;
  serviceName: string;
  badge: string;
  badgeColor: string;
  deliveryTimeDays: string;
  estimatedPrice: number;
  isFree: boolean;
  officialCalculatorUrl: string;
  instructions: string;
  icon: 'truck' | 'plane' | 'package';
}

export function ShippingSimulatorModal({
  isOpen,
  onClose,
  piecesCount = 15,
}: ShippingSimulatorModalProps) {
  const [cep, setCep] = useState('');
  const [selectedState, setSelectedState] = useState('SP');
  const [selectedPieces, setSelectedPieces] = useState<number>(piecesCount || 15);
  const [isCalculated, setIsCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState<string>('');

  if (!isOpen) return null;

  // Format CEP (00000-000)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length > 5) {
      val = `${val.slice(0, 5)}-${val.slice(5)}`;
    }
    setCep(val);
  };

  // State-based region multiplier & base days
  const getStateData = (uf: string) => {
    switch (uf) {
      case 'SP':
        return { name: 'São Paulo (Capital e Interior)', mult: 1.0, sedexDays: '1 a 2 dias', jadlogDays: '2 a 3 dias', pacDays: '3 a 5 dias', basePrice: 28 };
      case 'RJ':
      case 'MG':
      case 'ES':
        return { name: 'Região Sudeste', mult: 1.2, sedexDays: '2 a 3 dias', jadlogDays: '3 a 5 dias', pacDays: '5 a 7 dias', basePrice: 38 };
      case 'PR':
      case 'SC':
      case 'RS':
        return { name: 'Região Sul', mult: 1.35, sedexDays: '2 a 4 dias', jadlogDays: '4 a 6 dias', pacDays: '6 a 8 dias', basePrice: 46 };
      case 'DF':
      case 'GO':
      case 'MT':
      case 'MS':
        return { name: 'Região Centro-Oeste', mult: 1.45, sedexDays: '2 a 4 dias', jadlogDays: '4 a 7 dias', pacDays: '7 a 10 dias', basePrice: 52 };
      case 'BA':
      case 'PE':
      case 'CE':
      case 'MA':
      case 'PB':
      case 'RN':
      case 'AL':
      case 'SE':
      case 'PI':
        return { name: 'Região Nordeste', mult: 1.6, sedexDays: '3 a 5 dias', jadlogDays: '5 a 8 dias', pacDays: '8 a 12 dias', basePrice: 64 };
      default: // Norte
        return { name: 'Região Norte', mult: 1.9, sedexDays: '3 a 6 dias', jadlogDays: '7 a 12 dias', pacDays: '10 a 16 dias', basePrice: 85 };
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    let stateToUse = selectedState;

    if (cep.length >= 8) {
      const cleanCep = cep.replace(/\D/g, '');
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (data && !data.erro && data.uf) {
          stateToUse = data.uf;
          setSelectedState(data.uf);
          setLocationName(`${data.localidade} - ${data.uf}`);
        } else {
          setLocationName(`Região ${selectedState}`);
        }
      } catch (err) {
        setLocationName(`Região ${selectedState}`);
      }
    } else {
      setLocationName(getStateData(selectedState).name);
    }

    setTimeout(() => {
      setLoading(false);
      setIsCalculated(true);
    }, 350);
  };

  const regionData = getStateData(selectedState);
  const isFreeShipping = selectedPieces >= 30;
  const estimatedWeightKg = ((selectedPieces * 0.25) + 0.4).toFixed(1);

  const shippingOptions: ShippingOption[] = [
    {
      carrierId: 'jadlog_package',
      carrierName: 'Jadlog (.Package)',
      serviceName: 'Econômico Atacado B2B',
      badge: isFreeShipping ? 'FRETE GRÁTIS' : 'Recomendado',
      badgeColor: isFreeShipping ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      deliveryTimeDays: regionData.jadlogDays,
      estimatedPrice: isFreeShipping ? 0 : Math.round(regionData.basePrice * regionData.mult * 0.85),
      isFree: isFreeShipping,
      officialCalculatorUrl: 'https://www.jadlog.com.br/jadlog/simulacao',
      instructions: `Simule na Jadlog com CEP de Origem: 06455-000, Peso: ${estimatedWeightKg} kg`,
      icon: 'truck',
    },
    {
      carrierId: 'correios_sedex',
      carrierName: 'Correios (SEDEX)',
      serviceName: 'Expresso Prioritário',
      badge: 'Mais Rápido',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      deliveryTimeDays: regionData.sedexDays,
      estimatedPrice: Math.round(regionData.basePrice * regionData.mult * 1.55),
      isFree: false,
      officialCalculatorUrl: 'https://www.correios.com.br/enviar/precos-e-prazos',
      instructions: `Simule no site dos Correios com CEP Origem: 06455-000`,
      icon: 'truck',
    },
    {
      carrierId: 'correios_pac',
      carrierName: 'Correios (PAC)',
      serviceName: 'Convencional Nacional',
      badge: isFreeShipping ? 'FRETE GRÁTIS' : 'Econômico',
      badgeColor: isFreeShipping ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-700 border border-slate-300',
      deliveryTimeDays: regionData.pacDays,
      estimatedPrice: isFreeShipping ? 0 : Math.round(regionData.basePrice * regionData.mult * 0.95),
      isFree: isFreeShipping,
      officialCalculatorUrl: 'https://www.correios.com.br/enviar/precos-e-prazos',
      instructions: `Simule PAC nos Correios com CEP Origem: 06455-000`,
      icon: 'truck',
    },
    {
      carrierId: 'loggi_express',
      carrierName: 'Loggi Express',
      serviceName: 'Entrega Rápida com Rastreio',
      badge: 'Express',
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-300',
      deliveryTimeDays: regionData.jadlogDays,
      estimatedPrice: Math.round(regionData.basePrice * regionData.mult * 1.05),
      isFree: false,
      officialCalculatorUrl: 'https://www.loggi.com/calculadora-de-frete/',
      instructions: `Simule na Loggi informando Origem Barueri/SP e o seu CEP`,
      icon: 'truck',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        id="shipping-simulator-modal-container"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header Compact */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-white leading-tight">Simulador de Frete e Prazos</h3>
              <p className="text-[11px] text-slate-400">
                Cotações Jadlog, Correios e transportadoras parceiras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 py-2.5 px-4 sm:px-5 flex items-center justify-between gap-2 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>FRETE GRÁTIS</strong> a partir de <strong>30 peças</strong> para todo o Brasil!
            </span>
          </div>
          <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase flex-shrink-0">
            30+ PEÇAS
          </span>
        </div>

        {/* Form and Results with Internal Scroll */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CEP Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" /> CEP Destino:
              </label>
              <input
                type="text"
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* State Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Estado (UF):</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setIsCalculated(false);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="SP">São Paulo (SP)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="ES">Espírito Santo (ES)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="DF">Distrito Federal (DF)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="PE">Pernambuco (PE)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
                <option value="PA">Pará (PA)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="SE">Sergipe (SE)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="TO">Tocantins (TO)</option>
                <option value="RO">Rondônia (RO)</option>
                <option value="AC">Acre (AC)</option>
                <option value="RR">Roraima (RR)</option>
                <option value="AP">Amapá (AP)</option>
              </select>
            </div>

            {/* Pieces Quantity Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Package className="w-3 h-3 text-emerald-600" /> Quantidade:
              </label>
              <select
                value={selectedPieces}
                onChange={(e) => {
                  setSelectedPieces(Number(e.target.value));
                  setIsCalculated(false);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value={5}>5 peças (~1.6kg)</option>
                <option value={10}>10 peças (~2.9kg)</option>
                <option value={20}>20 peças (~5.4kg)</option>
                <option value={30}>30 peças (🎁 FRETE GRÁTIS)</option>
                <option value={50}>50 peças (🎁 FRETE GRÁTIS)</option>
                <option value={100}>100 peças (🎁 FRETE GRÁTIS)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Calculando cotação...' : 'Calcular Prazos e Valores'}</span>
          </button>

          {/* Results List */}
          {isCalculated && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-700 truncate">
                  Destino: <strong className="text-slate-900">{locationName || selectedState}</strong> • <strong>{selectedPieces} peças ({estimatedWeightKg} kg)</strong>
                </span>
                <span className="text-[10px] text-slate-400">Origem: CD Barueri/SP</span>
              </div>

              <div className="space-y-2">
                {shippingOptions.map((opt) => (
                  <div
                    key={opt.carrierId}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      opt.isFree
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{opt.carrierName}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>Prazo: <strong>{opt.deliveryTimeDays}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        {opt.isFree ? (
                          <div className="text-emerald-700 font-black text-sm">GRÁTIS</div>
                        ) : (
                          <div className="text-slate-900 font-black text-sm">
                            R$ {opt.estimatedPrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <a
                        href={opt.officialCalculatorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Cotar no site oficial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>CEP de Origem da Distribuidora para cotação externa: <strong>06455-000</strong> (Barueri - SP).</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 px-5 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
          <span>Envios com rastreio em tempo real.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
