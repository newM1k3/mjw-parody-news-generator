import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

interface TierGateProps {
  children: ReactNode;
  requiredTier: 'tin_foil';
}

export default function TierGate({ children, requiredTier }: TierGateProps) {
  const { user, loading, login, signup, isTinFoil } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="font-mono text-gray-500 text-sm uppercase tracking-widest animate-pulse">
          Verifying clearance level...
        </div>
      </div>
    );
  }

  if (!user) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);
      try {
        if (mode === 'login') {
          await login(email, password);
        } else {
          await signup(email, password);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication failed. Check your credentials.';
        setError(message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-md mx-auto py-12">
        <div className="border border-red-900 bg-black/60 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-red-500" />
            <h2 className="font-mono text-white text-xl font-bold uppercase tracking-widest">
              Clearance Required
            </h2>
          </div>
          <p className="text-gray-400 font-mono text-sm mb-6">
            You must be logged in to access this area. They already know who you are.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 focus:border-red-600 text-white font-mono text-sm px-3 py-2.5 outline-none transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 focus:border-red-600 text-white font-mono text-sm px-3 py-2.5 outline-none transition-colors"
            />
            {error && <p className="text-red-500 font-mono text-xs">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-mono font-bold text-sm uppercase tracking-widest py-2.5 transition-colors"
            >
              {submitting ? 'Verifying...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
          <p className="text-gray-500 font-mono text-xs mt-4 text-center">
            {mode === 'login' ? "No account? " : "Already have one? "}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-gold hover:text-yellow-300 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (requiredTier === 'tin_foil' && !isTinFoil) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="border border-gold/40 bg-black/60 p-8 text-center">
          <ShieldAlert size={40} className="text-gold mx-auto mb-4" />
          <h2 className="font-mono text-white text-xl font-bold uppercase tracking-widest mb-3">
            Tin Foil Tier Members Only
          </h2>
          <p className="text-gray-400 font-mono text-sm mb-6">
            This feature requires a Tin Foil Tier membership. The truth costs $7/month.
          </p>
          <button
            onClick={() => navigate('/upgrade')}
            className="bg-gold text-black font-mono font-black text-sm uppercase tracking-widest px-8 py-3 hover:bg-yellow-400 transition-colors"
          >
            Upgrade for $7/month →
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
