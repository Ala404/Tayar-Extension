import { useState } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortOption, ViewMode } from '@/types';

interface FeedControlsProps {
  title: string;
  onSortChange: (option: SortOption) => void;
  onRefresh: () => void;
  currentSort: SortOption;
}

export function FeedControls({ title, onSortChange, onRefresh, currentSort }: FeedControlsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-primary dark:text-white">{title}</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
          title="Feed settings"
        >
          <Sliders className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
          title="Refresh feed"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant={currentSort === 'all' ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => onSortChange('all')}
          className={currentSort === 'all' 
            ? "bg-gray-100 dark:bg-gray-800 text-text dark:text-gray-200" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        >
          <span>All</span>
        </Button>
        <Button 
          variant={currentSort === 'popular' ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => onSortChange('popular')}
          className={currentSort === 'popular' 
            ? "bg-gray-100 dark:bg-gray-800 text-text dark:text-gray-200" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        >
          <span>Popular</span>
        </Button>
        <Button 
          variant={currentSort === 'recent' ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => onSortChange('recent')}
          className={currentSort === 'recent'
            ? "bg-gray-100 dark:bg-gray-800 text-text dark:text-gray-200" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        >
          <span>Recent</span>
        </Button>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
          >
            <span>More</span>
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
