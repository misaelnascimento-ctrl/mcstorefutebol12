export type Role = 'ADMIN' | 'RESELLER' | 'GUEST';

export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

export type Size = 'P' | 'M' | 'G' | 'GG' | 'XG' | '2XG' | '3XG' | 'Juvenil';

export type ProductCategory = 
  | 'Todos'
  | 'Lançamentos'
  | 'Times Brasileiros'
  | 'Times Europeus'
  | 'Seleções'
  | 'Retrô'
  | 'Corta-Ventos'
  | 'Kits/Combos'
  | 'Edição Especial';

export interface ProductVariant {
  id: string;
  size: Size | string;
  stock: number;
  sku: string;
}

export interface WholesaleTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  club: string;
  category: 'Lançamentos' | 'Times Brasileiros' | 'Times Europeus' | 'Seleções' | 'Retrô' | 'Corta-Ventos' | 'Kits/Combos' | 'Edição Especial';
  season: string;
  basePrice: number; // Retail price reference (e.g. 149.90)
  wholesaleTiers: WholesaleTier[];
  description: string;
  fabric: string;
  images: string[];
  unbrandedImages: string[]; // HD images for resellers (white-label marketing)
  variants: ProductVariant[];
  featured?: boolean;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  size: Size | string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  size: Size | string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number; // ex: 10 (%) or 50 (R$)
  minPieces?: number;
  minOrderValue?: number;
  active: boolean;
  expiresAt?: string;
  usageCount?: number;
}

export interface MercadoPagoConfig {
  publicKey: string;
  accessToken: string;
  sandbox: boolean;
  configured: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerCpfCnpj: string;
  customerPhone: string;
  resellerCompany?: string;
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: OrderItem[];
  totalQuantity: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  pixQrCodeBase64?: string;
  pixCopiaECola?: string;
  trackingCode?: string;
  trackingCarrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface B2BClient {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  postalCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  ordersCount: number;
  totalSpent: number;
  loyaltyTier: 'Prata' | 'Ouro' | 'Diamante';
  joinedDate: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  tradeName?: string;
  cnpjCpf?: string;
  phone?: string;
  postalCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  loyaltyTier?: 'Prata' | 'Ouro' | 'Diamante';
  ordersCount?: number;
  totalSpent?: number;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  storeName: string;
  city: string;
  state: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  orderVolume: string; // e.g. "Comprador de 30+ peças"
  photos?: string[];
  productName?: string;
  likes: number;
}

export interface PurchaseToastNotification {
  id: string;
  customerName: string;
  location: string;
  itemCount: number;
  description: string;
  totalValue: number;
  paymentType: 'PIX' | 'CARTÃO' | 'BOLETO';
  timeAgo: string;
  avatarUrl?: string;
}
