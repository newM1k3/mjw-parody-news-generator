import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, AlertTriangle } from 'lucide-react';
import { useGenerationLimit } from '../lib/useGenerationLimit';
import { useAuth } from '../lib/useAuth';

const CATEGORIES = [
  'Government Cover-Up',
  'Big Pharma / Medical',
  'Space & Aliens',
  'Tech & Surveillance',
  'Food & Water Supply',
  'Secret Societies',
  'Weather Control',
  'Time Travel & Simulation',
  'Celebrity Clones',
  'Ancient Civilizations',
];

const INTENSITIES = [
  'Mildly Suspicious',
  'Definitely Fishy',
  'Full Tin Foil Hat',
  'DEFCON 1 — They\'re Already Here',
];

interface GeneratorFormProps {
  onGenerate: (topic: string, category: string, intensity: string) => void;
  isLoading: boolean;
}

export default function GeneratorForm({ onGenerate, isLoading }: GeneratorFormProps) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [intensity, setIntensity] = useState(INTENSITIES[0]);
  const { isTinFoil } = useAuth();
  const { hasReachedLimit, remainingGenerations } = useGenerationLimit(isTinFoil);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || hasReachedLimit || isLoading) return;
    onGenerate(topic.trim(), category, intensity);
  };

  return (
    <div className="border border-red-900/60 bg-black/40 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="font-mono text-3xl font-black text-white uppercase tracking-tight mb-1">
          GENERATE YOUR CONSPIRACY
        </h2>
        <p className="text-gray-400 font-mono text-sm">
          Enter a topic. We'll do the rest. <span className="text-red-500">They can't stop us.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
            The Subject of Inquiry
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 5G towers, the moon, your dentist"
            className="w-full bg-gray-950 border border-gray-700 focus:border-red-600 text-white font-mono text-base px-4 py-3 outline-none transition-colors placeholder:text-gray-600"
            disabled={hasReachedLimit || isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
              Conspiracy Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 focus:border-red-600 text-white font-mono text-sm px-4 py-3 outline-none transition-colors"
              disabled={hasReachedLimit || isLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
              Intensity Level
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 focus:border-red-600 text-white font-mono text-sm px-4 py-3 outline-none transition-colors"
              disabled={hasReachedLimit || isLoading}
            >
              {INTENSITIES.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {hasReachedLimit ? (
          <div className="border border-gold/40 bg-gold/5 p-5 text-center">
            <AlertTriangle size={24} className="text-gold mx-auto mb-2" />
            <p className="font-mono text-white text-sm font-bold mb-1">
              You've hit your daily limit, citizen.
            </p>
            <p className="font-mono text-gray-400 text-xs mb-4">
              The truth costs $7/month.
            </p>
            <button
              type="button"
              onClick={() => navigate('/upgrade')}
              className="bg-gold text-black font-mono font-black text-sm uppercase tracking-widest px-6 py-2.5 hover:bg-yellow-400 transition-colors"
            >
              Upgrade to Tin Foil Tier →
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-black text-lg uppercase tracking-widest py-4 transition-colors"
            >
              {isLoading ? (
                <>
                  <span className="animate-pulse">UNCOVERING THE TRUTH...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  EXPOSE THE TRUTH
                </>
              )}
            </button>
            {!isTinFoil && (
              <span className="text-gray-600 font-mono text-xs text-right shrink-0">
                {remainingGenerations} of 3<br />remaining today
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
