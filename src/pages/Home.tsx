import { useState } from 'react';
import GeneratorForm from '../components/GeneratorForm';
import ArticleDisplay, { GeneratedArticle, generateSlug } from '../components/ArticleDisplay';
import { useGenerationLimit } from '../lib/useGenerationLimit';
import { useAuth } from '../lib/useAuth';
import pb from '../lib/pocketbase';

export default function Home() {
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isTinFoil, user } = useAuth();
  const { incrementCount } = useGenerationLimit(isTinFoil);

  const handleGenerate = async (topic: string, category: string, intensity: string) => {
    setIsLoading(true);
    setError('');
    setArticle(null);

    try {
      const response = await fetch('/.netlify/functions/generate-conspiracy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category, intensity }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const data = await response.json();

      const evidenceRating = typeof data.evidenceRating === 'number'
        ? Math.min(100, Math.max(1, data.evidenceRating))
        : Math.floor(Math.random() * 30) + 70; // fallback if API omits field
      const slug = generateSlug(data.headline);

      const generatedArticle: GeneratedArticle = {
        headline: data.headline,
        subheadline: data.subheadline,
        body: data.body,
        sources: data.sources,
        evidenceRating,
        slug,
        category,
        intensity,
      };

      setArticle(generatedArticle);
      incrementCount();

      if (isTinFoil && user) {
        try {
          await pb.collection('generated_articles').create({
            user: user.id,
            headline: data.headline,
            subheadline: data.subheadline,
            body: data.body,
            sources: data.sources,
            evidence_rating: evidenceRating,
            category,
            intensity,
            topic,
            slug,
          });
        } catch (saveErr) {
          console.warn('Could not save article to history:', saveErr);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. They may be onto us.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-[860px] mx-auto px-4 py-10">
      <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />

      {error && (
        <div className="mt-6 border border-red-800 bg-red-950/30 p-4">
          <p className="font-mono text-red-400 text-sm">
            <span className="font-bold">TRANSMISSION INTERRUPTED:</span> {error}
          </p>
        </div>
      )}

      {article && <ArticleDisplay article={article} />}

      {!article && !isLoading && !error && (
        <div className="mt-12 text-center">
          <div className="border border-dashed border-gray-800 py-16 px-8">
            <div className="font-mono text-4xl text-gray-800 mb-4">◆◆◆</div>
            <p className="font-mono text-gray-600 text-sm uppercase tracking-widest">
              Your classified report will appear here
            </p>
            <p className="font-mono text-gray-700 text-xs mt-2">
              Enter a topic above and hit "EXPOSE THE TRUTH"
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
