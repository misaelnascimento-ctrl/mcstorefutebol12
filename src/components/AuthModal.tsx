import React, { useState } from 'react';
import { AuthUser } from '../types';
import { MOCK_AUTH_USERS } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Building2, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  LogIn,
  KeyRound,
  Eye,
  EyeOff,
  Store
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCepLookup = async (inputCep: string) => {
    const cleanCep = inputCep.replace(/\D/g, '');
    setPostalCode(inputCep);
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro) setStreet(data.logradouro);
          if (data.bairro) setNeighborhood(data.bairro);
          if (data.localidade) setCity(data.localidade);
          if (data.uf) setState(data.uf);
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const userRecord = MOCK_AUTH_USERS[email.trim().toLowerCase()];
      if (!userRecord || userRecord.passwordHash !== password) {
        setError('E-mail ou senha de revendedor incorretos. Verifique suas credenciais e tente novamente.');
        return;
      }

      setSuccessMsg(`Bem-vindo, ${userRecord.name}!`);
      setTimeout(() => {
        onLoginSuccess(userRecord);
        onClose();
      }, 500);
    } else {
      // Register new reseller
      if (!name || !email || !cnpjCpf || !phone || !password) {
        setError('Por favor, preencha todos os campos obrigatórios para o cadastro atacadista.');
        return;
      }

      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        name,
        email: email.trim().toLowerCase(),
        role: 'RESELLER',
        tradeName: tradeName || name,
        cnpjCpf,
        phone,
        postalCode: postalCode || '01310-100',
        street: street || 'Av. Paulista',
        number: number || '1000',
        complement: complement || '',
        neighborhood: neighborhood || 'Bela Vista',
        city: city || 'São Paulo',
        state: state || 'SP',
        loyaltyTier: 'Prata',
        ordersCount: 0,
        totalSpent: 0,
      };

      setSuccessMsg('Cadastro de Revendedor e Loja realizado com sucesso! Acessando portal...');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo size={40} />
            <div>
              <h3 className="font-black text-lg text-white">
                {mode === 'login' ? 'Portal do Revendedor B2B' : 'Cadastro de Lojista / Revenda'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login' 
                  ? 'Acesse seus pedidos, fotos em HD e descontos' 
                  : 'Compre no atacado com tabela regressiva direto da fábrica'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entrar como Revendedor
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadastrar Minha Loja
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  Nome do Responsável / Lojista:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Nome da Loja / Fantasia:
                  </label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    placeholder="Nome da sua loja esportiva"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">CNPJ ou CPF:</label>
                  <input
                    type="text"
                    required
                    value={cnpjCpf}
                    onChange={(e) => setCnpjCpf(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    WhatsApp da Loja:
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>CEP da Loja:</span>
                    {isLoadingCep && <span className="text-[10px] text-emerald-600 animate-pulse font-mono">Buscando...</span>}
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => handleCepLookup(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Detailed Address Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Rua / Logradouro:</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Av. Paulista"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Número:</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Nº"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Complemento:</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Sala, Apto"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Bairro:</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Cidade / UF:</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                    />
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-1.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
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
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              E-mail de Acesso:
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail cadastrado"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Password with Eye toggle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              Senha de Segurança:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{mode === 'login' ? 'Entrar na Área do Revendedor' : 'Concluir Cadastro de Revendedor'}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ambiente 100% Criptografado & Seguro.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-slate-900 cursor-pointer font-bold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
