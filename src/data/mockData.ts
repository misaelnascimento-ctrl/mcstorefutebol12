import { Product, Order, B2BClient, CustomerReview, PurchaseToastNotification, AuthUser } from '../types';

export const DEFAULT_WHOLESALE_TIERS = [
  { minQuantity: 1, maxQuantity: 9, unitPrice: 60 },
  { minQuantity: 10, maxQuantity: 29, unitPrice: 50 },
  { minQuantity: 30, unitPrice: 45 },
];

export const MOCK_AUTH_USERS: Record<string, AuthUser & { passwordHash: string }> = {
  'admin@mcstore.com.br': {
    id: 'user-admin-1',
    name: 'Carlos Mendes (Admin Master)',
    email: 'admin@mcstore.com.br',
    role: 'ADMIN',
    tradeName: 'MC Store Matriz SP',
    cnpjCpf: '12.345.678/0001-90',
    phone: '(11) 98765-4321',
    city: 'São Paulo',
    state: 'SP',
    passwordHash: 'admin123',
    loyaltyTier: 'Diamante',
    ordersCount: 450,
    totalSpent: 389400.00
  },
  'revendedor@futstore.com.br': {
    id: 'user-reseller-1',
    name: 'Lucas Martins',
    email: 'revendedor@futstore.com.br',
    role: 'RESELLER',
    tradeName: 'FutStore Campinas - Artigos Esportivos',
    cnpjCpf: '45.892.123/0001-44',
    phone: '(19) 99874-1234',
    postalCode: '13010-001',
    street: 'Av. Francisco Glicério',
    number: '1420',
    neighborhood: 'Centro',
    city: 'Campinas',
    state: 'SP',
    passwordHash: 'loja123',
    loyaltyTier: 'Ouro',
    ordersCount: 14,
    totalSpent: 34500.00
  }
};

