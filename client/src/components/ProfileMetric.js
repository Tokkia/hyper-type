import { FaRegUser } from 'react-icons/fa';

export default function ProfileMetric({ metric }) {
  return (
    <div className="max-w-[95rem] mx-auto h-[33vh] px-40 py-10 rounded-2xl bg-overlay flex items-center gap-6">
      <FaRegUser size={120} />

      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-5xl font-bold text-accentText">username</span>
      </div>

      <div className="ml-auto flex items-center gap-16">
        <div className="flex flex-col items-center gap-4">
          <span className="text-4xl font-bold text-accent">top wpm</span>
          <span className="text-5xl font-bold text-accentText">140</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="text-4xl font-bold text-accent">top accuracy</span>
          <span className="text-5xl font-bold text-accentText">100%</span>
        </div>
      </div>
    </div>
  );
}