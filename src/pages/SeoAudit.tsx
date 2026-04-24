import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { scoreAll } from '@/lib/seo/seoScore';
import { Badge } from '@/components/ui/badge';

const SeoAudit = () => {
  const [threshold] = useState(45);
  const results = useMemo(() => scoreAll(threshold), [threshold]);

  const passing = results.filter((r) => r.passes).length;
  const rewritten = results.filter((r) => r.rewritten).length;
  const avg = (results.reduce((a, r) => a + r.total, 0) / results.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <SEO page="dashboard" pathOverride="/seo-audit" noIndex />
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">SEO Audit</h1>
        <p className="text-muted-foreground mb-8">
          Threshold {threshold}/50 · {passing}/{results.length} passing · {rewritten} auto-rewritten · avg {avg}/50
        </p>

        <div className="overflow-x-auto glass rounded-2xl border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Lang</th>
                <th className="px-4 py-3">Initial</th>
                <th className="px-4 py-3">Final</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Title</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={`${r.page}-${r.lang}`} className="border-t border-border/30">
                  <td className="px-4 py-2 font-medium">{r.page}</td>
                  <td className="px-4 py-2 uppercase text-muted-foreground">{r.lang}</td>
                  <td className="px-4 py-2">{r.initialTotal}/50</td>
                  <td className="px-4 py-2 font-semibold">{r.total}/50</td>
                  <td className="px-4 py-2">
                    {r.passes ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        {r.rewritten ? 'rewritten ✓' : 'pass'}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">below {threshold}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground max-w-xs truncate">{r.entry.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeoAudit;
