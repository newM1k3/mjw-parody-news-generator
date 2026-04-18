import { useState, useEffect } from 'react';
import { Trash2, BookOpen, FileText } from 'lucide-react';
import TierGate from '../components/TierGate';
import { useAuth } from '../lib/useAuth';
import pb from '../lib/pocketbase';

interface SavedArticle {
  id: string;
  headline: string;
  subheadline: string;
  category: string;
  intensity: string;
  topic: string;
  created: string;
  body: string[];
  sources: string[];
}

function SavedArticlesList() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const records = await pb.collection('generated_articles').getList(1, 50, {
          filter: `user = "${user.id}"`,
          sort: '-created',
        });
        setArticles(records.items as unknown as SavedArticle[]);
      } catch (err) {
        console.error('Failed to load saved articles:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await pb.collection('generated_articles').delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete article:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-gray-500 text-sm uppercase tracking-widest animate-pulse">
          Retrieving classified files...
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="border border-dashed border-gray-800 py-20 px-8 text-center">
        <FileText size={48} className="text-gray-700 mx-auto mb-4" />
        <h3 className="font-mono text-gray-400 text-lg font-bold uppercase tracking-widest mb-2">
          Nothing saved yet.
        </h3>
        <p className="font-mono text-gray-600 text-sm">
          The truth is out there — go find it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-2xl font-black text-white uppercase tracking-tight">
          YOUR CLASSIFIED FILES
        </h2>
        <span className="text-gray-500 font-mono text-xs">{articles.length} article{articles.length !== 1 ? 's' : ''}</span>
      </div>

      {articles.map((article) => (
        <div key={article.id} className="border border-gray-800 bg-black/40 hover:border-red-900/60 transition-colors">
          <div className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-gold/10 border border-gold/30 text-gold font-mono text-[10px] px-2 py-0.5 uppercase tracking-widest">
                    {article.category}
                  </span>
                  <span className="text-gray-600 font-mono text-[10px] uppercase">{article.intensity}</span>
                  <span className="text-gray-700 font-mono text-[10px]">
                    {new Date(article.created).toLocaleDateString('en-CA', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="font-mono text-white font-bold text-base md:text-lg leading-tight uppercase">
                  {article.headline}
                </h3>
                {article.subheadline && (
                  <p className="text-gray-400 font-mono text-xs italic mt-1 line-clamp-1">{article.subheadline}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  className="flex items-center gap-1.5 border border-gray-700 hover:border-white text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider px-3 py-1.5 transition-colors"
                >
                  <BookOpen size={12} />
                  {expandedId === article.id ? 'Close' : 'Re-read'}
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  disabled={deletingId === article.id}
                  className="flex items-center gap-1.5 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-500 font-mono text-xs uppercase tracking-wider px-3 py-1.5 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={12} />
                  {deletingId === article.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>

            {expandedId === article.id && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                {article.body?.map((para: string, i: number) => (
                  <p key={i} className="text-gray-300 font-sans text-sm leading-relaxed mb-3">{para}</p>
                ))}
                {article.sources?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">Sources</p>
                    {article.sources.map((src: string, i: number) => (
                      <p key={i} className="font-mono text-xs text-gray-500 mb-1">
                        <span className="text-red-700">[{i + 1}]</span> {src}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Saved() {
  return (
    <main className="max-w-[860px] mx-auto px-4 py-10">
      <TierGate requiredTier="tin_foil">
        <SavedArticlesList />
      </TierGate>
    </main>
  );
}
