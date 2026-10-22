import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api.service';
import { cleanLatexNotation } from '@/utils/mathFormat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface AskAiTutorProps {
  /** What tool/page is being used, e.g. "Number Converter" */
  context: string;
  /** Description of the current step the user is on */
  stepDescription: string;
  /** Custom badge text in header, default "AI-Powered" */
  badgeText?: string;
  /** Custom subtitle in header */
  subtitle?: string;
  /** Optional custom button text, default "Ask AI" */
  buttonText?: string;
  /** Optional button class name */
  className?: string;
}

interface TutorMessage {
  role: 'user' | 'ai';
  text: string;
}

export function AskAiTutor({
  context,
  stepDescription,
  badgeText = 'AI-Powered',
  subtitle,
  buttonText = 'Ask AI',
  className = '',
}: AskAiTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [hasAskedInitial, setHasAskedInitial] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset conversation if the step changes
  useEffect(() => {
    setMessages([]);
    setHasAskedInitial(false);
    setFollowUp('');
  }, [stepDescription]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

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

  const handleOpen = async () => {
    setIsOpen(true);
    if (!hasAskedInitial) {
      setHasAskedInitial(true);
      await askTutor('');
    }
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || loading) return;
    const q = followUp.trim();
    setFollowUp('');
    await askTutor(q);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
          bg-[#1e1742] hover:bg-[#2b215e] text-purple-200 border border-purple-500/40
          transition-all duration-150 cursor-pointer shrink-0 shadow-sm hover:border-purple-400/60 ${className}`}
      >
        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
        <span>{buttonText}</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl bg-[#0b0f19] border border-purple-500/30 text-foreground p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="px-5 py-3.5 border-b border-border/60 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <DialogTitle className="text-sm sm:text-base font-semibold text-foreground">
                Understand this step
              </DialogTitle>
              {badgeText && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Chat messages */}
          <div className="px-5 py-4 space-y-3 max-h-[380px] min-h-[160px] overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === 'user' ? 'flex justify-end' : ''}
              >
                {msg.role === 'user' ? (
                  <div className="bg-purple-600/30 text-white border border-purple-500/40 text-xs px-3 py-2 rounded-lg rounded-br-sm max-w-[85%] font-medium">
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
            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up input */}
          <div className="px-5 pb-4 pt-3 border-t border-border/40 flex gap-2 bg-[#070a12]/60">
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
              placeholder="Ask a follow-up question..."
              className="flex-1 text-xs bg-[#0b0f19] border border-border/70 rounded-lg px-3 py-2
                text-foreground placeholder:text-muted-foreground/50
                focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/50"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleFollowUp}
              disabled={!followUp.trim() || loading}
              className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium
                flex items-center gap-1.5 justify-center shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AskAiTutor;
