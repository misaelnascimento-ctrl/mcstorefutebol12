import React, { useState } from 'react';
import { Product, Size, CustomerReview } from '../types';
import { WholesaleGrid } from './WholesaleGrid';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Download, 
  Sparkles, 
  Share2, 
  Star, 
  Check, 
  HelpCircle, 
  Layers, 
  Ruler, 
  Flame,
  MessageCircle
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  currentCartTotalQuantity: number;
  onBack: () => void;
  onAddBatchToCart: (items: { size: Size; quantity: number }[]) => void;
}

export function ProductDetail({
  product,
  currentCartTotalQuantity,
  onBack,
  onAddBatchToCart,
}: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            id="btn-back-to-catalog"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo Completo (150+ modelos)</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Link Copiado!' : 'Compartilhar Manto'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Showcase & Downloads */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative bg-white rounded-3xl border border-slate-200 p-4 shadow-sm overflow-hidden group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover rounded-2xl group-hover:scale-102 transition-transform duration-300"
              />

              {product.badge && (
                <div className="absolute top-6 left-6 bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Reseller HD Marketing Material Download Box */}
            <div className="bg-white border border-emerald-500/30 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Download className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">
                  Fotos em Alta Resolução Sem Logo (White-Label)
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Baixe as fotos profissionais deste manto sem nenhuma marca d'água para postar diretamente no Instagram, Stories e catálogo do WhatsApp da sua loja.
              </p>
              <a
                href={product.unbrandedImages[0]}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                Baixar Pack de Fotos Neutras HD (ZIP/JPG)
              </a>
            </div>

            {/* Size Chart Trigger */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-black text-slate-900">Tabela de Medidas (cm)</span>
                </div>
                <button
                  onClick={() => setIsSizeChartOpen(!isSizeChartOpen)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  {isSizeChartOpen ? 'Ocultar' : 'Ver Medidas'}
                </button>
              </div>

              {isSizeChartOpen && (
                <div className="text-xs text-slate-600 border border-slate-200 rounded-xl overflow-hidden mt-3">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-2">Tamanho</th>
                        <th className="p-2">Largura</th>
                        <th className="p-2">Comprimento</th>
                        <th className="p-2">Estatura</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr><td className="p-2 font-bold text-slate-900">P</td><td className="p-2">50 cm</td><td className="p-2">70 cm</td><td className="p-2">1,65 - 1,72 m</td></tr>
                      <tr><td className="p-2 font-bold text-slate-900">M</td><td className="p-2">52 cm</td><td className="p-2">73 cm</td><td className="p-2">1,73 - 1,78 m</td></tr>
                      <tr><td className="p-2 font-bold text-slate-900">G</td><td className="p-2">55 cm</td><td className="p-2">76 cm</td><td className="p-2">1,79 - 1,85 m</td></tr>
                      <tr><td className="p-2 font-bold text-slate-900">GG</td><td className="p-2">58 cm</td><td className="p-2">79 cm</td><td className="p-2">1,86 - 1,92 m</td></tr>
                      <tr><td className="p-2 font-bold text-slate-900">XG</td><td className="p-2">61 cm</td><td className="p-2">82 cm</td><td className="p-2">1,93+ m</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Details & Wholesale Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {product.category} • {product.club}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating?.toFixed(1) || '4.9'}</span>
                  <span className="text-slate-400">({product.reviewsCount || 38} avaliações)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Badges of Authenticity */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Tecido 1:1 Tailandês</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Envio Imediato 24h</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Etiquetas e Tags Oficiais</span>
                </div>
              </div>
            </div>

            {/* Wholesale Grid Component */}
            <WholesaleGrid
              productId={product.id}
              productName={product.name}
              variants={product.variants}
              wholesaleTiers={product.wholesaleTiers}
              currentCartTotalQuantity={currentCartTotalQuantity}
              onAddBatchToCart={onAddBatchToCart}
            />

            {/* Specifications Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Ficha Técnica do Produto
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Composição:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{product.fabric}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Escudo / Patch:</span>
                  <p className="font-bold text-slate-800 mt-0.5">Bordado em Alta Definição / Termo 3D</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Temporada:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{product.season}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Origem / Qualidade:</span>
                  <p className="font-bold text-slate-800 mt-0.5">Importação Tailandesa Padrão 1:1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
