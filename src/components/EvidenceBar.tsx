interface EvidenceBarProps {
  value: number;
}

export default function EvidenceBar({ value }: EvidenceBarProps) {
  const labels = ['Plausible', 'Suspicious', 'Alarming', 'Irrefutable', 'UNDENIABLE PROOF'];
  const labelIndex = Math.min(Math.floor((value / 100) * labels.length), labels.length - 1);

  return (
    <div className="mt-6 p-4 border border-red-900/50 bg-black/40">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Evidence Rating</span>
        <span className="text-gold font-mono text-xs font-bold">{labels[labelIndex]}</span>
      </div>
      <div className="w-full bg-gray-900 h-3 border border-gray-800">
        <div
          className="h-full evidence-bar-fill transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-gray-600 font-mono text-[10px]">Plausible</span>
        <span className="text-red-500 font-mono text-[10px] font-bold">{value}% — UNDENIABLE PROOF</span>
      </div>
    </div>
  );
}
