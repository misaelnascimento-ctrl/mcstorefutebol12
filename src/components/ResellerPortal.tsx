import React, { useState } from 'react';
import { Order, Product, CartItem, AuthUser, Size } from '../types';
import { CARRIERS_DATABASE } from './OrderTrackingModal';
import { BrandLogo } from './BrandLogo';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Truck, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  FileText, 
  MessageCircle, 
  Sparkles, 
  Store, 
  ShieldCheck,
  TrendingUp,
  Calculator,
  Layers,
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  Share2,
  Filter,
  Eye,
  Sliders,
  Award,
  PackageCheck,
  MapPin,
  Instagram,
  ShoppingCart,
  CreditCard,
  QrCode,
  Zap,
  Plus,
  Minus,
  Trash2,
  Lock,
  ArrowRight,
  Save,
  User
} from 'lucide-react';

interface ResellerPortalProps {
  orders: Order[];
  products: Product[];
  currentUser: AuthUser | null;
  onReorder: (items: CartItem[]) => void;
  onBackToStore: () => void;
  onOpenCalculator: () => void;
  onOpenTrackingModal?: (code?: string) => void;
  onBuyBatch?: (items: CartItem[], directCheckout?: boolean) => void;
  onOpenCheckout?: () => void;
  onUpdateUserProfile?: (updated: Partial<AuthUser>) => void;
}

