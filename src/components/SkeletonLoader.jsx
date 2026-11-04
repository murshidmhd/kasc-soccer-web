import React from 'react';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Skeleton Loader for Match Cards (Hero / Live Match)
 */
export function MatchCardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-card animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-28 skeleton-box rounded-full"></div>
        <div className="h-5 w-20 skeleton-box rounded-full"></div>
      </div>
      <div className="grid grid-cols-12 gap-3 items-center py-4">
        <div className="col-span-4 flex flex-col items-center space-y-2">
          <div className="w-14 h-14 rounded-full skeleton-box"></div>
          <div className="h-4 w-20 skeleton-box rounded-md"></div>
        </div>
        <div className="col-span-4 flex flex-col items-center space-y-2">
          <div className="h-8 w-16 skeleton-box rounded-lg"></div>
          <div className="h-3 w-12 skeleton-box rounded-md"></div>
        </div>
        <div className="col-span-4 flex flex-col items-center space-y-2">
          <div className="w-14 h-14 rounded-full skeleton-box"></div>
          <div className="h-4 w-20 skeleton-box rounded-md"></div>
        </div>
      </div>
      <div className="h-10 w-full skeleton-box rounded-xl"></div>
    </div>
  );
}

/**
 * Skeleton Loader for Fixtures List
 */
export function FixtureListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 space-y-3 shadow-card animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 skeleton-box rounded-md"></div>
            <div className="h-4 w-16 skeleton-box rounded-md"></div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full skeleton-box"></div>
              <div className="h-4 w-28 skeleton-box rounded-md"></div>
            </div>
            <div className="h-6 w-8 skeleton-box rounded-md"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 skeleton-box rounded-md"></div>
              <div className="w-8 h-8 rounded-full skeleton-box"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton Loader for Team Grid Cards
 */
export function TeamGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-card animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full skeleton-box shrink-0"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 skeleton-box rounded-md"></div>
              <div className="h-3 w-1/2 skeleton-box rounded-md"></div>
            </div>
          </div>
          <div className="h-8 w-full skeleton-box rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Graceful Empty State (for 0 Search results or Empty filter)
 */
export function EmptyState({
  title = 'ഫലങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല',
  subtitle = 'തിരഞ്ഞ വിവരങ്ങൾ ലഭ്യമല്ല. ദയവായി മറ്റ് പേരുകൾ തിരയുക.',
  actionText = 'റീസെറ്റ് ചെയ്യുക (Reset)',
  onAction
}) {
  return (
    <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-card max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
        <Search className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="touch-target px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