// Generates high quality 150 items catalog systematically
const CLUBS_DATA = [
  // Times Brasileiros (Aproximadamente 50 modelos)
  { club: 'Flamengo', category: 'Times Brasileiros', variations: ['I Titular 24/25 Rubro-Negro', 'II Reserva 24/25 Branca Wave', 'III Especial 24/25 Grafite Ouro', 'Treino Pré-Jogo 24/25 Vermelha', 'Edição Libertadores Ed. Limitada'] },
  { club: 'Palmeiras', category: 'Times Brasileiros', variations: ['I Titular 24/25 Verde Dourada', 'II Reserva 24/25 Branca Clássica', 'III Especial 24/25 Dourada Comemorativa', 'Treino 24/25 Verde Limão'] },
  { club: 'Corinthians', category: 'Times Brasileiros', variations: ['I Titular 24/25 Branca Degradê', 'II Reserva 24/25 All Black Antirracista', 'III Especial 24/25 Amarela Democracia', 'Aquecimento Pré-Jogo 24/25'] },
  { club: 'São Paulo', category: 'Times Brasileiros', variations: ['I Titular 24/25 Branca Tradicional Tricolor', 'II Listrada 24/25 Vermelha e Preta', 'III Especial 24/25 Preta e Vermelha Ouro'] },
  { club: 'Vasco da Gama', category: 'Times Brasileiros', variations: ['I Titular 24/25 Preta Faixa Branca', 'II Reserva 24/25 Branca Faixa Preta', 'III Especial 24/25 Camisas Negras'] },
  { club: 'Santos', category: 'Times Brasileiros', variations: ['I Titular 24/25 Branca Clássica Alvinegra', 'II Listrada 24/25 Preta e Branca', 'III Especial 24/25 Dourada Rei Pelé'] },
  { club: 'Grêmio', category: 'Times Brasileiros', variations: ['I Titular 24/25 Tricolor Celeste', 'II Reserva 24/25 Branca', 'III Especial 24/25 Preta Charrua'] },
  { club: 'Internacional', category: 'Times Brasileiros', variations: ['I Titular 24/25 Vermelha Colorado', 'II Reserva 24/25 Branca Faixa Vermelha', 'III Especial 24/25 Cinza e Verde'] },
  { club: 'Cruzeiro', category: 'Times Brasileiros', variations: ['I Titular 24/25 Azul Celeste Cabuloso', 'II Reserva 24/25 Branca Clássica', 'III Especial 24/25 Amarela e Azul'] },
  { club: 'Atlético-MG', category: 'Times Brasileiros', variations: ['I Titular 24/25 Alvinegra Listrada Galo', 'II Reserva 24/25 Branca Manto da Massa', 'III Especial 24/25 Preta Fosca'] },
  { club: 'Botafogo', category: 'Times Brasileiros', variations: ['I Titular 24/25 Alvinegra Glorioso', 'II Reserva 24/25 Branca Estrela Solitária', 'III Especial 24/25 Grafite Noturno'] },
  { club: 'Fluminense', category: 'Times Brasileiros', variations: ['I Titular 24/25 Tricolor Carioca', 'II Reserva 24/25 Branca Faixa Diagonal', 'III Especial 24/25 Verde Esperança'] },
  { club: 'Bahia', category: 'Times Brasileiros', variations: ['I Titular 24/25 Branca Esquadrão', 'II Listrada Tricolor 24/25 Azul e Vermelha', 'III Especial Salvador 24/25'] },
  { club: 'Fortaleza', category: 'Times Brasileiros', variations: ['I Titular 24/25 Tradição Tricolor', 'II Glória Branca 24/25', 'III Especial Jangurussu'] },
  { club: 'Athletico-PR', category: 'Times Brasileiros', variations: ['I Titular 24/25 Rubro-Negro Diagonal', 'II Reserva 24/25 Branca Furacão', 'III Especial Azul Celeste'] },
  { club: 'Sport Recife', category: 'Times Brasileiros', variations: ['I Titular 24/25 Rubro-Negro Leão', 'II Reserva 24/25 Amarela Ouro'] },
  { club: 'Ceará', category: 'Times Brasileiros', variations: ['I Titular 24/25 Alvinegro Vozão', 'II Reserva 24/25 Branca Clássica'] },
  { club: 'Vitória', category: 'Times Brasileiros', variations: ['I Titular 24/25 Rubro-Negro Leão da Barra', 'II Reserva 24/25 Branca'] },
  { club: 'Coritiba', category: 'Times Brasileiros', variations: ['I Titular 24/25 Branca Faixas Verdes Coxa', 'II Alma Guerreira 24/25'] },

  // Times Europeus (Aproximadamente 45 modelos)
  { club: 'Real Madrid', category: 'Times Europeus', variations: ['Home 24/25 Branca Pata de Galo', 'Away 24/25 Laranja Vibrante', 'Third 24/25 Grafite Roxo Retrô', 'Treino UCL 24/25 Pré-Jogo'] },
  { club: 'Barcelona', category: 'Times Europeus', variations: ['Home 24/25 125 Anos Meio a Meio', 'Away 24/25 All Black Swoosh Gradiente', 'Third 24/25 Verde Volt Neon'] },
  { club: 'Manchester City', category: 'Times Europeus', variations: ['Home 24/25 Azul Céu 0161 Dial Code', 'Away 24/25 Listrada Amarela e Preta Retrô 1999', 'Third 24/25 Bordô Vinho Ouro'] },
  { club: 'Arsenal', category: 'Times Europeus', variations: ['Home 24/25 Vermelha e Branca Canhão', 'Away 24/25 Preta e Verde Africana', 'Third 24/25 Azul Claro Lilás'] },
  { club: 'Liverpool', category: 'Times Europeus', variations: ['Home 24/25 Vermelha Gola Listrada Retrô 1984', 'Away 24/25 Grafite Verde Menta', 'Third 24/25 Branca e Vermelha'] },
  { club: 'Chelsea', category: 'Times Europeus', variations: ['Home 24/25 Azul Chamas Líquidas', 'Away 24/25 Bege Dourada Laranja', 'Third 24/25 Preta e Rosa Cyber'] },
  { club: 'Manchester United', category: 'Times Europeus', variations: ['Home 24/25 Vermelha Degradê Diabos Vermelhos', 'Away 24/25 Azul Real Gola Polo', 'Third 24/25 Branca com Faixas'] },
  { club: 'Bayern de Munique', category: 'Times Europeus', variations: ['Home 24/25 Vermelha Três Tons Red & Crimson', 'Away 24/25 Preta Monumento Bavária', 'Third 24/25 Bege Clássica Retrô'] },
  { club: 'Borussia Dortmund', category: 'Times Europeus', variations: ['Home 24/25 Amarela Listrada BVB', 'Away 24/25 Preta e Amarela Grafite', 'Cup Home UCL 24/25'] },
  { club: 'PSG', category: 'Times Europeus', variations: ['Home 24/25 Azul Faixa Pincelada Hechter', 'Away 24/25 Branca Torre Eiffel', 'Third 24/25 Jordan Rosa e Preto', 'Fourth 24/25 Jordan Cinza'] },
  { club: 'Juventus', category: 'Times Europeus', variations: ['Home 24/25 Alvinegra Cratera Lunar', 'Away 24/25 Amarela e Rosa Cósmica', 'Third 24/25 Azul Marinho e Dourado'] },
  { club: 'Inter de Milão', category: 'Times Europeus', variations: ['Home 24/25 Nerazzurri Duas Estrelas Listrada', 'Away 24/25 Branca e Azul Celeste Arquitetura', 'Third 24/25 Amarela Ouro'] },
  { club: 'AC Milan', category: 'Times Europeus', variations: ['Home 24/25 Rossonero Genoma Listras', 'Away 24/25 Branca Polo Clássica', 'Third 24/25 Cinza e Menta'] },
  { club: 'Atlético de Madrid', category: 'Times Europeus', variations: ['Home 24/25 Vermelha e Branca Linhas Azuis', 'Away 24/25 Bege Ouro'] },
  { club: 'Tottenham', category: 'Times Europeus', variations: ['Home 24/25 Branca e Azul Marinho Spurs', 'Away 24/25 Azul Listrada Retrô'] },
  { club: 'Sporting Lisboa', category: 'Times Europeus', variations: ['Home 24/25 Verde e Branca Leões', 'Special CR7 Black Gold'] },
  { club: 'Benfica', category: 'Times Europeus', variations: ['Home 24/25 Vermelha Águia Vitória', 'Away 24/25 Preta e Vermelha'] },

  // Seleções Internacionais (Aproximadamente 25 modelos)
  { club: 'Brasil', category: 'Seleções', variations: ['Home 2024 Amarela Canarinho Copa América', 'Away 2024 Azul Onda e Fauna', 'Pré-Jogo 2024 Amarela e Verde Floresta', 'Goleiro 2024 Preta'] },
  { club: 'Argentina', category: 'Seleções', variations: ['Home 2024 Alviceleste Três Estrelas Ouro', 'Away 2024 Azul Real Detalhes Ouro', 'Retrô 1994 Azul Maradona'] },
  { club: 'França', category: 'Seleções', variations: ['Home 2024 Azul Real Galo Gigante Ouro', 'Away 2024 Branca com Listras Finas Azuis e Vermelhas'] },
  { club: 'Alemanha', category: 'Seleções', variations: ['Home 2024 Branca Degradê Bandeira Nacional', 'Away 2024 Rosa Magenta e Roxo Futurista'] },
  { club: 'Portugal', category: 'Seleções', variations: ['Home 2024 Vermelha e Verde Quinas', 'Away 2024 Branca Azulejo Português'] },
  { club: 'Inglaterra', category: 'Seleções', variations: ['Home 2024 Branca Três Leões Retrô', 'Away 2024 Roxo Imperial com Detalhes Ouro'] },
  { club: 'Espanha', category: 'Seleções', variations: ['Home 2024 Vermelha Cravo Fúria Campeã Euro', 'Away 2024 Amarela Claro Menta'] },
  { club: 'Itália', category: 'Seleções', variations: ['Home 2024 Azul Azzurra Três Listras Tricolore', 'Away 2024 Branca com Mármore'] },
  { club: 'Holanda', category: 'Seleções', variations: ['Home 2024 Laranja Mecânica Real', 'Away 2024 Azul Escuro Padrão Geométrico'] },
  { club: 'Japão', category: 'Seleções', variations: ['Home 2024 Azul Chamas Azuis Y-3 Yamamoto', 'Away 2024 Branca Chamas Vermelhas Y-3'] },
  { club: 'Uruguai', category: 'Seleções', variations: ['Home 2024 Celeste Quatro Estrelas', 'Away 2024 Branca'] },

  // Retrô Clássicas (Aproximadamente 20 modelos)
  { club: 'Brasil Retrô', category: 'Retrô', variations: ['1970 Copa do Mundo Tri Tricampeão Pelé', '1994 Tetra Romário e Bebeto', '2002 Penta Ronaldo Fenômeno e Rivaldo', '1982 Seleção Mágica Zico e Sócrates'] },
  { club: 'Flamengo Retrô', category: 'Retrô', variations: ['1981 Mundial de Clubes Campeão Zico', '1992 Pentacampeonato Brasileiro', '2001 Tri Carioca Gol do Pet'] },
  { club: 'Vasco Retrô', category: 'Retrô', variations: ['1998 Centenário Libertadores Donizete e Luizão', '2000 Mercosul Virada Histórica Romário'] },
  { club: 'Corinthians Retrô', category: 'Retrô', variations: ['2000 Mundial de Clubes FIFA Edilson', '1990 Primeiro Brasileirão Neto'] },
  { club: 'São Paulo Retrô', category: 'Retrô', variations: ['1992/1993 Bicampeão Mundial Telê Raí e Muller', '2005 Tri Mundial Rogério Ceni'] },
  { club: 'Palmeiras Retrô', category: 'Retrô', variations: ['1999 Campeão Libertadores Marcos e Alex', '1993 Parmalat Edmundo e Evair'] },
  { club: 'Santos Retrô', category: 'Retrô', variations: ['1962 Bicampeão Mundial Pelé e Coutinho', '2011 Tri Libertadores Neymar Jr'] },
  { club: 'Barcelona Retrô', category: 'Retrô', variations: ['2008/2009 Sextete Messi, Ronaldinho e Eto\'o', '1996 Ronaldo Fenômeno El Clássico'] },
  { club: 'Real Madrid Retrô', category: 'Retrô', variations: ['2002 La Novena Voleio Histórico Zidane', '2017/2018 Triplo UCL CR7 7'] },
  { club: 'Milan Retrô', category: 'Retrô', variations: ['2006/2007 Campeão da Champions Kaká Ballon d\'Or', '1989 Maldini, Gullit e Van Basten'] },
  { club: 'Manchester United Retrô', category: 'Retrô', variations: ['2007/2008 Campeão da Champions Cristiano Ronaldo 7', '1999 Treble Beckham e Cantona'] },

  // Corta-Ventos / Agasalhos (Aproximadamente 10 modelos)
  { club: 'Flamengo', category: 'Corta-Ventos', variations: ['Corta-Vento Impermeável 24/25 All Black', 'Jaqueta Windbreaker Rubro-Negro Capuz'] },
  { club: 'Real Madrid', category: 'Corta-Ventos', variations: ['Corta-Vento Champions League 24/25 Branco e Ouro', 'Jaqueta Corta-Vento Preto Grafite'] },
  { club: 'PSG', category: 'Corta-Ventos', variations: ['Corta-Vento Jordan Paris 24/25 Preto e Rosa', 'Jaqueta Corta-Vento Azul Hechter'] },
  { club: 'Manchester City', category: 'Corta-Ventos', variations: ['Corta-Vento Azul Celeste impermeável'] },
  { club: 'Palmeiras', category: 'Corta-Ventos', variations: ['Corta-Vento Verde Militar 24/25'] },
  { club: 'Corinthians', category: 'Corta-Ventos', variations: ['Corta-Vento Preto Fiel Torcedor 24/25'] },
  { club: 'Brasil', category: 'Corta-Ventos', variations: ['Corta-Vento Seleção Brasileira 2024 Azul e Amarelo'] },
];

const CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
];

function generate150Products(): Product[] {
  const productsList: Product[] = [];
  let count = 1;

  CLUBS_DATA.forEach((group) => {
    group.variations.forEach((varName) => {
      const isRetro = group.category === 'Retrô';
      const isWindbreaker = group.category === 'Corta-Ventos';
      const season = isRetro ? varName.split(' ')[0] : '2024/2025';
      const basePrice = isWindbreaker ? 189.90 : isRetro ? 169.90 : 159.90;
      
      const pStock = Math.floor(Math.random() * 40) + 15;
      const mStock = Math.floor(Math.random() * 80) + 30;
      const gStock = Math.floor(Math.random() * 90) + 35;
      const ggStock = Math.floor(Math.random() * 50) + 15;
      const xgStock = Math.floor(Math.random() * 25) + 5;

      const img1 = CURATED_IMAGES[(count - 1) % CURATED_IMAGES.length];
      const img2 = CURATED_IMAGES[count % CURATED_IMAGES.length];

      const slug = `camisa-${group.club.toLowerCase().replace(/[\s/]/g, '-')}-${varName.toLowerCase().replace(/[\s/]/g, '-').replace(/[^\w-]/g, '')}`;

      const badges = ['Mais Vendido', 'Lançamento 24/25', 'Alta Procura', 'Pronta Entrega', 'Top Revenda'];
      const badge = count <= 12 ? (count % 2 === 0 ? 'Mais Vendido' : 'Lançamento 24/25') : (count % 7 === 0 ? badges[count % badges.length] : undefined);

      productsList.push({
        id: `prod-${count}`,
        name: isWindbreaker 
          ? `${varName} - ${group.club}` 
          : `Camisa ${group.club} ${varName}`,
        slug,
        club: group.club,
        category: group.category as any,
        season,
        basePrice,
        wholesaleTiers: DEFAULT_WHOLESALE_TIERS,
        description: `Manto ${group.club} ${varName}. Confeccionada em tecido de alta tecnologia tailandês 1:1, com escudo termocolado em relevo 3D de alta definição, costura reforçada com acabamento idêntico ao de jogo e respirabilidade total para máxima durabilidade.`,
        fabric: isWindbreaker ? 'Microfibra Impermeável Resinada com Forro Respirável' : '100% Poliéster DryFit Tailandês 1:1',
        images: [img1, img2],
        unbrandedImages: [img1, img2],
        variants: [
          { id: `v${count}-p`, size: 'P', stock: pStock, sku: `${group.club.substring(0, 3).toUpperCase()}-${count}-P` },
          { id: `v${count}-m`, size: 'M', stock: mStock, sku: `${group.club.substring(0, 3).toUpperCase()}-${count}-M` },
          { id: `v${count}-g`, size: 'G', stock: gStock, sku: `${group.club.substring(0, 3).toUpperCase()}-${count}-G` },
          { id: `v${count}-gg`, size: 'GG', stock: ggStock, sku: `${group.club.substring(0, 3).toUpperCase()}-${count}-GG` },
          { id: `v${count}-xg`, size: 'XG', stock: xgStock, sku: `${group.club.substring(0, 3).toUpperCase()}-${count}-XG` },
        ],
        featured: count <= 15,
        badge,
        rating: 4.8 + ((count % 3) * 0.1),
        reviewsCount: Math.floor(Math.random() * 45) + 12,
      });

      count++;
    });
  });

  // If needed, supplement with additional models to ensure easily 150+
  while (productsList.length < 150) {
    const idx = count;
    const baseClub = CLUBS_DATA[idx % CLUBS_DATA.length];
    const cat = baseClub.category;
    const img = CURATED_IMAGES[idx % CURATED_IMAGES.length];
    
    productsList.push({
      id: `prod-${idx}`,
      name: `Camisa ${baseClub.club} Especial Torcedor Edição #${idx}`,
      slug: `camisa-${baseClub.club.toLowerCase().replace(/[\s/]/g, '-')}-edicao-especial-${idx}`,
      club: baseClub.club,
      category: cat as any,
      season: '2024/2025',
      basePrice: 159.90,
      wholesaleTiers: DEFAULT_WHOLESALE_TIERS,
      description: `Manto exclusivo ${baseClub.club} em tecido DryFit Tailandês 1:1, pronto para entrega e envio imediato no atacado com faturamento rápido.`,
      fabric: '100% Poliéster Tailandês 1:1 Respirável',
      images: [img],
      unbrandedImages: [img],
      variants: [
        { id: `v${idx}-p`, size: 'P', stock: 25, sku: `SPEC-${idx}-P` },
        { id: `v${idx}-m`, size: 'M', stock: 50, sku: `SPEC-${idx}-M` },
        { id: `v${idx}-g`, size: 'G', stock: 60, sku: `SPEC-${idx}-G` },
        { id: `v${idx}-gg`, size: 'GG', stock: 30, sku: `SPEC-${idx}-GG` },
        { id: `v${idx}-xg`, size: 'XG', stock: 15, sku: `SPEC-${idx}-XG` },
      ],
      featured: false,
      badge: 'Pronta Entrega',
      rating: 4.9,
      reviewsCount: 18,
    });
    count++;
  }

  return productsList;
}

