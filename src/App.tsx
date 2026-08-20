import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, AuthUser, Size, CustomerReview, B2BClient, Coupon } from './types';
import { 
  MOCK_PRODUCTS, 
  MOCK_ORDERS, 
  MOCK_B2B_CLIENTS, 
  MOCK_REVIEWS, 
  MOCK_PURCHASE_NOTIFICATIONS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ResellerPortal } from './components/ResellerPortal';
import { LivePurchaseToast } from './components/LivePurchaseToast';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ProfitCalculatorModal } from './components/ProfitCalculatorModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ShippingSimulatorModal } from './components/ShippingSimulatorModal';
import { BrandLogo } from './components/BrandLogo';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Layers, 
  Calculator, 
  Star, 
  Flame, 
  MessageCircle, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Award,
  Filter,
  Check,
  Crown,
  Lock,
  MapPin,
  Instagram
} from 'lucide-react';

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'MCVIP10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minPieces: 10,
    active: true,
    usageCount: 14,
  },
  {
    id: 'c-2',
    code: 'PRIMEIRACOMPRA',
    discountType: 'FIXED',
    discountValue: 50,
    minPieces: 10,
    active: true,
    usageCount: 38,
  },
  {
    id: 'c-3',
    code: 'ATACADOMASTER',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minPieces: 30,
    active: true,
    usageCount: 8,
  },
];

