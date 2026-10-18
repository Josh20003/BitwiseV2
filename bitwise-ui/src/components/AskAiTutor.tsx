import { useState } from 'react';
import { Sparkles, Send, Loader2, ChevronUp } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { cleanLatexNotation } from '@/utils/mathFormat';

export interface AskAiTutorProps {
  /** What tool/page is being used, e.g. "Number Converter" */
  context: string;
  /** Description of the current step the user is on */
  stepDescription: string;
  /** Optional content to place to the left of the Ask AI button */
  children?: React.ReactNode;
  /** Custom badge text in header, default "AI-Powered" */
  badgeText?: string;
  /** Custom subtitle in header */
  subtitle?: string;
  /** Optional container class name */
  className?: string;
}

interface TutorMessage {
  role: 'user' | 'ai';
  text: string;
}

export function AskAiTutor({
  context,
  stepDescription,
  children,
  badgeText = 'AI-Powered',
  subtitle,
  className = '',
}: AskAiTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [hasAskedInitial, setHasAskedInitial] = useState(false);

  const askTutor = async (question: string) => {
    setLoading(true);
    if (question) {
      setMessages((prev) => [...prev, { role: 'user', text: question }]);
    }

    try {
      const data = await apiService.post<{ response: string }>(
        '/ai/tutor',
        { context, step: stepDescription, question },
        false,
        { timeout: 30000 },
      );
      setMessages((prev) => [...prev, { role: 'ai', text: data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "Sorry, I couldn't get a response right now. Try again in a moment! 🔄",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAi = async () => {
    if (!isOpen) {
      setIsOpen(true);
      if (!hasAskedInitial) {
        setHasAskedInitial(true);
        await askTutor('');
      }
    } else {
      setIsOpen(false);
    }
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || loading) return;
    const q = followUp.trim();
    setFollowUp('');
    await askTutor(q);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header row: optional children on left, Ask AI button on right */}
      <div className="flex items-start justify-between gap-3">
        {children && <div className="flex-1 min-w-0">{children}</div>}
        <button
          type="button"
          onClick={handleAskAi}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
            bg-[#1e1742] hover:bg-[#2b215e] text-purple-200 border border-purple-500/40
            transition-all duration-150 cursor-pointer shrink-0 shadow-sm hover:border-purple-400/60"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Expandable Tutor Panel */}
      {isOpen && (
        <div className="mt-3 rounded-xl border border-purple-500/25 bg-[#0b0f19] overflow-hidden shadow-xl shadow-purple-950/20">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-border/60 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold text-foreground">
              Understand this step
            </span>
            {badgeText && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                {badgeText}
              </span>
            )}
            {subtitle && (
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                {subtitle}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-colors"
              title="Close"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="px-4 py-3 space-y-3 max-h-[300px] overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === 'user' ? 'flex justify-end' : ''}
              >
                {msg.role === 'user' ? (
                  <div className="bg-primary/20 text-primary-foreground border border-primary/30 text-xs px-3 py-2 rounded-lg rounded-br-sm max-w-[85%] font-medium">
                    {msg.text}
                  </div>
                ) : (
                  <div className="bg-[#0f1422] border border-border/70 text-foreground text-xs p-3.5 rounded-lg rounded-bl-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {cleanLatexNotation(msg.text)}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-purple-300 py-1 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                Thinking...
              </div>
            )}
          </div>

          {/* Follow-up input */}
          <div className="px-4 pb-3 flex gap-2">
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
              placeholder="Ask a follow-up question..."
              className="flex-1 text-xs bg-[#070a12] border border-border/70 rounded-lg px-3 py-2
                text-foreground placeholder:text-muted-foreground/50
                focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/50"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleFollowUp}
              disabled={!followUp.trim() || loading}
              className="h-8 w-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white
                flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AskAiTutor;