export const PRODUCTS_DATA: Product[] = generate150Products();
export const MOCK_PRODUCTS: Product[] = PRODUCTS_DATA;

export const MOCK_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'Marcos Vinicius',
    storeName: 'Manto Sagrado Artigos',
    city: 'Belo Horizonte',
    state: 'MG',
    rating: 5,
    orderVolume: 'Comprador de 80 peças / mês',
    comment: 'Qualidade absurda das camisas! O bordado e o tecido 1:1 são perfeitos, os clientes da minha loja física na Savassi acharam impecável. Chegou em 48h aqui em BH muito bem embalado. Margem de lucro passou de 140%!',
    date: '18/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Flamengo I 24/25 Rubro-Negro',
    likes: 42,
    photos: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'rev-2',
    authorName: 'Juliana Ferreira',
    storeName: 'Boutique dos Campeões',
    city: 'Curitiba',
    state: 'PR',
    rating: 5,
    orderVolume: 'Compradora de 50 peças',
    comment: 'Comprei 50 peças misturadas de times europeus (Real Madrid, City, PSG) e seleções. Vendi todas em menos de 10 dias pelo Instagram usando as fotos sem logo que eles disponibilizam na área de revendedor. O pagamento via Pix com o QR code foi super rápido.',
    date: '15/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Real Madrid Home 24/25 Branca',
    likes: 38,
  },
  {
    id: 'rev-3',
    authorName: 'Gabriel Mendes',
    storeName: 'DF Sports Atacado',
    city: 'Brasília',
    state: 'DF',
    rating: 5,
    orderVolume: 'Comprador de 60 peças',
    comment: 'Atendimento nota 10 pelo WhatsApp direto de Brasília! As camisas chegam sempre com as tags oficiais, saquinho zip lock lacrado e cheirinho de novo. Meus clientes elogiam muito a precisão do tecido tailandês.',
    date: '14/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Real Madrid Home 24/25 Mbappé',
    likes: 35,
    photos: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'rev-4',
    authorName: 'Rodrigo Siqueira',
    storeName: 'Arena FutStore',
    city: 'Goiânia',
    state: 'GO',
    rating: 5,
    orderVolume: 'Comprador de 120 peças',
    comment: 'Melhor fornecedor de atacado de futebol do Brasil. Preço de R$ 45 acima de 30 peças é imbatível. A grade de pedido rápido facilitou muito fechar o pedido de tamanhos sem ter que ficar adicionando um por um.',
    date: '12/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Palmeiras I 24/25 Verde Dourada',
    likes: 29,
  },
  {
    id: 'rev-5',
    authorName: 'Bruno Castilho',
    storeName: 'Galeria do Manto',
    city: 'São Paulo',
    state: 'SP',
    rating: 5,
    orderVolume: 'Comprador de 150 peças / mês',
    comment: 'Peguei 150 mantos para abastecer minha banca no centro de SP. A linha de corta-ventos e retrôs vendeu em tempo recorde. Despacho na Jadlog no mesmo dia da compra, rastreio certinho.',
    date: '11/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Corinthians I 24/25 Branca',
    likes: 47,
    photos: [
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'rev-6',
    authorName: 'Thiago Nogueira',
    storeName: 'Camisas & Cia',
    city: 'Recife',
    state: 'PE',
    rating: 5,
    orderVolume: 'Comprador de 35 peças',
    comment: 'As camisas retrô de 1970 do Pelé e 1981 do Zico esgotaram em 3 dias na minha loja. A qualidade do tecido e das etiquetas oficiais é surreal. Recomprarei mais 60 peças essa semana.',
    date: '10/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Brasil Retrô 1970 Pelé',
    likes: 24,
  },
  {
    id: 'rev-7',
    authorName: 'Felipe Alencar',
    storeName: 'Sport Outlet RJ',
    city: 'Niterói',
    state: 'RJ',
    rating: 5,
    orderVolume: 'Comprador de 100 peças',
    comment: 'Nota 10 pro atendimento no WhatsApp e agilidade de rastreio. Código dos Correios enviado no mesmo dia útil da confirmação do Pix.',
    date: '07/08/2026',
    verifiedPurchase: true,
    likes: 19,
  },
  {
    id: 'rev-8',
    authorName: 'Amanda Rodrigues',
    storeName: 'Bahia Manto Store',
    city: 'Salvador',
    state: 'BA',
    rating: 5,
    orderVolume: 'Compradora de 40 peças',
    comment: 'Revendo pelo WhatsApp e Marketplace aqui em Salvador. Compro a R$ 45 no atacado e vendo a R$ 160 fácil. As fotos neutras que baixei no portal do revendedor aumentaram minhas vendas em mais de 200%!',
    date: '05/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa Bahia I 24/25 Tricolor',
    likes: 31,
    photos: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'rev-9',
    authorName: 'Lucas Martins',
    storeName: 'FutStore Campinas',
    city: 'Campinas',
    state: 'SP',
    rating: 5,
    orderVolume: 'Comprador de 90 peças',
    comment: 'Já é o meu quarto pedido com a MC Store. A padronização dos tamanhos P, M, G, GG e XG é excelente, não tive nenhuma reclamação de cliente sobre modelagem.',
    date: '03/08/2026',
    verifiedPurchase: true,
    productName: 'Camisa São Paulo I 24/25 Tricolor',
    likes: 27,
  },
  {
    id: 'rev-10',
    authorName: 'Leonardo Prado',
    storeName: 'Gaúcho Sports B2B',
    city: 'Porto Alegre',
    state: 'RS',
    rating: 5,
    orderVolume: 'Comprador de 45 peças',
    comment: 'Frete grátis funcionou perfeito acima de 30 peças. Envio muito bem protegido contra umidade e poeira. A camisa do Grêmio e do Inter vieram impecáveis.',
    date: '01/08/2026',
    verifiedPurchase: true,
    likes: 22,
  },
  {
    id: 'rev-11',
    authorName: 'Diego Silveira',
    storeName: 'Ceará Manto VIP',
    city: 'Fortaleza',
    state: 'CE',
    rating: 5,
    orderVolume: 'Comprador de 70 peças',
    comment: 'Os mantos da temporada 24/25 vieram idênticos aos de boutique de shopping. Patch de campeão da Champions League no braço perfeito. Recomendo de olhos fechados.',
    date: '29/07/2026',
    verifiedPurchase: true,
    productName: 'Camisa Real Madrid 24/25 Champions',
    likes: 33,
    photos: [
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'rev-12',
    authorName: 'Carlos Eduardo',
    storeName: 'Norte Gol Distribuidora',
    city: 'Manaus',
    state: 'AM',
    rating: 5,
    orderVolume: 'Comprador de 110 peças',
    comment: 'Mesmo aqui pro Norte o frete via Azul Cargo chegou rapidíssimo. Qualidade 1:1 legítima. Muito satisfeito com a parceria comercial!',
    date: '26/07/2026',
    verifiedPurchase: true,
    likes: 20,
  },
  {
    id: 'rev-13',
    authorName: 'Mariana Vasconcelos',
    storeName: 'Ilha Sports',
    city: 'Florianópolis',
    state: 'SC',
    rating: 5,
    orderVolume: 'Compradora de 30 peças',
    comment: 'Primeiro pedido feito com receio, mas fiquei maravilhada quando a caixa chegou. Costura dupla, tecido DryFit leve e fresco. Já montando pedido de 60 peças!',
    date: '24/07/2026',
    verifiedPurchase: true,
    likes: 18,
  },
  {
    id: 'rev-14',
    authorName: 'Renan Barbosa',
    storeName: 'Capixaba Futebol Clube',
    city: 'Vitória',
    state: 'ES',
    rating: 5,
    orderVolume: 'Comprador de 55 peças',
    comment: 'O simulador de lucro no site acertou em cheio: comprei a R$ 45 cada, revendi a R$ 150 e lucrei mais de R$ 5.700,00 no lote. Suporte rápido no WhatsApp.',
    date: '21/07/2026',
    verifiedPurchase: true,
    likes: 26,
  },
  {
    id: 'rev-15',
    authorName: 'Marcelo Tavares',
    storeName: 'Amazônia Mantos',
    city: 'Belém',
    state: 'PA',
    rating: 5,
    orderVolume: 'Comprador de 85 peças',
    comment: 'Grade mista do P ao XG perfeita. Os tamanhos maiores como GG e XG que costumam faltar em outros fornecedores vieram todos certos.',
    date: '19/07/2026',
    verifiedPurchase: true,
    likes: 23,
    photos: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'rev-16',
    authorName: 'Matheus Fontes',
    storeName: 'Baixada Santista Retrô',
    city: 'Santos',
    state: 'SP',
    rating: 5,
    orderVolume: 'Comprador de 50 peças',
    comment: 'Linha Retrô impecável! A camisa do Santos de 1962 e do Brasil de 1970 são obras de arte. Quem é colecionador compra na hora.',
    date: '16/07/2026',
    verifiedPurchase: true,
    likes: 28,
  },
];
export const MOCK_REVIEWS: CustomerReview[] = MOCK_CUSTOMER_REVIEWS;

export const LIVE_PURCHASE_NOTIFICATIONS: PurchaseToastNotification[] = [
  {
    id: 'notif-1',
    customerName: 'Eduardo M.',
    location: 'São Paulo - SP',
    itemCount: 40,
    description: 'Lote Atacado: Flamengo, Real Madrid e Brasil 2024',
    totalValue: 1800.00,
    paymentType: 'PIX',
    timeAgo: 'Há 2 minutos',
  },
  {
    id: 'notif-2',
    customerName: 'Loja Golaço Sports',
    location: 'Belo Horizonte - MG',
    itemCount: 65,
    description: 'Lote Grade Completa: Palmeiras, Vasco e City',
    totalValue: 2925.00,
    paymentType: 'PIX',
    timeAgo: 'Há 5 minutos',
  },
  {
    id: 'notif-3',
    customerName: 'Rafael Diniz',
    location: 'Curitiba - PR',
    itemCount: 25,
    description: 'Lote Times Europeus 24/25 (M, G, GG)',
    totalValue: 1250.00,
    paymentType: 'CARTÃO',
    timeAgo: 'Há 9 minutos',
  },
  {
    id: 'notif-4',
    customerName: 'Camisas VIP Reseller',
    location: 'Fortaleza - CE',
    itemCount: 50,
    description: 'Lote Misto + Corta-Ventos Impermeáveis',
    totalValue: 2250.00,
    paymentType: 'PIX',
    timeAgo: 'Há 14 minutos',
  },
  {
    id: 'notif-5',
    customerName: 'Bruno Castilho',
    location: 'Goiânia - GO',
    itemCount: 30,
    description: 'Lote Retrôs Clássicas (1970, 1981, 2002)',
    totalValue: 1350.00,
    paymentType: 'PIX',
    timeAgo: 'Há 18 minutos',
  },
  {
    id: 'notif-6',
    customerName: 'Diego Silveira',
    location: 'Campinas - SP',
    itemCount: 80,
    description: 'Mega Lote Atacado Distribuição Regional',
    totalValue: 3600.00,
    paymentType: 'PIX',
    timeAgo: 'Há 23 minutos',
  },
];
export const MOCK_PURCHASE_NOTIFICATIONS: PurchaseToastNotification[] = LIVE_PURCHASE_NOTIFICATIONS;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MC-2026-9812',
    customerName: 'Lucas Martins',
    customerEmail: 'revendedor@futstore.com.br',
    customerCpfCnpj: '45.892.123/0001-44',
    customerPhone: '(19) 99874-1234',
    resellerCompany: 'FutStore Campinas',
    shippingAddress: {
      street: 'Av. Francisco Glicério',
      number: '1420',
      neighborhood: 'Centro',
      city: 'Campinas',
      state: 'SP',
      postalCode: '13010-001',
    },
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productName: 'Camisa Flamengo I 24/25 Rubro-Negro',
        productImage: CURATED_IMAGES[0],
        size: 'M',
        quantity: 15,
        unitPrice: 45.00,
        subtotal: 675.00,
      },
      {
        id: 'oi-2',
        productId: 'prod-2',
        productName: 'Camisa Real Madrid Home 24/25 Branca',
        productImage: CURATED_IMAGES[1],
        size: 'G',
        quantity: 15,
        unitPrice: 45.00,
        subtotal: 675.00,
      },
      {
        id: 'oi-3',
        productId: 'prod-3',
        productName: 'Camisa Palmeiras I 24/25 Verde Dourada',
        productImage: CURATED_IMAGES[3],
        size: 'M',
        quantity: 10,
        unitPrice: 45.00,
        subtotal: 450.00,
      },
    ],
    totalQuantity: 40,
    subtotal: 1800.00,
    discount: 0.00,
    shippingCost: 0.00,
    total: 1800.00,
    status: 'PAID',
    paymentMethod: 'PIX',
    trackingCode: 'NL987654321BR',
    trackingCarrier: 'Jadlog Express',
    createdAt: '2026-08-18T14:30:00Z',
    updatedAt: '2026-08-18T14:35:00Z',
  },
  {
    id: 'ord-1002',
    orderNumber: 'MC-2026-9813',
    customerName: 'Marcos Vinicius Silva',
    customerEmail: 'contato@mantosagrado.com.br',
    customerCpfCnpj: '32.112.443/0001-99',
    customerPhone: '(31) 98711-5544',
    resellerCompany: 'Manto Sagrado Artigos',
    shippingAddress: {
      street: 'Rua Pernambuco',
      number: '850',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      state: 'MG',
      postalCode: '30130-150',
    },
    items: [
      {
        id: 'oi-4',
        productId: 'prod-1',
        productName: 'Camisa Flamengo I 24/25 Rubro-Negro',
        productImage: CURATED_IMAGES[0],
        size: 'G',
        quantity: 20,
        unitPrice: 50.00,
        subtotal: 1000.00,
      },
    ],
    totalQuantity: 20,
    subtotal: 1000.00,
    discount: 0.00,
    shippingCost: 35.00,
    total: 1035.00,
    status: 'SHIPPED',
    paymentMethod: 'PIX',
    trackingCode: 'BR849302189AA',
    trackingCarrier: 'Correios Sedex',
    createdAt: '2026-08-17T09:15:00Z',
    updatedAt: '2026-08-17T11:00:00Z',
  },
  {
    id: 'ord-1003',
    orderNumber: 'MC-2026-9814',
    customerName: 'Juliana Ferreira',
    customerEmail: 'compras@boutiquecampeoes.com.br',
    customerCpfCnpj: '18.992.834/0001-12',
    customerPhone: '(41) 99123-7788',
    resellerCompany: 'Boutique dos Campeões',
    shippingAddress: {
      street: 'Rua XV de Novembro',
      number: '500',
      neighborhood: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      postalCode: '80020-310',
    },
    items: [
      {
        id: 'oi-5',
        productId: 'prod-2',
        productName: 'Camisa Real Madrid Home 24/25 Branca',
        productImage: CURATED_IMAGES[1],
        size: 'P',
        quantity: 10,
        unitPrice: 50.00,
        subtotal: 500.00,
      },
    ],
    totalQuantity: 10,
    subtotal: 500.00,
    discount: 0.00,
    shippingCost: 29.00,
    total: 529.00,
    status: 'DELIVERED',
    paymentMethod: 'CREDIT_CARD',
    trackingCode: 'NL112233445BR',
    trackingCarrier: 'Jadlog',
    createdAt: '2026-08-14T16:20:00Z',
    updatedAt: '2026-08-16T18:00:00Z',
  },
];
export const MOCK_ORDERS: Order[] = INITIAL_ORDERS;

