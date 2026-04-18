import { useState } from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

const FEATURES = [
  { name: 'Daily generations', free: '3', paid: 'Unlimited' },
  { name: 'Shareable image cards', free: false, paid: true },
  { name: 'Submit Your Own Conspiracy', free: false, paid: true },
  { name: 'Saved article history', free: false, paid: true },
  { name: 'Priority conspiracy queue', free: false, paid: true },
  { name: 'Tin Foil Hat badge', free: false, paid: true },
];

export default function Upgrade() {
  const { user, login, signup, isTinFoil } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="max-w-[860px] mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-block border border-gold/40 px-4 py-1 mb-4">
          <span className="text-gold font-mono text-xs uppercase tracking-widest">Classified Clearance Program</span>
        </div>
        <h1 className="font-mono text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3 distressed-text">
          Join the Resistance.<br />$7/Month.
        </h1>
        <p className="text-gray-400 font-mono text-base max-w-lg mx-auto">
          They've been watching you read for free. Time to go deeper.
        </p>
      </div>

      <div className="border border-gray-800 mb-8 overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-950 border-b border-gray-800">
          <div className="p-4 font-mono text-xs text-gray-500 uppercase tracking-widest">Feature</div>
          <div className="p-4 font-mono text-xs text-gray-500 uppercase tracking-widest text-center">Free</div>
          <div className="p-4 font-mono text-xs text-gold uppercase tracking-widest text-center bg-gold/5">
            Tin Foil Tier
          </div>
        </div>
        {FEATURES.map((feature, i) => (
          <div
            key={feature.name}
            className={`grid grid-cols-3 border-b border-gray-800/60 ${i % 2 === 0 ? 'bg-black' : 'bg-gray-950/40'}`}
          >
            <div className="p-4 font-mono text-sm text-gray-300">{feature.name}</div>
            <div className="p-4 text-center">
              {typeof feature.free === 'boolean' ? (
                feature.free ? (
                  <Check size={16} className="text-green-500 mx-auto" />
                ) : (
                  <X size={16} className="text-red-800 mx-auto" />
                )
              ) : (
                <span className="font-mono text-xs text-gray-400">{feature.free}</span>
              )}
            </div>
            <div className="p-4 text-center bg-gold/5">
              {typeof feature.paid === 'boolean' ? (
                feature.paid ? (
                  <Check size={16} className="text-gold mx-auto" />
                ) : (
                  <X size={16} className="text-red-800 mx-auto" />
                )
              ) : (
                <span className="font-mono text-sm text-gold font-bold">{feature.paid}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isTinFoil ? (
        <div className="border border-gold/40 bg-gold/5 p-8 text-center">
          <ShieldCheck size={40} className="text-gold mx-auto mb-3" />
          <h2 className="font-mono text-white text-xl font-bold uppercase tracking-widest mb-2">
            You're already in.
          </h2>
          <p className="text-gray-400 font-mono text-sm">
            Your Tin Foil Tier membership is active. Stay vigilant, citizen.
          </p>
        </div>
      ) : user ? (
        <div className="border border-red-900/60 bg-black/60 p-8 text-center">
          <p className="text-gray-400 font-mono text-sm mb-6">
            Logged in as <span className="text-white">{user.email}</span>.
            Ready to activate your Tin Foil Tier?
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-mono font-black text-lg uppercase tracking-widest px-10 py-4 transition-colors mb-4"
          >
            {checkoutLoading ? 'Redirecting...' : 'Activate Tin Foil Tier — $7/month'}
          </button>
          <p className="text-gray-600 font-mono text-xs">
            Cancel anytime. No questions asked. (They're watching anyway.)
          </p>
        </div>
      ) : (
        <div className="border border-red-900/60 bg-black/60 p-8 max-w-md mx-auto">
          <h3 className="font-mono text-white font-bold text-lg uppercase tracking-widest mb-1">
            {mode === 'login' ? 'Log In to Upgrade' : 'Create an Account'}
          </h3>
          <p className="text-gray-500 font-mono text-xs mb-6">
            You need an account before we can take your money.
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
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
            {authError && <p className="text-red-500 font-mono text-xs">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-mono font-bold text-sm uppercase tracking-widest py-2.5 transition-colors"
            >
              {authLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
          <p className="text-gray-500 font-mono text-xs mt-4 text-center">
            {mode === 'login' ? "No account? " : "Have an account? "}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
              className="text-gold hover:text-yellow-300 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      )}
    </main>
  );
}
