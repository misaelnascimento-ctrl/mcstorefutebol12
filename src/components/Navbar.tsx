import React, { useState } from 'react';
import { Product, AuthUser } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  ShoppingCart, 
  Search, 
  User as UserIcon, 
  ShieldCheck, 
  Calculator, 
  Star, 
  Truck, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  X, 
  Store,
  Settings,
  MapPin,
  Menu,
  Flame,
  Globe,
  Award,
  History,
  Wind,
  Layers,
  MessageCircle,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeView: 'store' | 'product-detail' | 'admin' | 'reseller';
  onNavigate: (view: 'store' | 'product-detail' | 'admin' | 'reseller') => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdminAuth: () => void;
  onLogout: () => void;
  onOpenCalculator: () => void;
  onOpenShippingSimulator: () => void;
  onScrollToReviews: () => void;
  onOpenTrackingModal: (code?: string) => void;
}

interface CategoryInfo {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  badgeColor?: string;
  iconBg: string;
  iconColor: string;
}

const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'Todos',
    name: 'Todos os Mantos',
    shortName: 'Todos',
    icon: Layers,
    description: 'Catálogo geral com mais de 150 modelos a pronta-entrega',
    badge: '150+ modelos',
    badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-800'
  },
  {
    id: 'Lançamentos',
    name: 'Lançamentos 2024/25',
    shortName: 'Lançamentos',
    icon: Flame,
    description: 'Novos uniformes da temporada e estreias mundiais',
    badge: 'Novo',
    badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 'Times Brasileiros',
    name: 'Times Brasileiros',
    shortName: 'Brasileirão',
    icon: ShieldCheck,
    description: 'Flamengo, Palmeiras, Corinthians, São Paulo, Grêmio, etc.',
    badge: 'Nacional',
    badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700'
  },
  {
    id: 'Times Europeus',
    name: 'Times Europeus',
    shortName: 'Europeus',
    icon: Globe,
    description: 'Real Madrid, Barcelona, Man City, Bayern, PSG, Arsenal...',
    badge: 'Champions',
    badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200 font-bold',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700'
  },
  {
    id: 'Seleções',
    name: 'Seleções Mundiais',
    shortName: 'Seleções',
    icon: Award,
    description: 'Brasil, Argentina, França, Portugal, Alemanha, Itália...',
    badge: 'Mundial',
    badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200 font-bold',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700'
  },
  {
    id: 'Retrô',
    name: 'Retrô & Históricas',
    shortName: 'Retrô',
    icon: History,
    description: 'Mantos clássicos dos anos 90 e 2000 que marcaram história',
    badge: 'Clássicos',
    badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700'
  },
  {
    id: 'Corta-Ventos',
    name: 'Corta-Ventos & Agasalhos',
    shortName: 'Corta-Ventos',
    icon: Wind,
    description: 'Linha inverno e treino impermeável com forro térmico',
    badge: 'Inverno',
    badgeColor: 'bg-sky-100 text-sky-900 border border-sky-200 font-bold',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700'
  },
];