export const MOCK_B2B_CLIENTS: B2BClient[] = [
  {
    id: 'cli-1',
    name: 'Lucas Martins',
    tradeName: 'FutStore Campinas',
    cnpj: '45.892.123/0001-44',
    email: 'revendedor@futstore.com.br',
    phone: '(19) 99874-1234',
    city: 'Campinas',
    state: 'SP',
    ordersCount: 14,
    totalSpent: 34500.00,
    loyaltyTier: 'Ouro',
    joinedDate: '12/01/2025',
  },
  {
    id: 'cli-2',
    name: 'Marcos Vinicius',
    tradeName: 'Manto Sagrado Artigos',
    cnpj: '32.112.443/0001-99',
    email: 'contato@mantosagrado.com.br',
    phone: '(31) 98711-5544',
    city: 'Belo Horizonte',
    state: 'MG',
    ordersCount: 22,
    totalSpent: 58200.00,
    loyaltyTier: 'Diamante',
    joinedDate: '04/11/2024',
  },
  {
    id: 'cli-3',
    name: 'Juliana Ferreira',
    tradeName: 'Boutique dos Campeões',
    cnpj: '18.992.834/0001-12',
    email: 'compras@boutiquecampeoes.com.br',
    phone: '(41) 99123-7788',
    city: 'Curitiba',
    state: 'PR',
    ordersCount: 8,
    totalSpent: 16800.00,
    loyaltyTier: 'Prata',
    joinedDate: '20/03/2025',
  },
  {
    id: 'cli-4',
    name: 'Rodrigo Siqueira',
    tradeName: 'Arena FutStore',
    cnpj: '27.441.982/0001-33',
    email: 'rodrigo@arenafutstore.com.br',
    phone: '(62) 99881-2233',
    city: 'Goiânia',
    state: 'GO',
    ordersCount: 19,
    totalSpent: 48900.00,
    loyaltyTier: 'Diamante',
    joinedDate: '15/09/2024',
  },
];
