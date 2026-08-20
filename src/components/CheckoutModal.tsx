import React, { useState } from 'react';
import { CartItem, Product, Order, PaymentMethod, Coupon } from '../types';
import { calculateCartTotals } from '../utils/pricing';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Truck, 
  CreditCard, 
  QrCode, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Lock,
  MessageCircle,
  Clock,
  Printer,
  Ticket
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  productsMap: Record<string, Product>;
  appliedCoupon?: Coupon | null;
  onOrderCompleted: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  productsMap,
  appliedCoupon = null,
  onOrderCompleted,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  
  // Customer info
  const [name, setName] = useState('Lucas Martins');
  const [email, setEmail] = useState('revendedor@futstore.com.br');
  const [cpfCnpj, setCpfCnpj] = useState('45.892.123/0001-44');
  const [phone, setPhone] = useState('(19) 99874-1234');
  const [company, setCompany] = useState('FutStore Campinas');
  
  // Address info
  const [postalCode, setPostalCode] = useState('13010-001');
  const [street, setStreet] = useState('Av. Francisco Glicério');
  const [number, setNumber] = useState('1420');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [city, setCity] = useState('Campinas');
  const [state, setState] = useState('SP');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [installments, setInstallments] = useState(1);
  const [isCopiedPix, setIsCopiedPix] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, productsMap, appliedCoupon);
  const pixCopiaEColaMock = '00020126580014br.gov.bcb.pix0136mcstore-atacado-futebol-b2b@mercadopago.com5204000053039865405' + totals.total.toFixed(2) + '5802BR5925MC STORE DISTRIBUICAO LT6009SAO PAULO62070503***6304E8A2';

  const handleCreateOrder = () => {
    const orderNumber = `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: name,
      customerEmail: email,
      customerCpfCnpj: cpfCnpj,
      customerPhone: phone,
      resellerCompany: company,
      shippingAddress: {
        street,
        number,
        neighborhood,
        city,
        state,
        postalCode,
      },
      items: totals.itemsWithTierPricing.map((item, idx) => ({
        id: `oi-${idx}-${Date.now()}`,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      })),
      totalQuantity: totals.totalQuantity,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingCost: totals.shippingCost,
      total: totals.total,
      status: paymentMethod === 'PIX' ? 'PAID' : 'PENDING',
      paymentMethod,
      pixCopiaECola: pixCopiaEColaMock,
      trackingCode: 'NL' + Math.floor(100000000 + Math.random() * 900000000) + 'BR',
      trackingCarrier: 'Jadlog Express',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('success');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopiaEColaMock);
    setIsCopiedPix(true);
    setTimeout(() => setIsCopiedPix(false), 2500);
  };

  const handleSendWhatsAppOrder = () => {
    if (!completedOrder) return;
    const msg = encodeURIComponent(
      `Olá MC Store! Acabei de realizar o pedido de atacado nº *${completedOrder.orderNumber}* no valor de R$ ${completedOrder.total.toFixed(2)} (${completedOrder.totalQuantity} peças). Gostaria de confirmar a separação!`
    );
    window.open(`https://wa.me/556191677676?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="checkout-modal-content"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={36} />
            <div>
              <h2 className="text-base font-black tracking-tight">Checkout Mercado Pago Atacado</h2>
              <p className="text-[11px] text-slate-400">Ambiente 100% Criptografado e Seguro</p>
            </div>
          </div>

          <button
            id="btn-close-checkout-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps Progress */}
        {step !== 'success' && (
          <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setStep('info')}
              className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                step === 'info' ? 'border-emerald-500 text-emerald-700 bg-white' : 'border-transparent'
              }`}
            >
              1. Dados do Revendedor & Entrega
            </button>
            <button
              onClick={() => setStep('payment')}
              className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                step === 'payment' ? 'border-emerald-500 text-emerald-700 bg-white' : 'border-transparent'
              }`}
            >
              2. Pagamento & Finalização
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: INFO */}
          {step === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-emerald-900 font-medium">
                <div>
                  <span>Resumo: <strong>{totals.totalQuantity} camisas</strong> no lote</span>
                  {totals.discount > 0 && (
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Cupom aplicado: - R$ {totals.discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                </div>
                <span className="text-base font-black text-emerald-700">R$ {totals.total.toFixed(2).replace('.', ',')}</span>
              </div>

              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Dados da Empresa / Lojista
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Responsável *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Fantasia / Loja</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNPJ ou CPF *</label>
                  <input
                    type="text"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp de Contato *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide pt-2">
                Endereço de Entrega (Transportadora / Correios)
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Rua / Logradouro *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número *</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade / UF *</label>
                  <input
                    type="text"
                    value={`${city} - ${state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      setCity(parts[0]?.trim() || city);
                      setState(parts[1]?.trim() || state);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full mt-4 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Avançar para o Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-5 text-xs">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Forma de Pagamento Mercado Pago
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3.5 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'PIX'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>Pix (Imediato)</span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                    Mais Rápido
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-3.5 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <span>Cartão de Crédito</span>
                  <span className="text-[10px] text-slate-400">Até 12x</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BOLETO')}
                  className={`p-3.5 rounded-2xl border text-center font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'BOLETO'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-5 h-5 text-slate-700" />
                  <span>Boleto Bancário</span>
                  <span className="text-[10px] text-slate-400">1 a 2 dias</span>
                </button>
              </div>

              {/* Pix Details */}
              {paymentMethod === 'PIX' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-center">
                  <div className="w-40 h-40 bg-white border border-slate-200 rounded-2xl p-2 mx-auto shadow-xs flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCopiaEColaMock)}`}
                      alt="QR Code Pix Mercado Pago"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-600">
                    Abra o app do seu banco e aponte a câmera para o QR Code acima ou use o Pix Copia e Cola:
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCopiaEColaMock}
                      className="flex-1 px-3 py-2 text-[11px] bg-white border border-slate-300 rounded-xl text-slate-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isCopiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Credit Card Installments */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block font-bold text-slate-700">Escolha o número de parcelas:</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-bold"
                  >
                    <option value={1}>1x de R$ {totals.total.toFixed(2)} sem juros</option>
                    <option value={2}>2x de R$ {(totals.total / 2).toFixed(2)} sem juros</option>
                    <option value={3}>3x de R$ {(totals.total / 3).toFixed(2)} sem juros</option>
                    <option value={6}>6x de R$ {((totals.total * 1.05) / 6).toFixed(2)} com acréscimo</option>
                    <option value={12}>12x de R$ {((totals.total * 1.12) / 12).toFixed(2)} com acréscimo</option>
                  </select>
                </div>
              )}

              {/* Finish Order Trigger */}
              <button
                id="btn-confirm-order-payment"
                type="button"
                onClick={handleCreateOrder}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-[1.01] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar e Gerar Romaneio do Pedido</span>
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && completedOrder && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Pedido Concluído com Sucesso!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Número do Pedido: <strong className="text-slate-900">{completedOrder.orderNumber}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-700 pb-2 border-b border-slate-200">
                  <span>Destinatário:</span>
                  <span>{completedOrder.customerName} ({completedOrder.resellerCompany})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total de Peças:</span>
                  <span className="font-bold text-slate-900">{completedOrder.totalQuantity} mantos</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Desconto Aplicado:</span>
                    <span>- R$ {completedOrder.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Valor Total:</span>
                  <span className="font-bold text-emerald-700 text-sm">R$ {completedOrder.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status do Envio:</span>
                  <span className="font-bold text-slate-900">Em Separação • Despacho em 24h</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Código de Rastreio Estimado:</span>
                  <span className="font-mono font-bold text-slate-800">{completedOrder.trackingCode} ({completedOrder.trackingCarrier})</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsAppOrder}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprovante no WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Fechar & Voltar à Loja
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
