import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

const TICKER_ITEMS = [
  'BREAKING: Local man discovers chemtrails taste like grape Kool-Aid',
  'EXCLUSIVE: The moon has been hollow since 1987, sources confirm',
  'DEVELOPING: Area 51 gift shop now accepts crypto',
  'ALERT: Birds recharged overnight — see something, say nothing',
  'URGENT: The Illuminati has been using Comic Sans since 1776',
  'CONFIRMED: Bigfoot spotted at Costco, purchased bulk quinoa',
  'BREAKING: 5G towers discovered to broadcast ABBA on subfrequencies',
  'ALERT: The Denver Airport murals are updating themselves',
  'EXCLUSIVE: Flat Earth Society confirms they also believe the moon is a lie',
  'DEVELOPING: Government fluoride now available in craft beer format',
];

export default function Header() {
  const { user, logout, isTinFoil } = useAuth();

  return (
    <header className="bg-black border-b border-red-900">
      <div className="max-w-[860px] mx-auto px-4 pt-8 pb-4">
        <div className="text-center mb-4">
          <div className="inline-block border border-red-800 px-3 py-1 mb-3">
            <span className="text-gold text-xs font-mono tracking-[0.3em] uppercase">Est. 1776 — Volume MMXXV</span>
          </div>
          <Link to="/">
            <h1 className="text-5xl md:text-7xl font-mono font-black text-white tracking-tight uppercase leading-none mb-2 distressed-text hover:text-red-400 transition-colors">
              THE CONSPIRACY NEWS
            </h1>
          </Link>
          <p className="text-red-500 font-mono text-sm tracking-[0.25em] uppercase">
            "They don't want you to read this."
          </p>
        </div>

        <nav className="flex items-center justify-between border-t border-red-900 pt-3 mt-4">
          <div className="flex gap-4">
            <Link to="/" className="text-gray-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
              Generator
            </Link>
            <Link to="/saved" className="text-gray-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
              Saved
            </Link>
            <Link to="/submit" className="text-gray-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
              Submit
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {isTinFoil && (
              <span className="bg-gold text-black text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                TIN FOIL TIER
              </span>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs font-mono hidden md:block truncate max-w-[120px]">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-400 text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/upgrade"
                className="text-gold hover:text-yellow-300 text-xs font-mono uppercase tracking-widest transition-colors"
              >
                Upgrade →
              </Link>
            )}
          </div>
        </nav>
      </div>

      <div className="bg-red-900/80 border-t border-red-700 overflow-hidden py-1.5">
        <div className="ticker-wrapper">
          <div className="ticker-content font-mono text-xs text-white font-bold tracking-wide">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-block px-8">
                <span className="text-gold font-black">◆</span> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
