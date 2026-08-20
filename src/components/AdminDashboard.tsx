import React, { useState, useMemo } from 'react';
import { Product, Order, OrderStatus, B2BClient, WholesaleTier, Size, Coupon, MercadoPagoConfig } from '../types';
import { CARRIERS_DATABASE } from './OrderTrackingModal';
import { BrandLogo } from './BrandLogo';
import { getMercadoPagoConfig, saveMercadoPagoConfig } from '../services/mercadopago';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Printer, 
  MessageCircle, 
  Sparkles, 
  Check, 
  FileText, 
  Ticket, 
  Save, 
  X,
  Layers,
  Download,
  CreditCard,
  Crown,
  Key,
  HelpCircle,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  clients: B2BClient[];
  coupons: Coupon[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingCode?: string, carrier?: string) => void;
  onUpdateProductStock: (productId: string, size: string, newStock: number) => void;
  onBackToStore: () => void;
  onAddNewProduct?: (newProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateProduct?: (product: Product) => void;
  onAddClient?: (client: B2BClient) => void;
  onUpdateClient?: (client: B2BClient) => void;
  onDeleteClient?: (clientId: string) => void;
  onAddCoupon?: (coupon: Coupon) => void;
  onToggleCoupon?: (couponId: string) => void;
  onDeleteCoupon?: (couponId: string) => void;
}

const AVAILABLE_SIZES: Size[] = ['P', 'M', 'G', 'GG', 'XG', '2XG', '3XG', 'Juvenil'];

