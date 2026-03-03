import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Recommendation {
  tool_id: string;
  reason: string;
}

interface RecommendationEntry {
  id: string;
  preferences: {
    useCases?: string[];
    budget?: string;
    experience?: string;
  };
  recommendations: Recommendation[];
  created_at: string;
}

const USE_CASE_LABELS: Record<string, string> = {
  text: 'Writing & SEO',
  image: 'Design & Images',
  video: 'Video Creation',
  audio: 'Voice & Audio',
  coding: 'Coding & Dev',
  automation: 'Automation',
};

const RecommendationHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<RecommendationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('recommendation_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      setHistory((data || []) as RecommendationEntry[]);
    } catch (err) {
      console.error('Error fetching recommendation history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-strong rounded-2xl p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.95) 0%, hsl(222 47% 8% / 0.98) 100%)',
        }}
      >
        <Sparkles className="w-8 h-8 text-amber-400/40 mx-auto mb-3" />
        <h4 className="text-foreground font-semibold text-sm mb-1">No AI recommendations yet</h4>
        <p className="text-muted-foreground text-xs mb-4">Visit the Store and use the AI Tool Finder to get personalized picks.</p>
        <a
          href="/store#tools-grid"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          Go to AI Tool Finder <ArrowRight className="w-3 h-3" />
        </a>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(222 47% 11% / 0.95) 0%, hsl(222 47% 8% / 0.98) 100%)',
          }}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg grid place-items-center bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">AI Recommendation</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Preferences chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(entry.preferences.useCases || []).map(uc => (
                <span key={uc} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-muted-foreground">
                  {USE_CASE_LABELS[uc] || uc}
                </span>
              ))}
              {entry.preferences.budget && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-muted-foreground">
                  {entry.preferences.budget}
                </span>
              )}
              {entry.preferences.experience && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-muted-foreground">
                  {entry.preferences.experience}
                </span>
              )}
            </div>

            {/* Tool recommendations */}
            <div className="space-y-2">
              {entry.recommendations.map((rec, ri) => (
                <div key={ri} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] font-bold text-amber-400/60 mt-0.5 shrink-0 w-4">#{ri + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{rec.tool_id}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecommendationHistory;
