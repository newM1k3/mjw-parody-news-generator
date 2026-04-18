import { useState } from 'react';
import TierGate from '../components/TierGate';
import { useAuth } from '../lib/useAuth';
import pb from '../lib/pocketbase';
import { Send, CheckCircle } from 'lucide-react';

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

function SubmitForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [evidence, setEvidence] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [confidence, setConfidence] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');

    try {
      await pb.collection('conspiracy_submissions').create({
        user: user.id,
        title,
        evidence,
        category,
        confidence,
        status: 'pending',
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. The servers may be compromised.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-green-900/60 bg-black/60 p-10 text-center max-w-lg mx-auto">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-mono text-white text-2xl font-black uppercase tracking-widest mb-3">
          Transmission Received.
        </h2>
        <p className="text-gray-400 font-mono text-sm leading-relaxed">
          Your submission has been received. We've notified our sources. Stay low.
        </p>
        <button
          onClick={() => { setSubmitted(false); setTitle(''); setEvidence(''); setConfidence(5); }}
          className="mt-6 border border-gray-700 hover:border-red-600 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-widest px-6 py-2 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="border border-red-900/60 bg-black/60 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="font-mono text-3xl font-black text-white uppercase tracking-tight mb-1">
          SUBMIT YOUR CONSPIRACY
        </h2>
        <p className="text-gray-400 font-mono text-sm">
          What do you know? <span className="text-red-500">Tell us everything.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
            Conspiracy Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What have you uncovered?"
            required
            className="w-full bg-gray-950 border border-gray-700 focus:border-red-600 text-white font-mono text-base px-4 py-3 outline-none transition-colors placeholder:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
            The Evidence
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Tell us what you know. Be specific. Spare no detail. They can't silence you here."
            required
            rows={5}
            className="w-full bg-gray-950 border border-gray-700 focus:border-red-600 text-white font-mono text-sm px-4 py-3 outline-none transition-colors placeholder:text-gray-600 resize-y"
          />
        </div>

        <div>
          <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 focus:border-red-600 text-white font-mono text-sm px-4 py-3 outline-none transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-3">
            How confident are you? — <span className="text-gold">{confidence}/10</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full accent-red-600"
          />
          <div className="flex justify-between font-mono text-[10px] text-gray-600 mt-1">
            <span>Just a hunch</span>
            <span>I have documents</span>
          </div>
        </div>

        {error && <p className="text-red-500 font-mono text-xs">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-mono font-black text-lg uppercase tracking-widest py-4 transition-colors"
        >
          <Send size={16} />
          {submitting ? 'TRANSMITTING...' : 'LEAK IT'}
        </button>
      </form>
    </div>
  );
}

export default function Submit() {
  return (
    <main className="max-w-[860px] mx-auto px-4 py-10">
      <TierGate requiredTier="tin_foil">
        <SubmitForm />
      </TierGate>
    </main>
  );
}
