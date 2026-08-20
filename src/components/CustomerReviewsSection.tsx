import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquarePlus, 
  Sparkles, 
  Camera, 
  Store, 
  MapPin, 
  TrendingUp,
  X,
  Send,
  Play,
  Pause,
  Zap,
  MessageCircle,
  Instagram,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface CustomerReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview?: (newReview: CustomerReview) => void;
  onOpenCalculator?: () => void;
}

export function CustomerReviewsSection({
  reviews,
  onAddReview,
  onOpenCalculator,
}: CustomerReviewsSectionProps) {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [isFastSpeed, setIsFastSpeed] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);
  const [activeReviewDetail, setActiveReviewDetail] = useState<CustomerReview | null>(null);

  // Review Form state
  const [authorName, setAuthorName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [rating, setRating] = useState(5);
  const [orderVolume, setOrderVolume] = useState('Comprador de 30+ peças');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleLike = (id: string) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      authorName,
      storeName: storeName.trim() || 'Loja de Esportes',
      city: city.trim() || 'Brasília',
      state: state.trim() || 'DF',
      rating,
      orderVolume,
      comment,
      date: 'Hoje',
      verifiedPurchase: true,
      likes: 1,
      photos: photoUrl.trim() 
        ? [photoUrl.trim()]
        : ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80'],
    };

    if (onAddReview) {
      onAddReview(newRev);
    }
    setIsWriteModalOpen(false);
    setAuthorName('');
    setStoreName('');
    setCity('');
    setComment('');
    setPhotoUrl('');
  };

  // Split reviews into two dynamic tracks for rich multi-lane flowing ticker
  const midPoint = Math.ceil(reviews.length / 2);
  const track1Reviews = reviews.slice(0, midPoint);
  const track2Reviews = reviews.slice(midPoint);

  return (
    <section id="reviews-section" className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-y border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header with Average Score & Metrics */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AVALIAÇÕES AO VIVO DE REVENDEDORES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              O que os Lojistas e Revendedores dizem
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Mais de <strong>1.450 revendedores e lojistas ativos</strong> em todo o Brasil abastecem seus estoques de mantos com a MC Store Futebol.
            </p>
            
            {/* Direct Social Links */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/mcstorefutebol12/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-pink-200 text-pink-700 text-xs font-black transition-transform hover:scale-105"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>@mcstorefutebol12</span>
              </a>

              <a
                href="https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Vi%20as%20avalia%C3%A7%C3%B5es%20dos%20lojistas%20e%20quero%20montar%20meu%20pedido%20no%20atacado."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black transition-transform hover:scale-105"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: +55 (61) 9167-7676</span>
              </a>
            </div>
          </div>

          {/* Rating Big Stat */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="text-center">
              <div className="text-5xl font-black text-slate-900">4.9</div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-[11px] font-bold text-slate-500 mt-1">
                Baseado em 1.280+ avaliações
              </div>
            </div>

            <div className="h-12 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong>99.4%</strong> de satisfação com o tecido 1:1</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span><strong>98.1%</strong> de taxa de recompra</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>Despacho em até <strong>24 horas</strong></span>
              </div>
            </div>

            <button
              id="btn-open-write-review"
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Deixar Avaliação
            </button>
          </div>
        </div>

        {/* 🌟 AUTO-SCROLLING REAL-TIME LIVE PASSING TICKER TRACK */}
        <div className="space-y-4 pt-2">
          {/* Ticker Control Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wider">
                  Depoimentos Passando em Tempo Real ({reviews.length} Avaliações)
                </span>
                <span className="hidden md:inline-block text-[11px] text-slate-500 ml-2 font-medium">
                  • Passe o mouse para pausar ou clique na foto para ampliar
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFastSpeed(!isFastSpeed)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                  isFastSpeed 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Alternar velocidade da animação"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>{isFastSpeed ? 'Velocidade Rápida' : 'Velocidade Normal'}</span>
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isPaused 
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isPaused ? 'Continuar animação' : 'Pausar animação'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-slate-600" />}
                <span>{isPaused ? 'Rodar' : 'Pausar'}</span>
              </button>
            </div>
          </div>

          {/* Continuous Animated Track 1 (Going Left) */}
          <div className="marquee-container overflow-hidden py-1 relative">
            <div 
              className={`${
                isFastSpeed ? 'animate-marquee-infinite-fast' : 'animate-marquee-infinite'
              } ${isPaused ? 'marquee-paused' : ''} flex gap-4`}
            >
              {/* Duplicated 3x to ensure flawless infinite looping */}
              {[...track1Reviews, ...track1Reviews, ...track1Reviews].map((review, idx) => {
                const isLiked = likedReviews[review.id];
                const currentLikes = review.likes + (isLiked ? 1 : 0);

                return (
                  <div
                    key={`track1-${review.id}-${idx}`}
                    className="w-[320px] sm:w-[360px] bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between flex-shrink-0 cursor-default"
                  >
                    <div className="space-y-3">
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                            {review.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                              <span>{review.authorName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                              <span>{review.storeName}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700">{review.city}/{review.state}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Volume / Product Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                          📦 {review.orderVolume}
                        </span>
                        {review.productName && (
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                            {review.productName}
                          </span>
                        )}
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-4 italic">
                        "{review.comment}"
                      </p>

                      {/* Attached Customer Real Photos */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {review.photos.map((photo, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhotoModal(photo);
                              }}
                              className="relative group/photo rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-500 shadow-xs cursor-pointer"
                              title="Clique para ampliar a foto do manto recebido"
                            >
                              <img
                                src={photo}
                                alt="Manto recebido pelo revendedor"
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 object-cover group-hover/photo:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                🔍
                              </div>
                            </button>
                          ))}
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <Camera className="w-3 h-3" /> Foto Real
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card bottom */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-[10px] text-slate-400">
                      <span className="font-medium">{review.date}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(review.id);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isLiked
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{currentLikes} curtidas</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continuous Animated Track 2 (Going Reverse/Right) */}
          <div className="marquee-container overflow-hidden py-1 relative">
            <div 
              className={`${
                isFastSpeed ? 'animate-marquee-infinite-fast' : 'animate-marquee-infinite-reverse'
              } ${isPaused ? 'marquee-paused' : ''} flex gap-4`}
            >
              {/* Duplicated 3x */}
              {[...track2Reviews, ...track2Reviews, ...track2Reviews].map((review, idx) => {
                const isLiked = likedReviews[review.id];
                const currentLikes = review.likes + (isLiked ? 1 : 0);

                return (
                  <div
                    key={`track2-${review.id}-${idx}`}
                    className="w-[320px] sm:w-[360px] bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between flex-shrink-0 cursor-default"
                  >
                    <div className="space-y-3">
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xs shadow-xs">
                            {review.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                              <span>{review.authorName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                              <span>{review.storeName}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700">{review.city}/{review.state}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Volume / Product Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                          📦 {review.orderVolume}
                        </span>
                        {review.productName && (
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                            {review.productName}
                          </span>
                        )}
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-4 italic">
                        "{review.comment}"
                      </p>

                      {/* Attached Customer Real Photos */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {review.photos.map((photo, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhotoModal(photo);
                              }}
                              className="relative group/photo rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-500 shadow-xs cursor-pointer"
                              title="Clique para ampliar a foto do manto recebido"
                            >
                              <img
                                src={photo}
                                alt="Manto recebido pelo revendedor"
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 object-cover group-hover/photo:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                🔍
                              </div>
                            </button>
                          ))}
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <Camera className="w-3 h-3" /> Foto Real
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card bottom */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-[10px] text-slate-400">
                      <span className="font-medium">{review.date}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(review.id);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isLiked
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{currentLikes} curtidas</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wholesale Confidence Call to Action Footer Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-black text-xs uppercase tracking-wider text-emerald-400">
                Garantia de Qualidade Padrão Tailandês 1:1
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Faça como centenas de lojistas: Lucre mais de 150%
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pedidos despachados em até 24h com código de rastreamento e frete grátis a partir de 30 peças.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-colors cursor-pointer"
              >
                Simular Lucro
              </button>
            )}

            <a
              href="https://wa.me/556191677676?text=Ol%C3%A1%20MC%20Store!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20pedidos%20no%20atacado."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Chamar Consultor (+55 61 9167-7676)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox / Photo Zoom Modal */}
      {selectedPhotoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div 
            className="bg-white rounded-3xl p-3 max-w-2xl w-full shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhotoModal}
              alt="Foto real enviada por cliente"
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="p-3 text-center text-xs font-bold text-slate-700">
              📸 Foto Real de Manto Tailandês 1:1 Recebido por Lojista Parceiro MC Store
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Avaliação de Revendedor Verificado
              </div>
              <h3 className="text-xl font-black tracking-tight">Deixe sua Opinião sobre o Lote</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Compartilhe com outros lojistas sua experiência com o tecido, caimento e prazo de entrega.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Matheus Lima"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome da sua Loja/Página</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Manto Store SP"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Brasília"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado (UF)</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    {['DF', 'SP', 'RJ', 'MG', 'GO', 'PR', 'BA', 'RS', 'CE', 'PE', 'SC', 'ES', 'AM', 'PA', 'MT', 'MS', 'MA', 'RN', 'PB', 'AL', 'SE', 'PI', 'TO', 'RO', 'AC', 'AP', 'RR'].map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Volume do Pedido</label>
                  <select
                    value={orderVolume}
                    onChange={(e) => setOrderVolume(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Comprador de 10 a 29 peças">10 a 29 peças</option>
                    <option value="Comprador de 30 a 59 peças">30 a 59 peças (Frete Grátis)</option>
                    <option value="Comprador de 60 a 99 peças">60 a 99 peças</option>
                    <option value="Comprador de 100+ peças">100+ peças (Grade Master)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nota de Satisfação</label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seu Depoimento / Comentário *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte o que achou da costura, escudo bordado, tecido 1:1 e velocidade de entrega..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link de Foto do Manto (Opcional)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://... (ou deixe vazio para foto de verificação padrão)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar Avaliação no Site</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
export default CustomerReviewsSection;