export function AdminDashboard({
  orders,
  products,
  clients,
  coupons,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onBackToStore,
  onAddNewProduct,
  onDeleteProduct,
  onUpdateProduct,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'sales' | 'orders' | 'inventory' | 'clients' | 'coupons' | 'mercadopago'>('sales');

  // Sales period & payment filter
  const [salesPaymentMethod, setSalesPaymentMethod] = useState<string>('ALL');

  // Search & Filter States
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');

  // Modals States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<B2BClient | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdClub, setNewProdClub] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<string>('Times Brasileiros');
  const [newProdSeason, setNewProdSeason] = useState('2024/2025');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80');
  const [newProdBadge, setNewProdBadge] = useState('Lançamento 24/25');
  const [newProdPrice, setNewProdPrice] = useState(159.90);
  const [newProdWholesalePrice, setNewProdWholesalePrice] = useState(50.00);
  const [newProdVariants, setNewProdVariants] = useState<{ size: Size; stock: number }[]>([
    { size: 'P', stock: 40 },
    { size: 'M', stock: 80 },
    { size: 'G', stock: 80 },
    { size: 'GG', stock: 40 },
    { size: 'XG', stock: 20 },
  ]);

  // Client Form State
  const [clientName, setClientName] = useState('');
  const [clientTradeName, setClientTradeName] = useState('');
  const [clientCnpj, setClientCnpj] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPostalCode, setClientPostalCode] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [clientComplement, setClientComplement] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientState, setClientState] = useState('SP');
  const [clientTier, setClientTier] = useState<'Prata' | 'Ouro' | 'Diamante'>('Prata');
  const [isClientCepLoading, setIsClientCepLoading] = useState(false);

  const handleAdminClientCepLookup = async (inputCep: string) => {
    const cleanCep = inputCep.replace(/\D/g, '');
    setClientPostalCode(inputCep);
    if (cleanCep.length === 8) {
      setIsClientCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro) setClientStreet(data.logradouro);
          if (data.bairro) setClientNeighborhood(data.bairro);
          if (data.localidade) setClientCity(data.localidade);
          if (data.uf) setClientState(data.uf);
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      } finally {
        setIsClientCepLoading(false);
      }
    }
  };

  // Tracking edit in order
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);
  const [tempTrackingCode, setTempTrackingCode] = useState<string>('');
  const [tempCarrier, setTempCarrier] = useState<string>('jadlog');

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponMinPieces, setNewCouponMinPieces] = useState<number>(10);
  const [couponSuccessMessage, setCouponSuccessMessage] = useState<string>('');

  // Mercado Pago Config State
  const [mpConfig, setMpConfig] = useState<MercadoPagoConfig>(() => getMercadoPagoConfig());
  const [mpSavedFeedback, setMpSavedFeedback] = useState(false);

  // Sales KPI Metrics
  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const totalPiecesSold = useMemo(() => orders.reduce((acc, o) => acc + o.totalQuantity, 0), [orders]);
  const totalOrdersCount = orders.length;
  const avgOrderTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const estimatedCost = totalPiecesSold * 26.5; // ~R$ 26.50 custo de fábrica unitário
  const netEstimatedProfit = totalRevenue - estimatedCost;

  // Filtered Orders for Orders Table
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilterStatus === 'ALL' || o.status === orderFilterStatus;
    const matchesSearch = 
      orderSearchQuery.trim() === '' ||
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(orderSearchQuery)) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
    const matchesSearch = 
      productSearchQuery.trim() === '' ||
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.club.toLowerCase().includes(productSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Clients
  const filteredClients = clients.filter((c) => {
    return (
      clientSearchQuery.trim() === '' ||
      c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.tradeName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.cnpj.includes(clientSearchQuery) ||
      c.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.phone.includes(clientSearchQuery)
    );
  });

  // =========================================================================
  // 1. EXPORT CSV: ENVIOS E REMESSA COMPLETA
  // =========================================================================
  const handleExportOrdersShippingCSV = () => {
    const headers = [
      'ID_Pedido',
      'Numero_Pedido',
      'Data_Criacao',
      'Nome_Destinatario',
      'WhatsApp',
      'Email',
      'CPF_CNPJ',
      'Loja_Empresa',
      'Endereco_Rua',
      'Numero',
      'Bairro',
      'Cidade',
      'UF',
      'CEP',
      'Itens_e_Tamanhos',
      'Qtd_Total_Pecas',
      'Subtotal_Produtos',
      'Valor_Frete',
      'Valor_Total',
      'Forma_Pagamento',
      'Status_Pedido',
      'Codigo_Rastreio',
      'Transportadora'
    ];

    const rows = orders.map((o) => {
      // Clean and separate items into readable summary
      const itemsFormatted = o.items
        .map((it) => `${it.quantity}x ${it.productName.replace(/;/g, ' ')} (${it.size})`)
        .join(' | ');

      return [
        `"${o.id}"`,
        `"${o.orderNumber}"`,
        `"${new Date(o.createdAt).toLocaleDateString('pt-BR')} ${new Date(o.createdAt).toLocaleTimeString('pt-BR')}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
        `"${(o.customerCpfCnpj || '').replace(/"/g, '""')}"`,
        `"${(o.resellerCompany || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.street || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.number || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.neighborhood || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.city || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.state || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.postalCode || '').replace(/"/g, '""')}"`,
        `"${itemsFormatted.replace(/"/g, '""')}"`,
        o.totalQuantity,
        o.subtotal.toFixed(2).replace('.', ','),
        o.shippingCost.toFixed(2).replace('.', ','),
        o.total.toFixed(2).replace('.', ','),
        `"${o.paymentMethod}"`,
        `"${o.status}"`,
        `"${o.trackingCode || 'Sem Rastreio'}"`,
        `"${o.trackingCarrier || 'Jadlog Express'}"`
      ];
    });

    // Delimiter ; and UTF-8 BOM so Excel opens with perfect columns and accents
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `remessa_envios_pedidos_mcstore_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Detailed Line-by-Line CSV (1 line per item for warehouse picking)
  const handleExportDetailedItemsCSV = () => {
    const headers = [
      'Numero_Pedido',
      'Data',
      'Cliente_Nome',
      'WhatsApp',
      'Cidade',
      'UF',
      'Produto_Nome',
      'Tamanho',
      'Quantidade',
      'Valor_Unitario',
      'Subtotal_Item',
      'Status_Pedido'
    ];

    const rows: string[][] = [];
    orders.forEach((o) => {
      o.items.forEach((it) => {
        rows.push([
          `"${o.orderNumber}"`,
          `"${new Date(o.createdAt).toLocaleDateString('pt-BR')}"`,
          `"${(o.customerName || '').replace(/"/g, '""')}"`,
          `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
          `"${(o.shippingAddress?.city || '').replace(/"/g, '""')}"`,
          `"${(o.shippingAddress?.state || '').replace(/"/g, '""')}"`,
          `"${(it.productName || '').replace(/"/g, '""')}"`,
          `"${it.size}"`,
          String(it.quantity),
          it.unitPrice.toFixed(2).replace('.', ','),
          (it.quantity * it.unitPrice).toFixed(2).replace('.', ','),
          `"${o.status}"`
        ]);
      });
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `separacao_itens_pedidos_mcstore_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // =========================================================================
  // 2. PRODUCT MANAGEMENT: CREATE, EDIT, SIZES, STOCK
  // =========================================================================
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdClub.trim()) return;

    const tiers: WholesaleTier[] = [
      { minQuantity: 1, maxQuantity: 9, unitPrice: Number(newProdWholesalePrice) + 10 },
      { minQuantity: 10, maxQuantity: 29, unitPrice: Number(newProdWholesalePrice) },
      { minQuantity: 30, unitPrice: Number(newProdWholesalePrice) - 5 },
    ];

    const variants = newProdVariants.map((v) => ({
      id: `v-${Date.now()}-${v.size.toLowerCase()}`,
      size: v.size,
      stock: Number(v.stock) || 0,
      sku: `${newProdClub.substring(0, 3).toUpperCase()}-${v.size}`,
    }));

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      slug: `camisa-${newProdClub.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      club: newProdClub.trim(),
      category: newProdCategory as any,
      season: newProdSeason,
      basePrice: Number(newProdPrice),
      wholesaleTiers: tiers,
      description: `Manto oficial ${newProdName} padrão tailandês 1:1, confeccionado em poliéster tecnológico respirável com bordados de alta definição e tags oficiais.`,
      fabric: '100% Poliéster DryFit Tailandês 1:1',
      images: [newProdImage.trim()],
      unbrandedImages: [newProdImage.trim()],
      variants,
      featured: true,
      badge: newProdBadge || 'Lançamento 24/25',
      rating: 5.0,
      reviewsCount: 1,
    };

    if (onAddNewProduct) {
      onAddNewProduct(newProd);
    }
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdClub('');
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (onUpdateProduct) {
      onUpdateProduct(editingProduct);
    }
    setEditingProduct(null);
  };

  const handleConfirmDeleteProduct = () => {
    if (!deletingProductId) return;
    if (onDeleteProduct) {
      onDeleteProduct(deletingProductId);
    }
    setDeletingProductId(null);
  };

  // Direct Stock change
  const handleDirectStockChange = (productId: string, size: string, newStockVal: number) => {
    const cleanVal = Math.max(0, newStockVal || 0);
    onUpdateProductStock(productId, size, cleanVal);
  };

  // Step stock change (+1, -1, +5, -5)
  const handleStepStock = (productId: string, size: string, delta: number, currentStock: number) => {
    const updated = Math.max(0, currentStock + delta);
    onUpdateProductStock(productId, size, updated);
  };

  // =========================================================================
  // 3. CLIENT / RESELLER MANAGEMENT
  // =========================================================================
  const handleOpenNewClientModal = () => {
    setEditingClient(null);
    setClientName('');
    setClientTradeName('');
    setClientCnpj('');
    setClientEmail('');
    setClientPhone('');
    setClientPostalCode('');
    setClientStreet('');
    setClientNumber('');
    setClientComplement('');
    setClientNeighborhood('');
    setClientCity('');
    setClientState('SP');
    setClientTier('Prata');
    setIsAddClientOpen(true);
  };

  const handleOpenEditClientModal = (client: B2BClient) => {
    setEditingClient(client);
    setClientName(client.name);
    setClientTradeName(client.tradeName);
    setClientCnpj(client.cnpj);
    setClientEmail(client.email);
    setClientPhone(client.phone);
    setClientPostalCode(client.postalCode || '');
    setClientStreet(client.street || '');
    setClientNumber(client.number || '');
    setClientComplement(client.complement || '');
    setClientNeighborhood(client.neighborhood || '');
    setClientCity(client.city);
    setClientState(client.state);
    setClientTier(client.loyaltyTier);
    setIsAddClientOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientCnpj.trim() || !clientPhone.trim()) return;

    if (editingClient) {
      const updated: B2BClient = {
        ...editingClient,
        name: clientName.trim(),
        tradeName: clientTradeName.trim() || clientName.trim(),
        cnpj: clientCnpj.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        postalCode: clientPostalCode.trim() || undefined,
        street: clientStreet.trim() || undefined,
        number: clientNumber.trim() || undefined,
        complement: clientComplement.trim() || undefined,
        neighborhood: clientNeighborhood.trim() || undefined,
        city: clientCity.trim() || 'São Paulo',
        state: clientState.trim() || 'SP',
        loyaltyTier: clientTier,
      };
      if (onUpdateClient) {
        onUpdateClient(updated);
      }
    } else {
      const newCl: B2BClient = {
        id: `client-${Date.now()}`,
        name: clientName.trim(),
        tradeName: clientTradeName.trim() || clientName.trim(),
        cnpj: clientCnpj.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        postalCode: clientPostalCode.trim() || undefined,
        street: clientStreet.trim() || undefined,
        number: clientNumber.trim() || undefined,
        complement: clientComplement.trim() || undefined,
        neighborhood: clientNeighborhood.trim() || undefined,
        city: clientCity.trim() || 'São Paulo',
        state: clientState.trim() || 'SP',
        ordersCount: 0,
        totalSpent: 0,
        loyaltyTier: clientTier,
        joinedDate: new Date().toLocaleDateString('pt-BR'),
      };
      if (onAddClient) {
        onAddClient(newCl);
      }
    }

    setIsAddClientOpen(false);
    setEditingClient(null);
  };

  const handleConfirmDeleteClient = () => {
    if (!deletingClientId) return;
    if (onDeleteClient) {
      onDeleteClient(deletingClientId);
    }
    setDeletingClientId(null);
  };

  // =========================================================================
  // 4. COUPON MANAGEMENT
  // =========================================================================
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || newCouponValue <= 0) return;

    const formattedCode = newCouponCode.trim().toUpperCase().replace(/\s+/g, '');
    const newC: Coupon = {
      id: `coupon-${Date.now()}`,
      code: formattedCode,
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minPieces: Number(newCouponMinPieces) || 1,
      active: true,
      usageCount: 0,
    };

    if (onAddCoupon) {
      onAddCoupon(newC);
    }

    setNewCouponCode('');
    setCouponSuccessMessage(`Cupom ${formattedCode} criado com sucesso!`);
    setTimeout(() => setCouponSuccessMessage(''), 3000);
  };

  // =========================================================================
  // 5. MERCADO PAGO CONFIG SAVE
  // =========================================================================
  const handleSaveMercadoPago = (e: React.FormEvent) => {
    e.preventDefault();
    saveMercadoPagoConfig(mpConfig);
    setMpSavedFeedback(true);
    setTimeout(() => setMpSavedFeedback(false), 3000);
  };

  // =========================================================================
  // 6. TRACKING & WHATSAPP LOGISTICS
  // =========================================================================
  const handleSaveTracking = (orderId: string) => {
    const carrierName = CARRIERS_DATABASE[tempCarrier]?.name || 'Jadlog Express';
    onUpdateOrderStatus(orderId, 'SHIPPED', tempTrackingCode, carrierName);
    setEditingTrackingOrderId(null);
    setTempTrackingCode('');
  };

  const handleNotifyWhatsApp = (order: Order) => {
    const carrierName = order.trackingCarrier || 'Jadlog Express';
    const trackingUrl = order.trackingCode 
      ? `https://www.linkcorreios.com.br/?id=${order.trackingCode}`
      : '';

    const text = encodeURIComponent(
      `Olá, *${order.customerName}*!\n\n` +
      `📦 Seu pedido de atacado *#${order.orderNumber}* (${order.totalQuantity} camisas 1:1) foi atualizado para: *${order.status}*!\n\n` +
      (order.trackingCode 
        ? `🚚 *Código de Rastreamento:* ${order.trackingCode}\n🏢 *Transportadora:* ${carrierName}\n🔗 *Rastreie aqui:* ${trackingUrl}\n\n` 
        : '') +
      `Agradecemos a parceria com a MC Store Futebol!`
    );
    window.open(`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 animate-fadeIn">
      {/* Top Bar Master Admin (Internal Only) */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Voltar para a Loja"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <BrandLogo size={40} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg text-white">MC Store • Gestão Master</h1>
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> ADMIN PRIVADO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Painel interno de vendas, estoque, pedidos, clientes e integração Mercado Pago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportOrdersShippingCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Exportar dados de clientes, endereços e pedidos para envio"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar Envio (CSV)</span>
            </button>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Camisa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Vendas & Faturamento</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Pedidos ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Estoque & Produtos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Lojistas Cadastrados ({clients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Cupons de Desconto ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mercadopago')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'mercadopago'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Mercado Pago {mpConfig.configured ? '✅' : '⚙️'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ========================================================= */}
        {/* TAB 1: VENDAS & FATURAMENTO */}
        {/* ========================================================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
                  <span>Faturamento Bruto</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  R$ {totalRevenue.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold">
                  {totalOrdersCount} pedidos fechados
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
                  <span>Camisas Faturadas</span>
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{totalPiecesSold} un</div>
                <div className="text-[11px] text-slate-500">Mantos 1:1 despachados</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
                  <span>Ticket Médio B2B</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  R$ {avgOrderTicket.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[11px] text-slate-500">Média por lote atacadista</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
                  <span>Margem Bruta Estimada</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  R$ {netEstimatedProfit.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold">Lucro operacional</div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-slate-900">Exportação de Relatórios de Expedição</h3>
                <p className="text-xs text-slate-500">
                  Baixe a planilha formatada em CSV com todos os dados dos clientes, telefones, endereços e itens separados por linha.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportOrdersShippingCSV}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Planilha de Envios (Endereços e Pedidos)</span>
                </button>

                <button
                  onClick={handleExportDetailedItemsCSV}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Picking por Item</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: GESTÃO DE PEDIDOS */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Buscar por nº do pedido, cliente, telefone ou rastreio..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago (Aguardando Envio)</option>
                  <option value="PREPARING">Em Separação</option>
                  <option value="SHIPPED">Enviado (Com Rastreio)</option>
                  <option value="DELIVERED">Entregue</option>
                </select>

                <button
                  onClick={handleExportOrdersShippingCSV}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">Pedido #{order.orderNumber}</span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          order.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'PREPARING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Criado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="PAID">Pago</option>
                        <option value="PREPARING">Em Separação</option>
                        <option value="SHIPPED">Enviado</option>
                        <option value="DELIVERED">Entregue</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Imprimir Romaneio de Envio"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleNotifyWhatsApp(order)}
                        className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-colors cursor-pointer"
                        title="Enviar Notificação WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Customer & Address Details */}
                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Dados do Lojista & Entrega</div>
                      <div className="font-bold text-slate-900">{order.customerName} {order.resellerCompany && `(${order.resellerCompany})`}</div>
                      <div className="text-slate-600">WhatsApp: <strong className="text-slate-900">{order.customerPhone}</strong></div>
                      <div className="text-slate-600">CPF/CNPJ: {order.customerCpfCnpj || 'Não informado'}</div>
                      <div className="text-slate-500 pt-1 text-[11px] leading-relaxed">
                        📍 {order.shippingAddress?.street}, {order.shippingAddress?.number} - {order.shippingAddress?.neighborhood}, {order.shippingAddress?.city}/{order.shippingAddress?.state} • CEP: {order.shippingAddress?.postalCode}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Itens do Pedido ({order.totalQuantity} peças)</div>
                      <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded-lg">
                            <span className="truncate pr-2">{it.quantity}x {it.productName}</span>
                            <span className="font-black bg-white px-1.5 py-0.5 rounded border border-slate-200">{it.size}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-emerald-700 font-black text-sm pt-1">
                        Total: R$ {order.total.toFixed(2).replace('.', ',')} • Pagamento: {order.paymentMethod}
                      </div>
                    </div>

                    {/* Tracking Code */}
                    <div className="space-y-2">
                      <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Rastreamento Logístico</div>
                      {editingTrackingOrderId === order.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={tempTrackingCode}
                            onChange={(e) => setTempTrackingCode(e.target.value)}
                            placeholder="Código de Rastreio (ex: JAD9847291823)"
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                          />
                          <div className="flex gap-1.5">
                            <select
                              value={tempCarrier}
                              onChange={(e) => setTempCarrier(e.target.value)}
                              className="px-2 py-1 text-[11px] bg-slate-50 border border-slate-300 rounded-lg font-bold"
                            >
                              <option value="jadlog">Jadlog</option>
                              <option value="correios">Correios</option>
                              <option value="loggi">Loggi</option>
                              <option value="azulcargo">Azul Cargo</option>
                              <option value="totalexpress">Total Express</option>
                              <option value="braspress">Braspress</option>
                            </select>
                            <button
                              onClick={() => handleSaveTracking(order.id)}
                              className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingTrackingOrderId(null)}
                              className="px-2 py-1 text-slate-500 text-xs cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <div className="font-mono font-bold text-slate-900 text-xs">
                              {order.trackingCode || 'Sem rastreio'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {order.trackingCarrier || 'Aguardando Despacho'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setEditingTrackingOrderId(order.id);
                              setTempTrackingCode(order.trackingCode || '');
                            }}
                            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            {order.trackingCode ? 'Editar' : '+ Inserir Rastreio'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ESTOQUE & PRODUTOS (Edição de estoque 1 em 1, 5 em 5 ou digitado) */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header / Filter */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Buscar camisa por clube ou nome..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="ALL">Todas as Categorias</option>
                  <option value="Times Brasileiros">Times Brasileiros</option>
                  <option value="Times Europeus">Times Europeus</option>
                  <option value="Seleções">Seleções</option>
                  <option value="Retrô">Retrô</option>
                  <option value="Corta-Ventos">Corta-Ventos</option>
                </select>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Camisa</span>
                </button>
              </div>
            </div>

            {/* Products Table with Direct & Granular Stock Adjustment */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Camisa / Clube</th>
                      <th className="py-3.5 px-4">Categoria</th>
                      <th className="py-3.5 px-4">Preço Atacado</th>
                      <th className="py-3.5 px-4">Estoque por Tamanho (Digite ou ajuste +-1 / +-5)</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{prod.name}</div>
                              <div className="text-[11px] text-slate-500">{prod.club} • {prod.season}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[11px]">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-black text-emerald-700">
                            R$ {prod.wholesaleTiers[1]?.unitPrice?.toFixed(2) || '50.00'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {prod.variants.map((v) => (
                              <div key={v.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center min-w-[70px]">
                                <div className="text-[10px] font-black text-slate-600 uppercase">{v.size}</div>
                                
                                {/* Direct input for exact quantity */}
                                <input
                                  type="number"
                                  min="0"
                                  value={v.stock}
                                  onChange={(e) => handleDirectStockChange(prod.id, v.size, parseInt(e.target.value, 10))}
                                  className={`w-full text-center font-black text-xs p-1 rounded-lg border my-1 ${
                                    v.stock < 10 ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-slate-300 text-slate-900'
                                  }`}
                                  title="Digite a quantidade disponível"
                                />

                                {/* Granular 1-by-1 and 5-by-5 buttons */}
                                <div className="grid grid-cols-4 gap-0.5">
                                  <button
                                    onClick={() => handleStepStock(prod.id, v.size, -5, v.stock)}
                                    className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[9px] font-black cursor-pointer"
                                    title="-5 peças"
                                  >
                                    -5
                                  </button>
                                  <button
                                    onClick={() => handleStepStock(prod.id, v.size, -1, v.stock)}
                                    className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[9px] font-black cursor-pointer"
                                    title="-1 peça"
                                  >
                                    -1
                                  </button>
                                  <button
                                    onClick={() => handleStepStock(prod.id, v.size, 1, v.stock)}
                                    className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-[9px] font-black cursor-pointer"
                                    title="+1 peça"
                                  >
                                    +1
                                  </button>
                                  <button
                                    onClick={() => handleStepStock(prod.id, v.size, 5, v.stock)}
                                    className="p-1 bg-emerald-200 hover:bg-emerald-300 text-emerald-950 rounded text-[9px] font-black cursor-pointer"
                                    title="+5 peças"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                              title="Editar Produto e Tamanhos"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingProductId(prod.id)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                              title="Excluir Camisa do Catálogo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LOJISTAS & CLIENTES B2B */}
        {/* ========================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  placeholder="Buscar por CNPJ, Razão Social, WhatsApp ou E-mail..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <button
                onClick={handleOpenNewClientModal}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Lojista</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{client.tradeName}</div>
                      <div className="text-[11px] text-slate-500">{client.name}</div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      Nível {client.loyaltyTier}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div><strong>CNPJ/CPF:</strong> {client.cnpj}</div>
                    <div><strong>WhatsApp:</strong> {client.phone}</div>
                    <div><strong>E-mail:</strong> {client.email}</div>
                    <div><strong>Cidade/UF:</strong> {client.city} - {client.state}</div>
                    {client.postalCode && (
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <strong>Endereço:</strong> {client.street ? `${client.street}, ${client.number || 'S/N'}` : ''} {client.neighborhood ? `- ${client.neighborhood}` : ''} • CEP {client.postalCode}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Comprado: <strong className="text-emerald-700">R$ {client.totalSpent.toFixed(2)}</strong></span>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditClientModal(client)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                        title="Editar Lojista"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingClientId(client.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                        title="Excluir Lojista"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CUPONS DE DESCONTO */}
        {/* ========================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Create Coupon Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Cadastrar Novo Cupom de Desconto</h3>
                  <p className="text-xs text-slate-500">Crie cupons promocionais para revendedores e grandes pedidos</p>
                </div>
                {couponSuccessMessage && (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {couponSuccessMessage}
                  </span>
                )}
              </div>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Código do Cupom:</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex: MCVIP10"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Tipo de Desconto:</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="PERCENTAGE">Porcentagem (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    {newCouponType === 'PERCENTAGE' ? 'Desconto (%):' : 'Desconto (R$):'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Mínimo de Peças:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={newCouponMinPieces}
                      onChange={(e) => setNewCouponMinPieces(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      {c.code}
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `R$ ${c.discountValue.toFixed(2)} OFF`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Válido a partir de <strong>{c.minPieces || 1} peças</strong> no carrinho</div>
                    <div>Status: <strong className={c.active ? 'text-emerald-600' : 'text-slate-400'}>{c.active ? 'Ativo' : 'Inativo'}</strong></div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onToggleCoupon && onToggleCoupon(c.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg cursor-pointer ${
                        c.active ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.active ? 'Desativar' : 'Ativar'}
                    </button>

                    <button
                      onClick={() => onDeleteCoupon && onDeleteCoupon(c.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Excluir Cupom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: MERCADO PAGO & PAGAMENTOS */}
        {/* ========================================================= */}
        {activeTab === 'mercadopago' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Integração Mercado Pago (PIX, Cartão e Boleto)</h3>
                  <p className="text-xs text-slate-500">
                    Insira suas credenciais de desenvolvedor do Mercado Pago para receber os pagamentos diretamente na sua conta
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  mpConfig.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {mpConfig.configured ? '✅ Mercado Pago Vinculado' : '⚙️ Aguardando Chaves'}
                </span>
              </div>
            </div>

            {mpSavedFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configurações do Mercado Pago salvas com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveMercadoPago} className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-sky-600" /> Public Key (Chave Pública):
                </label>
                <input
                  type="text"
                  value={mpConfig.publicKey}
                  onChange={(e) => setMpConfig({ ...mpConfig, publicKey: e.target.value, configured: Boolean(e.target.value) })}
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-sky-600" /> Access Token (Token de Acesso Privado):
                </label>
                <input
                  type="password"
                  value={mpConfig.accessToken}
                  onChange={(e) => setMpConfig({ ...mpConfig, accessToken: e.target.value })}
                  placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Credenciais do Mercado Pago</span>
                </button>
              </div>
            </form>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                Como obter suas chaves de API no Mercado Pago:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                <li>Acesse o portal oficial de desenvolvedores do Mercado Pago (<strong>mercadopago.com.br/developers</strong>).</li>
                <li>Crie ou selecione sua aplicação de vendas online.</li>
                <li>Acesse a aba <strong>Credenciais de Produção</strong>.</li>
                <li>Copie a <strong>Public Key</strong> e o <strong>Access Token</strong> e cole nos campos acima.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: EDIT PRODUCT & SIZES & STOCK */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
              <h3 className="font-black text-base">Editar Camisa e Tamanhos Disponíveis</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome da Camisa:</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Clube / Time:</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.club}
                    onChange={(e) => setEditingProduct({ ...editingProduct, club: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Categoria:</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Times Brasileiros">Times Brasileiros</option>
                    <option value="Times Europeus">Times Europeus</option>
                    <option value="Seleções">Seleções</option>
                    <option value="Retrô">Retrô</option>
                    <option value="Corta-Ventos">Corta-Ventos</option>
                    <option value="Kits/Combos">Kits/Combos</option>
                    <option value="Edição Especial">Edição Especial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">URL da Imagem:</label>
                <input
                  type="text"
                  required
                  value={editingProduct.images[0]}
                  onChange={(e) => {
                    const newImages = [...editingProduct.images];
                    newImages[0] = e.target.value;
                    setEditingProduct({ ...editingProduct, images: newImages });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>

              {/* Sizes and Variants Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-bold text-slate-900 block">Tamanhos Disponíveis e Estoque:</label>
                <div className="space-y-2">
                  {editingProduct.variants.map((v, idx) => (
                    <div key={v.id || idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="font-black text-xs w-12 text-slate-800">{v.size}</span>
                      <span className="text-[11px] text-slate-500">Estoque:</span>
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => {
                          const nextVariants = [...editingProduct.variants];
                          nextVariants[idx] = { ...v, stock: parseInt(e.target.value, 10) || 0 };
                          setEditingProduct({ ...editingProduct, variants: nextVariants });
                        }}
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextVariants = editingProduct.variants.filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, variants: nextVariants });
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg ml-auto cursor-pointer"
                        title="Remover tamanho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new size to product */}
                <div className="flex items-center gap-2 pt-1">
                  <select
                    id="add-size-select"
                    className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {AVAILABLE_SIZES.filter(s => !editingProduct.variants.some(v => v.size === s)).map(s => (
                      <option key={s} value={s}>Adicionar Tam: {s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sel = (document.getElementById('add-size-select') as HTMLSelectElement)?.value as Size;
                      if (!sel) return;
                      const nextVariants = [
                        ...editingProduct.variants,
                        { id: `v-${Date.now()}-${sel.toLowerCase()}`, size: sel, stock: 30, sku: `${editingProduct.club.substring(0, 3).toUpperCase()}-${sel}` }
                      ];
                      setEditingProduct({ ...editingProduct, variants: nextVariants });
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    + Incluir Tamanho
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl cursor-pointer shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CLIENT */}
      {/* ========================================================= */}
      {isAddClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full my-8 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-black text-base">
                {editingClient ? 'Editar Cadastro de Lojista' : 'Cadastrar Novo Lojista / Revendedor'}
              </h3>
              <button onClick={() => setIsAddClientOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nome do Responsável *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Razão Social / Nome da Loja</label>
                  <input
                    type="text"
                    value={clientTradeName}
                    onChange={(e) => setClientTradeName(e.target.value)}
                    placeholder="Ex: FutSport Brasil"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CNPJ ou CPF *</label>
                  <input
                    type="text"
                    required
                    value={clientCnpj}
                    onChange={(e) => setClientCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-mail *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="lojista@exemplo.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              {/* Client Address Fields */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">Endereço de Envio do Lojista:</span>
                  {isClientCepLoading && <span className="text-[10px] text-emerald-600 animate-pulse font-mono">Buscando CEP...</span>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">CEP</label>
                    <input
                      type="text"
                      value={clientPostalCode}
                      onChange={(e) => handleAdminClientCepLookup(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-xs"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Rua / Logradouro</label>
                    <input
                      type="text"
                      value={clientStreet}
                      onChange={(e) => setClientStreet(e.target.value)}
                      placeholder="Ex: Av. Paulista"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Número</label>
                    <input
                      type="text"
                      value={clientNumber}
                      onChange={(e) => setClientNumber(e.target.value)}
                      placeholder="1000"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Complemento</label>
                    <input
                      type="text"
                      value={clientComplement}
                      onChange={(e) => setClientComplement(e.target.value)}
                      placeholder="Sala 2"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Bairro</label>
                    <input
                      type="text"
                      value={clientNeighborhood}
                      onChange={(e) => setClientNeighborhood(e.target.value)}
                      placeholder="Bela Vista"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">Cidade</label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600">UF</label>
                    <select
                      value={clientState}
                      onChange={(e) => setClientState(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
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

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nível de Atacado / Fidelidade</label>
                <select
                  value={clientTier}
                  onChange={(e) => setClientTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Prata">Prata (Iniciante 5-20 peças)</option>
                  <option value="Ouro">Ouro (Atacado 30-50 peças)</option>
                  <option value="Diamante">Diamante (Grande Volume 100+ peças)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl cursor-pointer shadow-md"
                >
                  {editingClient ? 'Salvar Lojista' : 'Cadastrar Lojista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD PRODUCT */}
      {/* ========================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
              <h3 className="font-black text-base">Cadastrar Nova Camisa no Catálogo</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome da Camisa:</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Real Madrid Home 2024/2025"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Clube / Time:</label>
                  <input
                    type="text"
                    required
                    value={newProdClub}
                    onChange={(e) => setNewProdClub(e.target.value)}
                    placeholder="Ex: Real Madrid"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Categoria:</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Times Brasileiros">Times Brasileiros</option>
                    <option value="Times Europeus">Times Europeus</option>
                    <option value="Seleções">Seleções</option>
                    <option value="Retrô">Retrô</option>
                    <option value="Corta-Ventos">Corta-Ventos</option>
                    <option value="Kits/Combos">Kits/Combos</option>
                    <option value="Edição Especial">Edição Especial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Preço Atacado (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdWholesalePrice}
                    onChange={(e) => setNewProdWholesalePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Temporada:</label>
                  <input
                    type="text"
                    value={newProdSeason}
                    onChange={(e) => setNewProdSeason(e.target.value)}
                    placeholder="2024/2025"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">URL da Foto:</label>
                <input
                  type="text"
                  required
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Estoque Inicial por Tamanho:</label>
                <div className="grid grid-cols-5 gap-2">
                  {newProdVariants.map((v, i) => (
                    <div key={v.size}>
                      <span className="text-[10px] font-bold text-slate-500">{v.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...newProdVariants];
                          updated[i] = { ...v, stock: Number(e.target.value) || 0 };
                          setNewProdVariants(updated);
                        }}
                        className="w-full p-2 bg-slate-50 border rounded-lg font-bold text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer mt-2"
              >
                Cadastrar e Disponibilizar no Atacado
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION */}
      {/* ========================================================= */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">Remover Camisa do Catálogo?</h3>
            <p className="text-xs text-slate-500">Esta ação desativará o produto do atacado imediatamente.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteProduct}
                className="flex-1 py-2.5 bg-rose-600 text-white font-black rounded-xl text-xs cursor-pointer"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CLIENT CONFIRMATION */}
      {/* ========================================================= */}
      {deletingClientId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">Excluir Cadastro do Lojista?</h3>
            <p className="text-xs text-slate-500">O lojista perderá o acesso e histórico cadastral.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingClientId(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteClient}
                className="flex-1 py-2.5 bg-rose-600 text-white font-black rounded-xl text-xs cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PRINT INVOICE / ROMANEIO */}
      {/* ========================================================= */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900">ROMANEIO DE DESPACHO B2B</h3>
                <div className="text-xs text-slate-500">MC Store Futebol • Distribuidora Atacadista</div>
              </div>
              <button onClick={() => setSelectedOrderForInvoice(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Pedido:</strong> #{selectedOrderForInvoice.orderNumber}<br />
                <strong>Data:</strong> {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('pt-BR')}<br />
                <strong>Status:</strong> {selectedOrderForInvoice.status}
              </div>
              <div>
                <strong>Destinatário:</strong> {selectedOrderForInvoice.customerName}<br />
                <strong>Telefone:</strong> {selectedOrderForInvoice.customerPhone}<br />
                <strong>Transportadora:</strong> {selectedOrderForInvoice.trackingCarrier || 'Jadlog Express'}
              </div>
            </div>

            <div className="border rounded-2xl overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-50 border-b font-bold text-[11px]">
                  <tr>
                    <th className="p-3 text-left">Item / Camisa</th>
                    <th className="p-3 text-center">Tam</th>
                    <th className="p-3 text-center">Qtd</th>
                    <th className="p-3 text-right">Unitário</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedOrderForInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3">{it.productName}</td>
                      <td className="p-3 text-center font-bold">{it.size}</td>
                      <td className="p-3 text-center font-bold">{it.quantity}</td>
                      <td className="p-3 text-right">R$ {it.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold">R$ {(it.quantity * it.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-xs text-slate-700">Total do Lote: {selectedOrderForInvoice.totalQuantity} peças</span>
              <span className="font-black text-base text-emerald-700">Total: R$ {selectedOrderForInvoice.total.toFixed(2)}</span>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir Romaneio de Envio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
