import { useState } from 'react';
import { Sparkles, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { ToolCard, Tool } from './ToolCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const USE_CASE_OPTIONS = [
  { key: 'text', label: 'Writing & SEO' },
  { key: 'image', label: 'Design & Images' },
  { key: 'video', label: 'Video Creation' },
  { key: 'audio', label: 'Voice & Audio' },
  { key: 'coding', label: 'Coding & Dev' },
  { key: 'automation', label: 'Automation' },
];

const BUDGET_OPTIONS = ['Under €10', '€10–25', '€25–50', 'No limit'];
const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

interface Recommendation {
  tool_id: string;
  reason: string;
}

interface AIRecommendationsProps {
  tools: Tool[];
}

const AIRecommendations = ({ tools }: AIRecommendationsProps) => {
  const [step, setStep] = useState(0); // 0=closed, 1-3=quiz, 4=results
  const [useCases, setUseCases] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const toggleUseCase = (key: string) => {
    setUseCases(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const submit = async () => {
    setLoading(true);
    setStep(4);
    try {
      const { data, error } = await supabase.functions.invoke('recommend-tools', {
        body: { useCases, budget, experience },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setStep(3);
        return;
      }
      setRecommendations(data.recommendations || []);
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to get recommendations. Please try again.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setUseCases([]);
    setBudget('');
    setExperience('');
    setRecommendations([]);
  };

  const matchedTools = recommendations
    .map(r => {
      const tool = tools.find(t => t.tool_id === r.tool_id);
      return tool ? { tool, reason: r.reason } : null;
    })
    .filter(Boolean) as { tool: Tool; reason: string }[];

  if (step === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <button
          onClick={() => setStep(1)}
          className="w-full group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 p-6 transition-all duration-300 hover:border-amber-500/30 hover:from-amber-500/10 hover:to-amber-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-base">AI Tool Finder</h3>
                <p className="text-white/40 text-sm">Answer 3 quick questions — get personalized picks</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400/60 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="rounded-2xl border border-amber-500/20 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white font-medium text-sm">AI Tool Finder</span>
            {step < 4 && (
              <span className="text-white/30 text-xs">Step {step} of 3</span>
            )}
          </div>
          <button onClick={reset} className="text-white/30 hover:text-white/60 text-xs transition-colors">
            Close
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Use cases */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">What do you need AI tools for?</h4>
              <p className="text-white/40 text-sm">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {USE_CASE_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => toggleUseCase(opt.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      useCases.includes(opt.key)
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  disabled={useCases.length === 0}
                  onClick={() => setStep(2)}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-amber-500/15 border border-amber-500/25 text-amber-300 hover:bg-amber-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">What's your monthly budget?</h4>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setBudget(opt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      budget === opt
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/50 text-sm transition-colors">Back</button>
                <button
                  disabled={!budget}
                  onClick={() => setStep(3)}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-amber-500/15 border border-amber-500/25 text-amber-300 hover:bg-amber-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">What's your experience level?</h4>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setExperience(opt)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      experience === opt
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => setStep(2)} className="text-white/30 hover:text-white/50 text-sm transition-colors">Back</button>
                <button
                  disabled={!experience}
                  onClick={submit}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-300 hover:from-amber-500/30 hover:to-amber-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Recommendations
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400/60 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing your preferences…
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="rounded-xl border border-white/5 p-4 space-y-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : matchedTools.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-white/50 text-sm">Based on your preferences, we recommend:</p>
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 text-white/30 hover:text-white/50 text-xs transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Start over
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchedTools.map(({ tool, reason }, index) => (
                      <div key={tool.id} className="space-y-2">
                        <ToolCard tool={tool} index={index} tier="featured" />
                        <p className="text-white/40 text-xs leading-relaxed px-1">{reason}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm">No matching tools found. Try different preferences.</p>
                  <button onClick={() => setStep(1)} className="mt-3 text-amber-400/60 text-sm hover:text-amber-400 transition-colors">
                    Try again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
