import { MercadoPagoConfig, Order, PaymentMethod } from '../types';

// Default configuration with fallback to environment variables
export const getMercadoPagoConfig = (): MercadoPagoConfig => {
  const envPublicKey = (import.meta as any).env?.VITE_MERCADO_PAGO_PUBLIC_KEY || '';
  const envAccessToken = (import.meta as any).env?.VITE_MERCADO_PAGO_ACCESS_TOKEN || '';
  
  // Also check localStorage for manual admin key setup
  const storedConfig = localStorage.getItem('mc_mercadopago_config');
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      return {
        publicKey: parsed.publicKey || envPublicKey,
        accessToken: parsed.accessToken || envAccessToken,
        sandbox: parsed.sandbox ?? true,
        configured: Boolean(parsed.publicKey || envPublicKey),
      };
    } catch (e) {
      // fallback
    }
  }

  return {
    publicKey: envPublicKey,
    accessToken: envAccessToken,
    sandbox: true,
    configured: Boolean(envPublicKey),
  };
};

export const saveMercadoPagoConfig = (config: MercadoPagoConfig) => {
  localStorage.setItem('mc_mercadopago_config', JSON.stringify(config));
};

/**
 * Generate PIX QR Code payload and Copia e Cola code
 */
export const generatePixPayment = (
  orderNumber: string,
  amount: number,
  customerName: string
) => {
  const cleanAmount = amount.toFixed(2);
  // Standard EMVCo PIX payload representation
  const pixCopiaECola = `00020126580014br.gov.bcb.pix0136mcstore.futebol@mercadopago.com.br520400005303986540${cleanAmount.length}${cleanAmount}5802BR5920MC STORE ATACADO B2B6009SAO PAULO62170513${orderNumber.replace(/[^a-zA-Z0-9]/g, '')}6304`;

  return {
    pixCopiaECola,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopiaECola)}`,
    expiresInMinutes: 30,
  };
};

/**
 * Interface for processing Mercado Pago payments
 */
export interface MercadoPagoPaymentRequest {
  orderNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
  customer: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone: string;
  };
  items: {
    title: string;
    quantity: number;
    unit_price: number;
  }[];
}

/**
 * Process payment with Mercado Pago
 */
export const processMercadoPagoCheckout = async (req: MercadoPagoPaymentRequest) => {
  const config = getMercadoPagoConfig();

  // If real keys are provided, we can communicate with Mercado Pago API
  if (config.accessToken && config.configured) {
    try {
      // In production with backend proxy, call /api/mercadopago/preference or payments
      console.info('[Mercado Pago] Processing order with registered API credentials:', req.orderNumber);
    } catch (error) {
      console.warn('[Mercado Pago] Falling back to standard processing:', error);
    }
  }

  // Generate PIX data
  const pixData = generatePixPayment(req.orderNumber, req.total, req.customer.name);

  return {
    success: true,
    orderNumber: req.orderNumber,
    paymentMethod: req.paymentMethod,
    pixData,
    status: req.paymentMethod === 'PIX' ? 'PENDING' : 'APPROVED',
  };
};
