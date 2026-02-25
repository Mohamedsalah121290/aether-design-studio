import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-16"
    >
      <div className="glass-strong rounded-2xl p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={t('store.searchPlaceholder')}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="pl-9 pr-4 py-3.5 rounded-xl bg-background/60 border border-border text-sm text-foreground appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-w-[180px]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
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
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeFilter === chip.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FiltersBar;