export function ResellerPortal({
  orders,
  products,
  currentUser,
  onReorder,
  onBackToStore,
  onOpenCalculator,
  onOpenTrackingModal,
  onBuyBatch,
  onOpenCheckout,
  onUpdateUserProfile,
}: ResellerPortalProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'orders' | 'media' | 'tracking' | 'benefits' | 'profile'>('buy');
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [copiedCopyText, setCopiedCopyText] = useState<string | null>(null);
  const [copiedImageLink, setCopiedImageLink] = useState<string | null>(null);

  // Reseller Profile & Address Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileTradeName, setProfileTradeName] = useState(currentUser?.tradeName || '');
  const [profileCnpjCpf, setProfileCnpjCpf] = useState(currentUser?.cnpjCpf || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profilePostalCode, setProfilePostalCode] = useState(currentUser?.postalCode || '01310-100');
  const [profileStreet, setProfileStreet] = useState(currentUser?.street || 'Av. Paulista');
  const [profileNumber, setProfileNumber] = useState(currentUser?.number || '1000');
  const [profileComplement, setProfileComplement] = useState(currentUser?.complement || '');
  const [profileNeighborhood, setProfileNeighborhood] = useState(currentUser?.neighborhood || 'Bela Vista');
  const [profileCity, setProfileCity] = useState(currentUser?.city || 'São Paulo');
  const [profileState, setProfileState] = useState(currentUser?.state || 'SP');
  const [isLookingUpCep, setIsLookingUpCep] = useState(false);
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);

  const handleProfileCepLookup = async (inputCep: string) => {
    const cleanCep = inputCep.replace(/\D/g, '');
    setProfilePostalCode(inputCep);
    if (cleanCep.length === 8) {
      setIsLookingUpCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro) setProfileStreet(data.logradouro);
          if (data.bairro) setProfileNeighborhood(data.bairro);
          if (data.localidade) setProfileCity(data.localidade);
          if (data.uf) setProfileState(data.uf);
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      } finally {
        setIsLookingUpCep(false);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUserProfile) {
      onUpdateUserProfile({
        name: profileName,
        tradeName: profileTradeName,
        cnpjCpf: profileCnpjCpf,
        phone: profilePhone,
        postalCode: profilePostalCode,
        street: profileStreet,
        number: profileNumber,
        complement: profileComplement,
        neighborhood: profileNeighborhood,
        city: profileCity,
        state: profileState,
      });
    }
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 3000);
  };

  // Wholesale Purchase Area States
  const [buyCategory, setBuyCategory] = useState<string>('Todos');
  const [buySearch, setBuySearch] = useState<string>('');
  // Selections: { [productId]: { P: qty, M: qty, G: qty, GG: qty, XG: qty } }
  const [wholesaleSelections, setWholesaleSelections] = useState<Record<string, Record<string, number>>>({});
  const [isInstantPixOpen, setIsInstantPixOpen] = useState(false);
  const [isPixCopied, setIsPixCopied] = useState(false);

  // Media Center filters
  const [mediaCategory, setMediaCategory] = useState<string>('Todos');
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [selectedProductForStory, setSelectedProductForStory] = useState<Product | null>(null);
  const [resalePriceInput, setResalePriceInput] = useState<number>(149.90);
  const [resellerStoreNameInput, setResellerStoreNameInput] = useState<string>(
    currentUser?.tradeName || 'Sua Loja Esportiva'
  );

  // Quick Universal tracking input inside the portal
  const [quickTrackingCode, setQuickTrackingCode] = useState<string>('JAD9847291823');
  const [quickCarrier, setQuickCarrier] = useState<string>('jadlog');

  // --- Wholesale Calculation Helpers ---
  const handleUpdateSizeQty = (productId: string, size: string, delta: number) => {
    setWholesaleSelections((prev) => {
      const prodSelections = { ...(prev[productId] || { P: 0, M: 0, G: 0, GG: 0, XG: 0 }) };
      const currentQty = prodSelections[size] || 0;
      const nextQty = Math.max(0, currentQty + delta);
      prodSelections[size] = nextQty;

      return {
        ...prev,
        [productId]: prodSelections,
      };
    });
  };

  const handleApplyPresetGrade = (productId: string, totalPcs: 10 | 30) => {
    setWholesaleSelections((prev) => {
      if (totalPcs === 10) {
        return {
          ...prev,
          [productId]: { P: 2, M: 3, G: 3, GG: 2, XG: 0 },
        };
      } else {
        return {
          ...prev,
          [productId]: { P: 6, M: 10, G: 10, GG: 4, XG: 0 },
        };
      }
    });
  };

  const handleClearSelections = () => {
    setWholesaleSelections({});
  };

  // Calculate total selected pieces
  let totalWholesaleQuantity = 0;
  const wholesaleSelectedItems: { product: Product; size: string; quantity: number }[] = [];

  Object.entries(wholesaleSelections).forEach(([prodId, sizes]) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    Object.entries(sizes).forEach(([size, qty]) => {
      if (qty > 0) {
        totalWholesaleQuantity += qty;
        wholesaleSelectedItems.push({
          product: prod,
          size,
          quantity: qty,
        });
      }
    });
  });

  // Wholesale pricing tier
  let wholesaleUnitPrice = 60.0;
  if (totalWholesaleQuantity >= 30) {
    wholesaleUnitPrice = 45.0;
  } else if (totalWholesaleQuantity >= 10) {
    wholesaleUnitPrice = 50.0;
  }

  const wholesaleSubtotal = totalWholesaleQuantity * wholesaleUnitPrice;
  const wholesaleShipping = totalWholesaleQuantity >= 30 || totalWholesaleQuantity === 0 ? 0 : 35.0;
  const wholesaleTotal = wholesaleSubtotal + wholesaleShipping;
  const estimatedRetailGain = totalWholesaleQuantity * 149.90 - wholesaleTotal;

  // Convert to CartItems
  const getWholesaleCartItems = (): CartItem[] => {
    return wholesaleSelectedItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      category: item.product.category,
      size: item.size as Size,
      quantity: item.quantity,
      unitPrice: wholesaleUnitPrice,
    }));
  };

  const handleCheckoutWithMercadoPago = () => {
    if (totalWholesaleQuantity === 0) return;
    const cartItems = getWholesaleCartItems();
    if (onBuyBatch) {
      onBuyBatch(cartItems, true);
    } else if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const handleAddToCartOnly = () => {
    if (totalWholesaleQuantity === 0) return;
    const cartItems = getWholesaleCartItems();
    if (onBuyBatch) {
      onBuyBatch(cartItems, false);
    }
  };

  // Filtered products for wholesale buy tab
  const categoriesList = ['Todos', 'Times Brasileiros', 'Clubes Europeus', 'Seleções', 'Linha Retrô', 'Corta-Vento & Jaquetas'];
  
  const filteredBuyProducts = products.filter((p) => {
    const matchesCat = buyCategory === 'Todos' || p.category === buyCategory;
    const matchesSearch = 
      buySearch.trim() === '' ||
      p.name.toLowerCase().includes(buySearch.toLowerCase()) ||
      p.club.toLowerCase().includes(buySearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const handleCopyImgLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedImageLink(link);
    setTimeout(() => setCopiedImageLink(null), 2000);
  };

  const handleReorderClick = (order: Order) => {
    const newCartItems: CartItem[] = order.items.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      productImage: it.productImage,
      category: 'Times Brasileiros',
      size: it.size,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
    }));

    onReorder(newCartItems);
  };

  // Filtered media products
  const filteredMediaProducts = products.filter((p) => {
    const matchesCat = mediaCategory === 'Todos' || p.category === mediaCategory;
    const matchesSearch = 
      mediaSearch.trim() === '' ||
      p.name.toLowerCase().includes(mediaSearch.toLowerCase()) ||
      p.club.toLowerCase().includes(mediaSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleGenerateCopyText = (product: Product) => {
    const text = 
      `🔥 *LANÇAMENTO EXCLUSIVO: ${product.name.toUpperCase()}*\n\n` +
      `⚽ *Padrão Tailandês 1:1 Oficial*\n` +
      `✔️ Tecido Tecnológico DryFit Respirável\n` +
      `✔️ Escudo e Patrocínios Bordados em Alta Definição\n` +
      `✔️ Tags Oficiais e Selo de Autenticidade\n\n` +
      `📏 *Tamanhos Disponíveis:* P, M, G, GG e XG\n` +
      `💰 *Preço Promocional:* De R$ 249,90 por *R$ ${resalePriceInput.toFixed(2).replace('.', ',')}*\n` +
      `💳 Aceitamos Pix e Cartão de Crédito em até 12x\n` +
      `🚚 Enviamos para todo o Brasil com código de rastreamento!\n\n` +
      `📲 *Chame agora no WhatsApp para garantir a sua:* ${currentUser?.phone || '+55 (61) 9167-7676'}`;

    navigator.clipboard.writeText(text);
    setCopiedCopyText(product.id);
    setTimeout(() => setCopiedCopyText(null), 2500);
  };

  const handleDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.toLowerCase().replace(/\s+/g, '-')}-neutra.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pixKeyMercadoPago = `00020126580014br.gov.bcb.pix0136mcstore-b2b@mercadopago.com5204000053039865405${wholesaleTotal.toFixed(2)}5802BR5925MC STORE DISTRIBUICAO LT6009BRASILIA62070503***6304`;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 animate-fadeIn">
      {/* Reseller Header Top Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <BrandLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300">
                  PORTAL DO REVENDEDOR MC STORE
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ⭐ Nível {currentUser?.loyaltyTier || 'Ouro'}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Olá, {currentUser?.name || 'Revendedor Lojista'} ({currentUser?.tradeName || 'Sua Loja'})
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenCalculator}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              Simular Lucro
            </button>
            <a
              href="https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Sou%20revendedor%20e%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20pedidos%20no%20atacado."
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp B2B
            </a>
          </div>
        </div>

        {/* Reseller Sub-navigation Tabs (Compact & Responsive) */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-reseller-buy"
            onClick={() => setActiveTab('buy')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'buy'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs ring-1 ring-emerald-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
            <span>Pedido Rápido</span>
            <span className="bg-slate-950 text-emerald-400 text-[9px] px-1 py-0.2 rounded font-mono font-bold">
              NOVO
            </span>
          </button>

          <button
            id="tab-reseller-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Meus Pedidos ({orders.length})</span>
          </button>

          <button
            id="tab-reseller-media"
            onClick={() => setActiveTab('media')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fotos & Mídias HD</span>
          </button>

          <button
            id="tab-reseller-tracking"
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rastrear Cargas</span>
          </button>

          <button
            id="tab-reseller-benefits"
            onClick={() => setActiveTab('benefits')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'benefits'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tabela & Descontos</span>
          </button>

          <button
            id="tab-reseller-profile"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dados da Loja & Endereço</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ======================================================== */}
        {/* TAB 0: ÁREA DE COMPRA DOS REVENDEDORES COM MERCADO PAGO */}
        {/* ======================================================== */}
        {activeTab === 'buy' && (
          <div className="space-y-8">
            {/* Header Wholesale Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-slate-950" /> Área de Compra Rápida no Atacado
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Integrado com Mercado Pago
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Monte seu Lote de Mantos 1:1 Direto da Distribuidora
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Escolha a quantidade por tamanho (P, M, G, GG, XG) nos modelos abaixo. O desconto por volume é aplicado automaticamente e você finaliza no Mercado Pago com Pix instantâneo, Cartão em até 12x ou Boleto!
                  </p>
                </div>

                {/* Mercado Pago Payment Methods Showcase Badge */}
                <div className="bg-slate-950/80 border border-slate-700 rounded-2xl p-4.5 space-y-3 min-w-[280px]">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Pagamentos Mercado Pago:</span>
                    <span className="text-emerald-400 font-black">100% Seguro</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center gap-1 text-emerald-300">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>Pix com Liberação Instantânea</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center gap-1 text-blue-300">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span>Cartão até 12x</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl flex flex-col items-center gap-1 text-amber-300">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Boleto Bancário</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Price Tiers Progress Bar */}
              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  totalWholesaleQuantity >= 1 && totalWholesaleQuantity < 10
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Faixa Amostras (1 a 9 un)</span>
                    <span className="text-white font-black">R$ 60,00/un</span>
                  </div>
                  <div className="text-[11px] mt-1">Frete Fixo R$ 35,00</div>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  totalWholesaleQuantity >= 10 && totalWholesaleQuantity < 30
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Atacado Lojista (10 a 29 un)</span>
                    <span className="text-emerald-400 font-black">R$ 50,00/un</span>
                  </div>
                  <div className="text-[11px] mt-1 text-emerald-300">Economia de R$ 10 por peça</div>
                </div>

                <div className={`p-3.5 rounded-2xl border transition-all ${
                  totalWholesaleQuantity >= 30
                    ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300 font-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Atacado Ouro (30+ un)
                    </span>
                    <span className="text-emerald-400 font-black text-sm">R$ 45,00/un</span>
                  </div>
                  <div className="text-[11px] mt-1 font-bold text-emerald-300 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> FRETE GRÁTIS INCLUSO!
                  </div>
                </div>
              </div>
            </div>

            {/* Layout: Main Products Grid + Sticky Order Batch Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Filter and Products (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Search & Categories */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={buySearch}
                        onChange={(e) => setBuySearch(e.target.value)}
                        placeholder="Buscar por clube, seleção ou edição..."
                        className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                    {buySearch && (
                      <button
                        onClick={() => setBuySearch('')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Limpar Busca
                      </button>
                    )}
                  </div>

                  {/* Category Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBuyCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          buyCategory === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Cards with Size Matrix Steppers */}
                <div className="space-y-4">
                  {filteredBuyProducts.map((prod) => {
                    const prodSelections = wholesaleSelections[prod.id] || { P: 0, M: 0, G: 0, GG: 0, XG: 0 };
                    const prodTotalQty = (prodSelections.P || 0) + (prodSelections.M || 0) + (prodSelections.G || 0) + (prodSelections.GG || 0) + (prodSelections.XG || 0);

                    return (
                      <div
                        key={prod.id}
                        className={`bg-white border rounded-3xl p-5 shadow-xs transition-all ${
                          prodTotalQty > 0 ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Image */}
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                          />

                          {/* Product Info & Size Steppers */}
                          <div className="flex-1 min-w-0 space-y-3 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  {prod.category} • Padrão Tailandês 1:1
                                </span>
                                <h3 className="font-black text-slate-900 text-sm sm:text-base mt-1">
                                  {prod.name}
                                </h3>
                                <div className="text-xs text-slate-500">{prod.club} • Versão Torcedor Oficial</div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <div className="text-[11px] text-slate-400">Preço no Atacado:</div>
                                <div className="text-base sm:text-lg font-black text-emerald-700">
                                  R$ {wholesaleUnitPrice.toFixed(2).replace('.', ',')} <span className="text-[11px] font-normal text-slate-400">/un</span>
                                </div>
                              </div>
                            </div>

                            {/* Size Matrix Steppers */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                              <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                                <span>Selecione a quantidade por tamanho:</span>
                                {prodTotalQty > 0 && (
                                  <span className="text-emerald-700 font-black">
                                    {prodTotalQty} peças selecionadas deste modelo
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-5 gap-2">
                                {['P', 'M', 'G', 'GG', 'XG'].map((sizeKey) => {
                                  const count = prodSelections[sizeKey] || 0;
                                  return (
                                    <div
                                      key={sizeKey}
                                      className={`p-2 rounded-xl border text-center transition-all ${
                                        count > 0 ? 'bg-white border-emerald-500 shadow-xs' : 'bg-white/60 border-slate-200'
                                      }`}
                                    >
                                      <div className="text-xs font-black text-slate-900">{sizeKey}</div>
                                      <div className="flex items-center justify-center gap-1.5 mt-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateSizeQty(prod.id, sizeKey, -1)}
                                          disabled={count === 0}
                                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                            count === 0 ? 'text-slate-300 bg-slate-100 cursor-not-allowed' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                                          }`}
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className={`w-5 text-center text-xs font-black font-mono ${count > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                                          {count}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateSizeQty(prod.id, sizeKey, 1)}
                                          className="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center font-bold transition-colors cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Quick Presets for this product */}
                              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200/80 flex-wrap">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Preenchimento rápido:</span>
                                <button
                                  type="button"
                                  onClick={() => handleApplyPresetGrade(prod.id, 10)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                >
                                  + Grade 10 peças (2P, 3M, 3G, 2GG)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApplyPresetGrade(prod.id, 30)}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                                >
                                  + Grade 30 peças (Frete Grátis)
                                </button>
                                {prodTotalQty > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setWholesaleSelections((prev) => ({
                                        ...prev,
                                        [prod.id]: { P: 0, M: 0, G: 0, GG: 0, XG: 0 },
                                      }));
                                    }}
                                    className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 font-bold text-[10px] rounded-lg transition-colors cursor-pointer ml-auto"
                                  >
                                    Zerar
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Sticky Wholesale Order Summary & Mercado Pago Integration (4 cols) */}
              <div className="lg:col-span-4 sticky top-6 space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-sm">Resumo do Lote Atacado</h3>
                        <p className="text-[11px] text-slate-400">Tabela de Revenda Automática</p>
                      </div>
                    </div>

                    {totalWholesaleQuantity > 0 && (
                      <button
                        onClick={handleClearSelections}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Limpar
                      </button>
                    )}
                  </div>

                  {/* Quantity & Tier Overview */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Total de Peças Selecionadas:</span>
                      <span className="font-black text-slate-900 text-sm font-mono">{totalWholesaleQuantity} un</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Preço Unitário Aplicado:</span>
                      <span className="font-black text-emerald-700 text-sm">
                        R$ {wholesaleUnitPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Progress to Next Tier */}
                    {totalWholesaleQuantity < 30 && (
                      <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>Faltam para Frete Grátis & R$ 45/un:</span>
                          <span className="text-emerald-700 font-black">{Math.max(0, 30 - totalWholesaleQuantity)} peças</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (totalWholesaleQuantity / 30) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Items Mini List */}
                  {wholesaleSelectedItems.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
                      {wholesaleSelectedItems.map((item, idx) => (
                        <div key={`${item.product.id}-${item.size}-${idx}`} className="pt-2 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1 truncate">
                            <span className="font-bold text-slate-900">{item.product.name}</span>
                            <span className="text-slate-400 text-[11px] ml-1">({item.size})</span>
                          </div>
                          <div className="font-mono font-bold text-slate-700 flex-shrink-0">
                            {item.quantity}x • R$ {(item.quantity * wholesaleUnitPrice).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                      Nenhuma camisa selecionada. Escolha as quantidades nos modelos ao lado.
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal das Camisas:</span>
                      <span className="font-bold text-slate-900 font-mono">R$ {wholesaleSubtotal.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Frete Expresso:</span>
                      {wholesaleShipping === 0 ? (
                        <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          GRÁTIS (30+ un)
                        </span>
                      ) : (
                        <span className="font-bold text-slate-900 font-mono">R$ {wholesaleShipping.toFixed(2).replace('.', ',')}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base font-black">
                      <span className="text-slate-900">Valor Total do Pedido:</span>
                      <span className="text-emerald-700 text-xl font-mono">
                        R$ {wholesaleTotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {totalWholesaleQuantity > 0 && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
                        💰 <strong>Lucro Líquido Estimado na Revenda:</strong> ~R$ {estimatedRetailGain.toFixed(2).replace('.', ',')} (vendendo a R$ 149,90/un)
                      </div>
                    )}
                  </div>

                  {/* Mercado Pago Checkout Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      disabled={totalWholesaleQuantity === 0}
                      onClick={handleCheckoutWithMercadoPago}
                      className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                        totalWholesaleQuantity > 0
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25 hover:scale-[1.02]'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Finalizar Pedido no Mercado Pago</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={totalWholesaleQuantity === 0}
                      onClick={() => setIsInstantPixOpen(true)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        totalWholesaleQuantity > 0
                          ? 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-slate-800'
                          : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>Gerar Pix Mercado Pago Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      disabled={totalWholesaleQuantity === 0}
                      onClick={handleAddToCartOnly}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Adicionar ao Carrinho Principal
                    </button>
                  </div>

                  {/* Security & Guarantees */}
                  <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                    <div className="flex items-center justify-center gap-1 text-slate-500 font-bold">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Processamento 100% Criptografado Mercado Pago</span>
                    </div>
                    <div>Garantia 1:1 de Troca Imediata • Despacho Rápido</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal de Pix Instantâneo Mercado Pago */}
            {isInstantPixOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">Pix Mercado Pago B2B</h4>
                        <p className="text-[11px] text-slate-400">Aprovação em segundos</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsInstantPixOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Pix Details */}
                  <div className="text-center space-y-3">
                    <div className="text-xs text-slate-600">
                      Total a pagar para <strong className="text-slate-900">{totalWholesaleQuantity} camisas</strong>:
                    </div>
                    <div className="text-3xl font-black text-emerald-700 font-mono">
                      R$ {wholesaleTotal.toFixed(2).replace('.', ',')}
                    </div>

                    {/* Mock QR Code Visual */}
                    <div className="w-48 h-48 mx-auto bg-slate-900 p-3 rounded-2xl border-2 border-emerald-500 shadow-md flex items-center justify-center">
                      <div className="w-full h-full bg-white p-2 rounded-xl flex flex-col items-center justify-center text-center">
                        <QrCode className="w-28 h-28 text-slate-950" />
                        <span className="text-[9px] font-bold text-slate-500">QR Code Oficial Mercado Pago</span>
                      </div>
                    </div>

                    {/* Copia e Cola */}
                    <div className="space-y-1 text-left">
                      <label className="text-[11px] font-bold text-slate-700">Chave Pix Copia e Cola:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={pixKeyMercadoPago}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-600 select-all"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(pixKeyMercadoPago);
                            setIsPixCopied(true);
                            setTimeout(() => setIsPixCopied(false), 2500);
                          }}
                          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                        >
                          {isPixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isPixCopied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Após o pagamento:</span>
                    </div>
                    <p className="leading-relaxed">
                      Seu pedido entrará imediatamente em separação prioritária no depósito e você receberá o rastreamento via WhatsApp e aqui no portal.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Acabei%20de%20gerar%20um%20pedido%20de%20atacado%20no%20valor%20de%20R$%20${wholesaleTotal.toFixed(2)}%20(${totalWholesaleQuantity}%20pe%C3%A7as)%20e%20gostaria%20de%20confirmar%20o%20comprovante.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Enviar Comprovante no WhatsApp
                    </a>
                    <button
                      onClick={() => setIsInstantPixOpen(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: MEUS PEDIDOS & RASTREIO DETALHADO */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Loyalty & Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Seu Nível de Lojista:</span>
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                    Nível Ouro (Desconto Máximo)
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  R$ 45,00 <span className="text-xs font-normal text-slate-400">/unidade (30+ peças)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Despacho prioritário em até 12 horas, fotos em primeira mão e frete grátis em pedidos de grande volume.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <PackageCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase text-slate-500">Histórico de Compras:</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {orders.reduce((acc, o) => acc + o.totalQuantity, 0)} <span className="text-sm font-bold text-slate-400">camisas adquiridas</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Total de {orders.length} pedidos B2B faturados com garantia de qualidade 1:1 e troca imediata.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase text-slate-500">Avisos de Estoque:</span>
                </div>
                <div className="text-lg font-black text-slate-900">
                  Grupo VIP de Reposições
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receba avisos instantâneos quando chegarem novos lotes de clubes europeus e nacionais.
                </p>
                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Entrar no Grupo de Reposições
                </a>
              </div>
            </div>

            {/* List of Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  Meus Pedidos de Atacado & Códigos de Rastreio
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {orders.length} pedidos registrados
                </span>
              </div>

              <div className="space-y-5">
                {orders.map((order) => {
                  const carrierKey = order.trackingCarrier 
                    ? (Object.keys(CARRIERS_DATABASE).find(k => order.trackingCarrier?.toLowerCase().includes(k)) || 'jadlog')
                    : 'jadlog';
                  const carrier = CARRIERS_DATABASE[carrierKey] || CARRIERS_DATABASE.jadlog;

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-emerald-500/50 transition-all space-y-4"
                    >
                      {/* Order Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black flex items-center justify-center text-sm">
                            B2B
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                              <span>Pedido #{order.orderNumber}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'DELIVERED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {order.status === 'PAID' && 'Pago • Em Separação'}
                                {order.status === 'SHIPPED' && 'Enviado • Em Trânsito'}
                                {order.status === 'DELIVERED' && 'Entregue com Sucesso'}
                                {order.status === 'PENDING' && 'Aguardando Pagamento'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} • {order.totalQuantity} peças no lote
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <div className="text-xs text-slate-400">Valor Total:</div>
                            <div className="text-lg font-black text-emerald-700">
                              R$ {order.total.toFixed(2).replace('.', ',')}
                            </div>
                          </div>

                          <button
                            onClick={() => handleReorderClick(order)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Recomprar Grade</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 truncate">{item.productName}</div>
                              <div className="text-[11px] text-slate-500">
                                Tam: <strong>{item.size}</strong> • {item.quantity} un (R$ {item.unitPrice.toFixed(2)}/un)
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Multicarrier Tracking Section */}
                      {order.trackingCode ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${carrier.badgeColor}`}>
                              {carrier.logoText}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                <span>Transportadora: {carrier.name}</span>
                              </div>
                              <div className="font-mono text-sm font-black text-slate-900 mt-0.5 flex items-center gap-2">
                                <span>{order.trackingCode}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleCopy(order.trackingCode!)}
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedTracking === order.trackingCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedTracking === order.trackingCode ? 'Copiado!' : 'Copiar Código'}</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onOpenTrackingModal) {
                                  onOpenTrackingModal(order.trackingCode);
                                }
                              }}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Timeline Completa</span>
                            </button>

                            <a
                              href={carrier.trackingUrl(order.trackingCode!)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>Site Oficial</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>Pedido em separação no depósito. O código de rastreio será disponibilizado em breve.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CENTRAL DE FOTOS & MÍDIA PARA DIVULGAÇÃO */}
        {/* ======================================================== */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Banner Guide */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-black uppercase">
                <ImageIcon className="w-3.5 h-3.5" /> MATERIAL DE MARKETING WHITE-LABEL
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Fotos em Alta Resolução Sem Logomarca da MC Store
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Baixe fotos profissionais dos 150+ modelos para postar no Instagram Stories, Feed, catálogo do WhatsApp Business e TikTok. Use nosso gerador automático de legendas para vender mais rápido!
              </p>

              {/* Instagram & WhatsApp Links */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com/mcstorefutebol12/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-bold transition-transform hover:scale-105"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Siga @mcstorefutebol12 no Instagram</span>
                </a>
                <a
                  href="https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Sou%20revendedor%20e%20gostaria%20de%20solicitar%20fotos%20especiais%20de%20lan%C3%A7amentos."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-transform hover:scale-105"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Suporte Revendedor: +55 (61) 9167-7676</span>
                </a>
              </div>

              {/* Quick Settings for Story/Copy Generator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nome da sua Loja para os Criativos:
                  </label>
                  <input
                    type="text"
                    value={resellerStoreNameInput}
                    onChange={(e) => setResellerStoreNameInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: FutStyle Store"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Seu Preço Sugerido de Venda no Varejo (R$):
                  </label>
                  <input
                    type="number"
                    value={resalePriceInput}
                    onChange={(e) => setResalePriceInput(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    placeholder="149.90"
                  />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  placeholder="Buscar fotos por time (ex: Flamengo, Real Madrid, Brasil)..."
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {['Todos', 'Times Brasileiros', 'Times Europeus', 'Seleções', 'Retrô', 'Corta-Ventos'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMediaCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      mediaCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMediaProducts.map((product) => {
                const isCopyCopied = copiedCopyText === product.id;
                const isLinkCopied = copiedImageLink === product.images[0];

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-slate-200 hover:border-emerald-500/60 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Image Preview with Zoom */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {product.club}
                        </div>
                        <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                          HD 1080p
                        </div>
                      </div>

                      {/* Product Title */}
                      <div>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {product.category} • Grade P ao XG
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-3 mt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleDownloadImage(product.images[0], product.name)}
                          className="px-2.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Baixar Foto em Alta Resolução"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Baixar HD</span>
                        </button>

                        <button
                          onClick={() => handleCopyImgLink(product.images[0])}
                          className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Copiar Link da Imagem"
                        >
                          {isLinkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isLinkCopied ? 'Copiado!' : 'Link'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleGenerateCopyText(product)}
                        className={`w-full px-3 py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCopyCopied
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {isCopyCopied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{isCopyCopied ? 'Legenda Copiada!' : 'Copiar Legenda WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CONSULTAR RASTREIO UNIVERSAL */}
        {/* ======================================================== */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
                  <Truck className="w-3.5 h-3.5 text-blue-600" /> RASTREADOR MULTICARRIER UNIVERSAL
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Consultar Rastreio de Qualquer Transportadora
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Digite seu código de rastreio para abrir a consulta direta na transportadora responsável pelo despacho do seu lote.
                </p>
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código de Rastreamento:</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={quickTrackingCode}
                      onChange={(e) => setQuickTrackingCode(e.target.value)}
                      placeholder="Ex: JAD9847291823 ou NL123456789BR"
                      className="w-full pl-10 pr-3 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transportadora:</label>
                  <select
                    value={quickCarrier}
                    onChange={(e) => setQuickCarrier(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
                  >
                    {Object.values(CARRIERS_DATABASE).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => {
                      if (onOpenTrackingModal) {
                        onOpenTrackingModal(quickTrackingCode);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>Rastrear</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Supported Carriers Grid */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Transportadoras Parceiras com Despacho Diário:
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {Object.values(CARRIERS_DATABASE).map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block ${c.badgeColor}`}>
                        {c.logoText}
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 truncate">{c.name}</div>
                      <div className="text-[9px] text-slate-400">Suporte Nacional</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BENEFÍCIOS & TABELA ATACADO */}
        {/* ======================================================== */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Tabela Progressiva de Preços Atacado B2B
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Quanto maior o volume do seu lote de pedidos, maior sua margem de lucro líquido na revenda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">Amostras & Testes</div>
                  <div className="text-3xl font-black text-slate-900">R$ 60,00<span className="text-xs font-normal text-slate-400">/un</span></div>
                  <div className="text-xs font-bold text-slate-700">De 1 a 9 peças</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ideal para testar o padrão do tecido tailandês e conferir a costura antes de pedir o lote principal.
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Atacado Lojista Padrão</div>
                  <div className="text-3xl font-black text-emerald-800">R$ 50,00<span className="text-xs font-normal text-emerald-700">/un</span></div>
                  <div className="text-xs font-bold text-emerald-900">De 10 a 29 peças</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mais de 150% de lucro vendendo a R$ 140,00 cada manto no seu Instagram ou loja física.
                  </p>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-emerald-400 uppercase">Atacado Máximo + Frete Grátis</div>
                  <div className="text-3xl font-black text-white">R$ 45,00<span className="text-xs font-normal text-slate-400">/un</span></div>
                  <div className="text-xs font-bold text-emerald-300">A partir de 30 peças</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Preço de importação direta, frete gratuito via transportadora e despacho expresso prioritário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: MEUS DADOS, LOJA & ENDEREÇO COMPLETO */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                      Cadastro Lojista & Faturamento
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⭐ Nível {currentUser?.loyaltyTier || 'Ouro'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                    Dados da Minha Loja & Endereço de Entrega
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mantenha seu endereço atualizado para cálculo automático de frete e geração de etiquetas de envio rápido.
                  </p>
                </div>

                {profileSavedFeedback && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Dados de endereço salvos com sucesso!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Store Identifiers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nome da Loja / Razão Social:</label>
                    <input
                      type="text"
                      required
                      value={profileTradeName}
                      onChange={(e) => setProfileTradeName(e.target.value)}
                      placeholder="Ex: FutSport Brasil"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Responsável / Lojista:</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Nome completo do responsável"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">CNPJ ou CPF:</label>
                    <input
                      type="text"
                      required
                      value={profileCnpjCpf}
                      onChange={(e) => setProfileCnpjCpf(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">WhatsApp / Telefone Principal:</label>
                    <input
                      type="text"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">E-mail Cadastrado:</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ''}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Categoria de Revenda:</label>
                    <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Lojista Ativo ({currentUser?.loyaltyTier || 'Ouro'})
                    </div>
                  </div>
                </div>

                {/* Shipping & Delivery Address */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Endereço Completo de Entrega da Loja:
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">Preenchimento automático via CEP</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>CEP da Loja:</span>
                        {isLookingUpCep && <span className="text-[10px] text-emerald-600 animate-pulse font-mono">Buscando CEP...</span>}
                      </label>
                      <input
                        type="text"
                        required
                        value={profilePostalCode}
                        onChange={(e) => handleProfileCepLookup(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Rua / Logradouro:</label>
                      <input
                        type="text"
                        required
                        value={profileStreet}
                        onChange={(e) => setProfileStreet(e.target.value)}
                        placeholder="Ex: Av. Paulista, Rua das Flores"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Número:</label>
                      <input
                        type="text"
                        required
                        value={profileNumber}
                        onChange={(e) => setProfileNumber(e.target.value)}
                        placeholder="Ex: 1500"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Complemento (Opcional):</label>
                      <input
                        type="text"
                        value={profileComplement}
                        onChange={(e) => setProfileComplement(e.target.value)}
                        placeholder="Ex: Loja 04, Galpão B, Sala 102"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Bairro:</label>
                      <input
                        type="text"
                        required
                        value={profileNeighborhood}
                        onChange={(e) => setProfileNeighborhood(e.target.value)}
                        placeholder="Ex: Centro"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Cidade / Estado (UF):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={profileCity}
                          onChange={(e) => setProfileCity(e.target.value)}
                          placeholder="Cidade"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                        />
                        <select
                          value={profileState}
                          onChange={(e) => setProfileState(e.target.value)}
                          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="SP">SP</option>
                          <option value="RJ">RJ</option>
                          <option value="MG">MG</option>
                          <option value="PR">PR</option>
                          <option value="RS">RS</option>
                          <option value="SC">SC</option>
                          <option value="BA">BA</option>
                          <option value="PE">PE</option>
                          <option value="GO">GO</option>
                          <option value="DF">DF</option>
                          <option value="CE">CE</option>
                          <option value="ES">ES</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="PA">PA</option>
                          <option value="AM">AM</option>
                          <option value="RN">RN</option>
                          <option value="PB">PB</option>
                          <option value="AL">AL</option>
                          <option value="SE">SE</option>
                          <option value="MA">MA</option>
                          <option value="PI">PI</option>
                          <option value="TO">TO</option>
                          <option value="RO">RO</option>
                          <option value="AC">AC</option>
                          <option value="AP">AP</option>
                          <option value="RR">RR</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações de Endereço & Loja</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
