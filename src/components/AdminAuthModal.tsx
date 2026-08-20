import React, { useState } from 'react';
import { AuthUser } from '../types';
import { MOCK_AUTH_USERS } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  Lock, 
  Mail, 
  Crown, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export function AdminAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AdminAuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userRecord = MOCK_AUTH_USERS[email.trim().toLowerCase()];
    if (!userRecord || userRecord.passwordHash !== password) {
      setError('Credenciais inválidas. Verifique os dados de acesso de administrador.');
      return;
    }

    if (userRecord.role !== 'ADMIN') {
      setError('Acesso negado. Esta conta não possui privilégios de Administrador Master.');
      return;
    }

    setSuccessMsg('Autenticação Master autorizada com sucesso!');
    setTimeout(() => {
      onLoginSuccess(userRecord);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl max-w-md w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Painel Master Admin</h3>
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  RESTRITO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Acesso exclusivo para gestão geral da MC Store Futebol
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

        {/* Security Alert */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3.5 px-6 flex items-center gap-2.5 text-xs text-amber-300">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Área segura com registro de logs e controle de vendas.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              E-mail do Administrador Master:
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o e-mail de acesso master"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Senha Master de Segurança:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Acessar Painel Master de Controle</span>
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-[11px] text-slate-500">
          <span>MC Store Futebol • Gestão Interna</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-slate-300 cursor-pointer font-bold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
