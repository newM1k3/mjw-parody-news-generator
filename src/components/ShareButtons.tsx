import { useState } from 'react';
import { Share2, Facebook, Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  headline: string;
  slug: string;
}

export default function ShareButtons({ headline, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://theconspiracynews.ca/?ref=share&story=${slug}`;
  const shareText = `EXPOSED: ${headline} — Read the truth at The Conspiracy News`;

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-gray-500 font-mono text-xs uppercase tracking-widest mr-1">Share:</span>
      <button
        onClick={shareTwitter}
        className="flex items-center gap-1.5 bg-black border border-gray-700 hover:border-white px-3 py-1.5 text-white text-xs font-mono uppercase tracking-wide transition-colors"
        title="Share on X/Twitter"
      >
        <Share2 size={12} />
        X / Twitter
      </button>
      <button
        onClick={shareFacebook}
        className="flex items-center gap-1.5 bg-black border border-gray-700 hover:border-blue-500 hover:text-blue-400 px-3 py-1.5 text-white text-xs font-mono uppercase tracking-wide transition-colors"
        title="Share on Facebook"
      >
        <Facebook size={12} />
        Facebook
      </button>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 bg-black border border-gray-700 hover:border-gold hover:text-gold px-3 py-1.5 text-white text-xs font-mono uppercase tracking-wide transition-colors"
        title="Copy link"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