export function Navbar({
  currentCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  activeView,
  onNavigate,
  products,
  onSelectProduct,
  currentUser,
  onOpenAuth,
  onOpenAdminAuth,
  onLogout,
  onOpenCalculator,
  onOpenShippingSimulator,
  onScrollToReviews,
  onOpenTrackingModal,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Autocomplete search filtered results
  const searchResults = searchQuery.trim() === '' ? [] : products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  const handleSelectCategoryAndClose = (catId: string) => {
    onSelectCategory(catId);
    setIsMobileDrawerOpen(false);
    if (activeView !== 'store') {
      onNavigate('store');
    }
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Alert (Mobile Responsive) */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold whitespace-nowrap">
              <Truck className="w-3.5 h-3.5" /> FRETE GRÁTIS
            </span>
            <span className="hidden sm:inline text-slate-300 whitespace-nowrap">
              a partir de 30 peças para todo o Brasil (Jadlog / Correios)
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-slate-300 text-[11px] flex-shrink-0">
            {/* Quick Track Link */}
            <button
              onClick={() => onOpenTrackingModal()}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer text-slate-300 whitespace-nowrap"
            >
              <Truck className="w-3 h-3 text-emerald-400" />
              <span>Rastreio</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            {/* Shipping Simulator Link */}
            <button
              onClick={onOpenShippingSimulator}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer text-slate-300 whitespace-nowrap"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Calcular Frete</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <button
              onClick={onScrollToReviews}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="hidden xs:inline">4.9/5 (1.280+ Reviews)</span>
              <span className="xs:hidden">4.9/5</span>
            </button>

            <span className="text-slate-600 hidden md:inline">|</span>

            <button
              onClick={onOpenCalculator}
              className="hover:text-emerald-400 flex items-center gap-1 font-bold text-emerald-400 transition-colors cursor-pointer hidden md:flex whitespace-nowrap"
            >
              <Calculator className="w-3 h-3" />
              <span>Simulador de Lucro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Mobile Drawer Trigger Button + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Button for Mobile Lateral Drawer */}
            <button
              id="btn-open-mobile-categories"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-xs"
              aria-label="Abrir Menu de Categorias Lateral"
              title="Abrir Menu e Categorias"
            >
              <Menu className="w-5 h-5 text-slate-900" />
              <span className="hidden xs:inline text-xs font-black text-slate-900 uppercase">
                Categorias
              </span>
            </button>

            {/* Brand Logo */}
            <button
              id="brand-logo"
              onClick={() => onNavigate('store')}
              className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer"
            >
              <div className="group-hover:scale-105 transition-transform drop-shadow-md">
                <BrandLogo size={40} className="sm:w-[46px] sm:h-[46px]" />
              </div>
              <div>
                <div className="font-black text-base sm:text-xl text-slate-900 tracking-tight leading-none flex items-center gap-1">
                  MC STORE <span className="text-amber-500 font-extrabold">FUTEBOL</span>
                </div>
                <div className="text-[9px] sm:text-[11px] font-black text-slate-400 tracking-wider uppercase mt-0.5">
                  DISTRIBUIDORA B2B 1:1
                </div>
              </div>
            </button>
          </div>

          {/* Search Box with Autocomplete Dropdown (Desktop & Tablets) */}
          <div className="flex-1 max-w-md hidden md:block relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por time, camisa, clube ou retrô..."
                className="w-full pl-10 pr-8 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                  {searchResults.length} produtos encontrados no atacado:
                </div>
                {searchResults.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 hover:bg-emerald-50/60 flex items-center gap-3 text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{prod.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {prod.category} • <strong className="text-emerald-600">R$ {prod.wholesaleTiers[1].unitPrice.toFixed(2)}/un</strong>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Links & Profile Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Shipping Simulator Nav Button (Desktop) */}
            <button
              id="btn-nav-shipping"
              onClick={onOpenShippingSimulator}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Simulador de Frete e Prazos"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Simular Frete</span>
            </button>

            {/* Reseller Portal Nav button */}
            <button
              id="btn-nav-reseller"
              onClick={() => {
                if (currentUser) {
                  onNavigate('reseller');
                } else {
                  onOpenAuth('login');
                }
              }}
              className={`px-2.5 sm:px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'reseller'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="hidden sm:inline">Área do Revendedor</span>
              <span className="sm:hidden text-[11px] font-bold">Revenda</span>
            </button>

            {/* User Account / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[11px] flex-shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-2.5">
                      <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-1">
                        {currentUser.role === 'ADMIN' ? '👑 Administrador Master' : `⭐ Nível ${currentUser.loyaltyTier || 'Ouro'}`}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('reseller');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-600" /> Meus Pedidos & Fotos HD
                      </button>

                      <button
                        onClick={() => {
                          onOpenTrackingModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5 text-blue-600" /> Rastreamento em Tempo Real
                      </button>

                      {currentUser.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-amber-800 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-amber-600" /> Gestão Master & Vendas
                        </button>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sair da Conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Entrar / Cadastrar</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}

            {/* Cart Drawer Trigger Button */}
            <button
              id="btn-open-cart-drawer"
              onClick={onOpenCart}
              className="relative p-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:scale-105 cursor-pointer flex items-center gap-1.5"
              title="Abrir Carrinho de Atacado"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-slate-950 text-white font-black text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar (Mobile & Desktop Horizontal Scrollable Quick Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {/* Quick Lateral Menu Trigger Button inside Categories Bar */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-black bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer transition-transform hover:scale-105"
            title="Ver todas as categorias na lista lateral"
          >
            <Menu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lista de Categorias</span>
          </button>

          {CATEGORIES_DATA.map((cat) => {
            const isActive = currentCategory === cat.id && activeView === 'store';
            return (
              <button
                key={cat.id}
                id={`btn-category-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleSelectCategoryAndClose(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs ring-1 ring-emerald-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.id === 'Lançamentos' && <Flame className="w-3 h-3 text-amber-500" />}
                {cat.id === 'Retrô' && <History className="w-3 h-3 text-amber-600" />}
                {cat.id === 'Times Brasileiros' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                {cat.id === 'Times Europeus' && <Globe className="w-3 h-3 text-blue-600" />}
                {cat.id === 'Seleções' && <Award className="w-3 h-3 text-purple-600" />}
                {cat.id === 'Corta-Ventos' && <Wind className="w-3 h-3 text-sky-600" />}
                <span>{cat.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE LATERAL DRAWER (Sidebar de Categorias em Lista) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
            />

            {/* Lateral Drawer Content (Slides from Left) */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[88vw] max-w-sm bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BrandLogo size={36} />
                    <div>
                      <div className="font-black text-sm text-slate-900 leading-tight">
                        MC STORE <span className="text-amber-500 font-extrabold">FUTEBOL</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Menu & Categorias
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Fechar Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar inside Drawer */}
                <div className="mt-3 relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar camisas e clubes..."
                    className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Autocomplete dropdown in drawer */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-md divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {searchResults.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod);
                          setSearchQuery('');
                          setIsMobileDrawerOpen(false);
                        }}
                        className="w-full p-2 hover:bg-emerald-50 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-md object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{prod.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {prod.category} • <span className="text-emerald-600 font-bold">R$ {prod.wholesaleTiers[1].unitPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Body: Categories List + Quick Links */}
              <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                
                {/* 1. Categorias em Lista Lateral */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      Categorias de Camisas
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      150+ modelos
                    </span>
                  </div>

                  <div className="space-y-1.5" id="mobile-categories-list">
                    {CATEGORIES_DATA.map((cat) => {
                      const isActive = currentCategory === cat.id && activeView === 'store';
                      const IconComponent = cat.icon;

                      return (
                        <button
                          key={cat.id}
                          id={`drawer-cat-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => handleSelectCategoryAndClose(cat.id)}
                          className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400 scale-[1.01]'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                              isActive ? 'bg-slate-950 text-emerald-400' : `${cat.iconBg} ${cat.iconColor}`
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-black truncate ${isActive ? 'text-slate-950' : 'text-slate-900'}`}>
                                  {cat.name}
                                </span>
                                {cat.badge && (
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold whitespace-nowrap ${
                                    isActive ? 'bg-slate-950 text-emerald-400' : cat.badgeColor
                                  }`}>
                                    {cat.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-slate-900/80 font-medium' : 'text-slate-500'}`}>
                                {cat.description}
                              </p>
                            </div>
                          </div>

                          <div className="pl-2 flex-shrink-0">
                            {isActive ? (
                              <Check className="w-4 h-4 text-slate-950 font-black" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Ferramentas e Atalhos Lojista */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
                    Ferramentas de Venda & Rastreio
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        onOpenCalculator();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calculator className="w-4 h-4 text-emerald-600" />
                        <span>Simulador de Lucro na Revenda</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        onOpenShippingSimulator();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>Calcular Frete & Prazo (CEP)</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        onOpenTrackingModal();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Rastrear Encomenda Multitransportadoras</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        onScrollToReviews();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Avaliações dos Clientes (4.9/5)</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <a
                      href="https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20pedidos%20no%20atacado."
                      target="_blank"
                      rel="noreferrer"
                      className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-between text-xs font-bold border border-emerald-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>WhatsApp Consultor B2B: (61) 9167-7676</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Footer: User Profile / Auth */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        {currentUser.role === 'ADMIN' ? '👑 Admin' : `⭐ ${currentUser.loyaltyTier || 'Ouro'}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onNavigate('reseller');
                        }}
                        className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Área Revendedor</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onLogout();
                        }}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sair</span>
                      </button>
                    </div>

                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Painel Master Admin</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Entrar ou Cadastrar Loja</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
