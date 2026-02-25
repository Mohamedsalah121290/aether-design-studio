import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
  { id: 'creators', label: 'Creators' },
  { id: 'marketers', label: 'Marketers' },
  { id: 'developers', label: 'Developers' },
  { id: 'security', label: 'Security' },
] as const;

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low → High' },
] as const;

export type FilterChip = (typeof FILTER_CHIPS)[number]['id'];
export type SortOption = (typeof SORT_OPTIONS)[number]['id'];

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterChip;
  onFilterChange: (f: FilterChip) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

const FiltersBar = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
}: FiltersBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-4 md:p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder={t('store.searchPlaceholder')}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all text-white placeholder:text-white/30 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => onSortChange(e.target.value as SortOption)}
                className="pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white appearance-none cursor-pointer focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all min-w-[180px]"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {FILTER_CHIPS.map(chip => (
              <button
                key={chip.id}
                onClick={() => onFilterChange(chip.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeFilter === chip.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/[0.03] text-white/40 border border-transparent hover:bg-white/[0.06] hover:text-white/60'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
