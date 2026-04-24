import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { scoreAll, type PageScore } from '@/lib/seo/seoScore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortKey = 'page' | 'lang' | 'initial' | 'final' | 'status';
type SortDir = 'asc' | 'desc';
type StatusFilter = 'all' | 'pass' | 'fail' | 'rewritten';

const csvEscape = (v: string | number) => {
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const buildCsv = (rows: PageScore[]): string => {
  const head = [
    'page',
    'lang',
    'initial',
    'final',
    'status',
    'rewritten',
    'title',
    'description',
    'primaryKeyword',
  ].join(',');
  const body = rows
    .map((r) =>
      [
        r.page,
        r.lang,
        r.initialTotal,
        r.total,
        r.passes ? 'pass' : 'fail',
        r.rewritten ? 'yes' : 'no',
        r.entry.title,
        r.entry.description,
        r.entry.primaryKeyword,
      ]
        .map(csvEscape)
        .join(','),
    )
    .join('\n');
  return `${head}\n${body}\n`;
};

const SeoAudit = () => {
  const [threshold] = useState(45);
  const [query, setQuery] = useState('');
  const [pageFilter, setPageFilter] = useState<string>('all');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('page');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const results = useMemo(() => scoreAll(threshold), [threshold]);

  const pages = useMemo(
    () => Array.from(new Set(results.map((r) => r.page))).sort(),
    [results],
  );
  const langs = useMemo(
    () => Array.from(new Set(results.map((r) => r.lang))).sort(),
    [results],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = results.filter((r) => {
      if (pageFilter !== 'all' && r.page !== pageFilter) return false;
      if (langFilter !== 'all' && r.lang !== langFilter) return false;
      if (statusFilter === 'pass' && !r.passes) return false;
      if (statusFilter === 'fail' && r.passes) return false;
      if (statusFilter === 'rewritten' && !r.rewritten) return false;
      if (!q) return true;
      return (
        r.page.toLowerCase().includes(q) ||
        r.lang.toLowerCase().includes(q) ||
        r.entry.title.toLowerCase().includes(q) ||
        r.entry.description.toLowerCase().includes(q) ||
        r.entry.primaryKeyword.toLowerCase().includes(q)
      );
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case 'page': av = a.page; bv = b.page; break;
        case 'lang': av = a.lang; bv = b.lang; break;
        case 'initial': av = a.initialTotal; bv = b.initialTotal; break;
        case 'final': av = a.total; bv = b.total; break;
        case 'status':
          av = a.passes ? (a.rewritten ? 1 : 2) : 0;
          bv = b.passes ? (b.rewritten ? 1 : 2) : 0;
          break;
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return list;
  }, [results, query, pageFilter, langFilter, statusFilter, sortKey, sortDir]);

  const passing = filtered.filter((r) => r.passes).length;
  const rewritten = filtered.filter((r) => r.rewritten).length;
  const avg = filtered.length
    ? (filtered.reduce((a, r) => a + r.total, 0) / filtered.length).toFixed(1)
    : '0.0';

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? (
        <ArrowUp className="inline w-3.5 h-3.5 ml-1" />
      ) : (
        <ArrowDown className="inline w-3.5 h-3.5 ml-1" />
      )
    ) : (
      <ArrowUpDown className="inline w-3.5 h-3.5 ml-1 opacity-40" />
    );

  const downloadCsv = () => {
    const csv = buildCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.download = `seo-audit-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setQuery('');
    setPageFilter('all');
    setLangFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO page="dashboard" pathOverride="/seo-audit" noIndex />
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">SEO Audit</h1>
            <p className="text-muted-foreground">
              Threshold {threshold}/50 · {passing}/{filtered.length} passing ·{' '}
              {rewritten} auto-rewritten · avg {avg}/50
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={downloadCsv} className="gap-2">
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Input
            placeholder="Search page, title, description, keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select value={pageFilter} onValueChange={setPageFilter}>
            <SelectTrigger><SelectValue placeholder="Page" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All pages</SelectItem>
              {pages.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={langFilter} onValueChange={setLangFilter}>
            <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              {langs.map((l) => (
                <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pass">Pass only</SelectItem>
              <SelectItem value="fail">Fail only</SelectItem>
              <SelectItem value="rewritten">Auto-rewritten</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto glass rounded-2xl border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left">
              <tr>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('page')}>
                  Page <SortIcon k="page" />
                </th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('lang')}>
                  Lang <SortIcon k="lang" />
                </th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('initial')}>
                  Initial <SortIcon k="initial" />
                </th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('final')}>
                  Final <SortIcon k="final" />
                </th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('status')}>
                  Status <SortIcon k="status" />
                </th>
                <th className="px-4 py-3">Title</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No results match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeoAudit;
