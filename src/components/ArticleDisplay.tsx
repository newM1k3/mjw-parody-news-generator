import { useRef } from 'react';
import { Download } from 'lucide-react';
import EvidenceBar from './EvidenceBar';
import ShareButtons from './ShareButtons';
import { useAuth } from '../lib/useAuth';

export interface GeneratedArticle {
  headline: string;
  subheadline: string;
  body: string[];
  sources: string[];
  evidenceRating: number;
  slug: string;
  category: string;
  intensity: string;
}

interface ArticleDisplayProps {
  article: GeneratedArticle;
}

function generateSlug(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export { generateSlug };

export default function ArticleDisplay({ article }: ArticleDisplayProps) {
  const { isTinFoil } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        width: 1200,
        height: 630,
      });
      const link = document.createElement('a');
      link.download = `conspiracy-${article.slug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image card', err);
    }
  };

  return (
    <div className="mt-8 border border-red-900/60 bg-black/60">
      <div ref={cardRef} className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-gold text-black font-mono font-black text-xs px-2.5 py-1 uppercase tracking-widest animate-pulse">
            ◆ BREAKING
          </span>
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-red-700 font-mono text-xs">|</span>
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest">
            {article.intensity}
          </span>
        </div>

        <h2 className="font-mono text-2xl md:text-4xl font-black text-white uppercase leading-tight mb-3 distressed-text">
          {article.headline}
        </h2>

        <p className="font-mono text-base text-red-400 italic mb-6 leading-relaxed">
          {article.subheadline}
        </p>

        <div className="border-t border-red-900/40 pt-6 space-y-4">
          {article.body.map((paragraph, i) => (
            <p key={i} className="text-gray-300 font-sans text-[15px] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">
            ◆ Source Intelligence
          </h3>
          <ul className="space-y-1.5">
            {article.sources.map((source, i) => (
              <li key={i} className="flex items-start gap-2 font-mono text-xs text-gray-400">
                <span className="text-red-600 mt-0.5 shrink-0">[{i + 1}]</span>
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 text-center border border-dashed border-red-900/30 py-1">
          <span className="text-red-900/60 font-mono text-[10px] uppercase tracking-widest">
            CLASSIFIED — THE CONSPIRACY NEWS — SATIRE — 100% FICTIONAL
          </span>
        </div>
      </div>

      <div className="px-6 md:px-8 pb-6">
        <EvidenceBar value={article.evidenceRating} />

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <ShareButtons headline={article.headline} slug={article.slug} />
          {isTinFoil && (
            <button
              onClick={handleDownloadCard}
              className="flex items-center gap-2 bg-gold/10 border border-gold/40 hover:bg-gold/20 text-gold font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors"
            >
              <Download size={12} />
              Download Image Card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