export function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<'store' | 'product-detail' | 'admin' | 'reseller'>('store');
  const [currentCategory, setCurrentCategory] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products & Orders & Reviews & Clients State with Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mc_products_v3');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mc_orders_v3');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [clients, setClients] = useState<B2BClient[]>(() => {
    const saved = localStorage.getItem('mc_clients_v3');
    return saved ? JSON.parse(saved) : MOCK_B2B_CLIENTS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('mc_coupons_v1');
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('mc_reviews_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return MOCK_REVIEWS;
  });

  // Cart State with Persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mc_cart_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Authentication State with Persistence
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('mc_auth_user_v3');
    return saved ? JSON.parse(saved) : null;
  });

  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isShippingSimulatorOpen, setIsShippingSimulatorOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingModalCode, setTrackingModalCode] = useState<string>('');

  // Filter and Sorting State
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [visibleCount, setVisibleCount] = useState(24);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('mc_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mc_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mc_clients_v3', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('mc_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('mc_reviews_v4', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mc_cart_v3', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mc_auth_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mc_auth_user_v3');
    }
  }, [currentUser]);

  // Fast Product lookup map
  const productsMap = useMemo(() => {
    const map: Record<string, Product> = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  // Cart total pieces count
  const cartTotalQuantity = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + it.quantity, 0);
  }, [cartItems]);

  // Filtered Products Catalog
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (currentCategory !== 'Todos') {
      if (currentCategory === 'Lançamentos') {
        list = list.filter((p) => p.badge?.includes('Lançamento') || p.season.includes('24/25'));
      } else {
        list = list.filter((p) => p.category === currentCategory);
      }
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.wholesaleTiers[1]?.unitPrice || 50) - (b.wholesaleTiers[1]?.unitPrice || 50));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.wholesaleTiers[1]?.unitPrice || 50) - (a.wholesaleTiers[1]?.unitPrice || 50));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 4.9) - (a.rating || 4.9));
    }

    return list;
  }, [products, currentCategory, sortBy]);

  // Handle Cart Operations
  const handleAddBatchToCart = (product: Product, batchItems: { size: Size; quantity: number }[]) => {
    setCartItems((prev) => {
      const next = [...prev];
      batchItems.forEach((b) => {
        const existingIdx = next.findIndex((item) => item.productId === product.id && item.size === b.size);
        const unitPrice = product.wholesaleTiers[1]?.unitPrice || 50;

        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + b.quantity,
          };
        } else {
          next.push({
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            category: product.category,
            size: b.size,
            quantity: b.quantity,
            unitPrice,
          });
        }
      });
      return next;
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, size: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleReorder = (items: CartItem[]) => {
    setCartItems(items);
    setActiveView('store');
    setIsCartOpen(true);
  };

  // Handle Reseller Portal Direct Wholesale Batch Purchase & Checkout
  const handleResellerBatchPurchase = (items: CartItem[], directCheckout = false) => {
    setCartItems((prev) => {
      const updated = [...prev];
      items.forEach((newItem) => {
        const idx = updated.findIndex(
          (i) => i.productId === newItem.productId && i.size === newItem.size
        );
        if (idx >= 0) {
          updated[idx].quantity += newItem.quantity;
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });

    if (directCheckout) {
      setIsCheckoutOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  // Handle Order Created
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Stock update from Admin
  const handleUpdateProductStock = (productId: string, size: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map((v) => (v.size === size ? { ...v, stock: newStock } : v)),
          };
        }
        return p;
      })
    );
  };

  // Status update from Admin
  const handleUpdateOrderStatus = (orderId: string, status: any, trackingCode?: string, carrier?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingCode: trackingCode !== undefined ? trackingCode : o.trackingCode,
            trackingCarrier: carrier !== undefined ? carrier : o.trackingCarrier,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  };

  const handleUpdateUserProfile = (updated: Partial<AuthUser>) => {
    if (!currentUser) return;
    const nextUser: AuthUser = {
      ...currentUser,
      ...updated,
    };
    setCurrentUser(nextUser);
    localStorage.setItem('mc_auth_user', JSON.stringify(nextUser));

    // Also sync with clients list
    setClients((prev) =>
      prev.map((c) =>
        c.email.toLowerCase() === currentUser.email.toLowerCase()
          ? {
              ...c,
              name: updated.name || c.name,
              tradeName: updated.tradeName || c.tradeName,
              cnpjCpf: updated.cnpjCpf || c.cnpjCpf,
              phone: updated.phone || c.phone,
              postalCode: updated.postalCode || c.postalCode,
              street: updated.street || c.street,
              number: updated.number || c.number,
              complement: updated.complement || c.complement,
              neighborhood: updated.neighborhood || c.neighborhood,
              city: updated.city || c.city,
              state: updated.state || c.state,
            }
          : c
      )
    );
  };

  const handleAddNewProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const handleAddClient = (newClient: B2BClient) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleUpdateClient = (updatedClient: B2BClient) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  // Coupon Handlers
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) => prev.map((c) => c.id === couponId ? { ...c, active: !c.active } : c));
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  const handleAddReview = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleOpenTracking = (code?: string) => {
    if (code) {
      setTrackingModalCode(code);
    }
    setIsTrackingModalOpen(true);
  };

  const scrollToReviews = () => {
    if (activeView !== 'store') {
      setActiveView('store');
    }
    setTimeout(() => {
      const el = document.getElementById('reviews-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectCategory = (category: string) => {
    setCurrentCategory(category);
    if (activeView !== 'store') {
      setActiveView('store');
    }
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Live Recent Purchase Activity Toast */}
      <LivePurchaseToast notifications={MOCK_PURCHASE_NOTIFICATIONS} />

      {/* Main Header / Navigation */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        cartCount={cartTotalQuantity}
        onOpenCart={() => setIsCartOpen(true)}
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'admin') {
            if (currentUser?.role === 'ADMIN') {
              setActiveView('admin');
            } else {
              setIsAdminAuthOpen(true);
            }
          } else {
            setActiveView(view);
          }
        }}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setActiveView('product-detail');
        }}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthInitialMode(mode || 'login');
          setIsAuthOpen(true);
        }}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          setActiveView('store');
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenShippingSimulator={() => setIsShippingSimulatorOpen(true)}
        onOpenTrackingModal={() => handleOpenTracking()}
        onScrollToReviews={scrollToReviews}
      />

      {/* VIEW: MAIN CATALOG & STORE */}
      {activeView === 'store' && (
        <main className="animate-fadeIn">
          {/* Hero Banner Section */}
          <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800">
            {/* Background ambient lighting */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Distribuidora Oficial B2B • Grade Tailandesa 1:1</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  CAMISAS DE FUTEBOL <span className="text-emerald-400">NO ATACADO</span> PARA REVENDEDORES
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Importação direta com padrão oficial 1:1, tags originais, bordados de alta precisão e tecido poliéster respirável. Monte sua grade personalizada a partir de <strong>10 peças (R$ 50/un)</strong> ou <strong>30+ peças (R$ 45/un + Frete Grátis)</strong>.
                </p>

                {/* Wholesale Pricing Tiers Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm">
                      10+
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold">10 a 29 Camisas</div>
                      <div className="text-lg font-black text-emerald-400">R$ 50,00 <span className="text-xs text-slate-400 font-normal">/unidade</span></div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center gap-3 relative overflow-hidden">
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-bl-lg">
                      RECOMENDADO
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                      30+
                    </div>
                    <div>
                      <div className="text-xs text-amber-300 font-bold">30 ou mais peças</div>
                      <div className="text-lg font-black text-amber-400">R$ 45,00 <span className="text-xs text-slate-400 font-normal">/un + FRETE GRÁTIS</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>Ver Catálogo Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>Calcular Margem de Lucro</span>
                  </button>

                  <button
                    onClick={() => setIsShippingSimulatorOpen(true)}
                    className="px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-sky-400" />
                    <span>Simular Frete</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Value Pillars */}
          <section className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900">Frete Grátis Brasil</h4>
                  <p className="text-[11px] text-slate-500">Em pedidos acima de 30 peças</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900">Padrão Tailandês 1:1</h4>
                  <p className="text-[11px] text-slate-500">Bordados, tags e tecido oficial</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900">Grade Livre e Mista</h4>
                  <p className="text-[11px] text-slate-500">Escolha times e tamanhos variados</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900">Despacho em 24 Horas</h4>
                  <p className="text-[11px] text-slate-500">Código de rastreio automático</p>
                </div>
              </div>
            </div>
          </section>

          {/* CATALOG SECTION */}
          <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            {/* Header and Category Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Catálogo Atacadista Pronta-Entrega
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mais de 150 modelos disponíveis para seleção de grade individual
                </p>
              </div>

              {/* Sorting and Filter controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 pl-2 uppercase">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-slate-800 pr-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Destaques da Temporada</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="rating">Mais Vendidos / Avaliados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['Todos', 'Lançamentos', 'Times Brasileiros', 'Times Europeus', 'Seleções', 'Retrô', 'Corta-Ventos'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCurrentCategory(cat);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currentCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    setActiveView('product-detail');
                  }}
                  onQuickAdd={(p) => {
                    setSelectedProduct(p);
                    setActiveView('product-detail');
                  }}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-8 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-2xl shadow-xs transition-colors cursor-pointer"
                >
                  Carregar Mais Camisas ({filteredProducts.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </section>

          {/* Social Proof & Customer Reviews Section with Live Passing Marquee */}
          <div id="reviews-section">
            <CustomerReviewsSection
              reviews={reviews}
              onAddReview={handleAddReview}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
            />
          </div>
        </main>
      )}

      {/* VIEW: PRODUCT DETAIL */}
      {activeView === 'product-detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          currentCartTotalQuantity={cartTotalQuantity}
          onBack={() => setActiveView('store')}
          onAddBatchToCart={(items) => handleAddBatchToCart(selectedProduct, items)}
        />
      )}

      {/* VIEW: ADMIN DASHBOARD (Strict Access Verification) */}
      {activeView === 'admin' && (
        currentUser?.role === 'ADMIN' ? (
          <AdminDashboard
            orders={orders}
            products={products}
            clients={clients}
            coupons={coupons}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateProductStock={handleUpdateProductStock}
            onBackToStore={() => setActiveView('store')}
            onAddNewProduct={handleAddNewProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddCoupon={handleAddCoupon}
            onToggleCoupon={handleToggleCoupon}
            onDeleteCoupon={handleDeleteCoupon}
          />
        ) : (
          <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Acesso Restrito ao Gestor Master</h2>
              <p className="text-xs text-slate-500">
                A área administrativa é estritamente confidencial. Revendedores e clientes comuns não possuem permissão para visualizá-la.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setActiveView('store')}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Voltar à Loja
                </button>
                <button
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Autenticar Admin
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* VIEW: RESELLER PORTAL */}
      {activeView === 'reseller' && (
        <ResellerPortal
          orders={orders}
          products={products}
          currentUser={currentUser}
          onReorder={handleReorder}
          onBackToStore={() => setActiveView('store')}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenTrackingModal={handleOpenTracking}
          onBuyBatch={handleResellerBatchPurchase}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onUpdateUserProfile={handleUpdateUserProfile}
        />
      )}

      {/* Cart Drawer with Coupon Integration */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        productsMap={productsMap}
        coupons={coupons}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => setAppliedCoupon(c)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal with Mercado Pago PIX, Card, Boleto & Coupons */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        productsMap={productsMap}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Profit Calculator Modal for Resellers */}
      <ProfitCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onOpenCart={() => {
          setIsCalculatorOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Multi-Carrier Shipping Simulator Modal */}
      <ShippingSimulatorModal
        isOpen={isShippingSimulatorOpen}
        onClose={() => setIsShippingSimulatorOpen(false)}
      />

      {/* Universal Multicarrier Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        orders={orders}
        initialTrackingCode={trackingModalCode}
      />

      {/* B2B Reseller Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
          setActiveView('reseller');
        }}
      />

      {/* Exclusive Master Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAdminAuthOpen(false);
          setActiveView('admin');
        }}
      />

      {/* Floating Direct WhatsApp Support Button - Hidden in Admin View to not overlap panel */}
      {activeView !== 'admin' && (
        <a
          href="https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20pedidos%20no%20atacado."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group cursor-pointer"
          title="Fale com nosso Consultor de Atacado no WhatsApp (+55 61 9167-7676)"
        >
          <MessageCircle className="w-6 h-6 fill-slate-950" />
          <span className="hidden sm:inline font-black text-xs pr-1">
            WhatsApp: (61) 9167-7676
          </span>
        </a>
      )}

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={36} />
              <div className="font-black text-base text-slate-900 tracking-tight">
                MC STORE <span className="text-amber-500 font-extrabold">FUTEBOL</span>
              </div>
            </div>
            <p className="leading-relaxed">
              Distribuidora e importadora atacadista de camisas de futebol tailandesas 1:1 para revendedores e lojistas em todo o Brasil.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.instagram.com/mcstorefutebol12/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 font-black text-xs transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>@mcstorefutebol12</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Atendimento B2B</h4>
            <ul className="space-y-2">
              <li>Segunda a Sexta: 08h às 19h</li>
              <li>Sábado: 09h às 14h</li>
              <li>
                <a 
                  href="https://wa.me/556191677676" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: +55 (61) 9167-7676</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/mcstorefutebol12/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-pink-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram: @mcstorefutebol12</span>
                </a>
              </li>
              <li>E-mail: atacado@mcstorefutebol.com.br</li>
              <li>Brasília - DF • Distribuição Nacional</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Logística & Entregas</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setIsShippingSimulatorOpen(true)}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Simulador de Frete Multitransportadoras</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenTracking()}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Rastreio de Pedidos em Tempo Real</span>
                </button>
              </li>
              <li>Correios (SEDEX / PAC), Jadlog, Loggi e Azul Cargo</li>
              <li>30+ peças: <strong className="text-emerald-700 font-black">Frete Grátis</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider">Segurança & Pagamentos</h4>
            <p className="leading-relaxed mb-3">
              Processamento seguro via Mercado Pago com Pix instantâneo, Cartão de Crédito em até 12x ou Boleto Bancário.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-700">Conexão 256-bit SSL Criptografada</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>© 2026 MC Store Futebol Atacado B2B. Todos os direitos reservados. CNPJ: 45.892.123/0001-44</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (currentUser?.role === 'ADMIN') {
                  setActiveView('admin');
                } else {
                  setIsAdminAuthOpen(true);
                }
              }}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 font-mono text-[10px] cursor-pointer"
              title="Acesso restrito à gestão interna da MC Store"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Gestão Interna</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
