import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArticleWithRelations, SortOption } from '@/types';

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const searchQuery = searchParams.get('q') || '';
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  
  // Mock user data - would be from auth context in a real app
  const mockUser = {
    id: 1,
    username: 'testuser',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };
  
  // Fetch search results
  const { data: articles, isLoading, refetch } = useQuery<ArticleWithRelations[]>({
    queryKey: ['/api/articles', { search: searchQuery }],
    enabled: searchQuery.length > 0,
  });
  
  // Sort articles based on sort option
  const sortedArticles = articles ? [...articles].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortOption === 'popular') {
      const bReactions = (b.reactions?.likes || 0) + (b.reactions?.comments || 0);
      const aReactions = (a.reactions?.likes || 0) + (a.reactions?.comments || 0);
      return bReactions - aReactions;
    }
    return 0;
  }) : [];
  
  // Extract unique tags from search results
  const uniqueTags = articles 
    ? Array.from(new Set(articles.flatMap(article => article.tags.map(tag => tag.name))))
    : [];
  
  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  // Refresh results
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary dark:text-white">
                    Search Results: "{searchQuery}"
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {articles?.length || 0} {articles?.length === 1 ? 'result' : 'results'} found
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>{sortOption === 'recent' ? 'Most Recent' : 'Most Popular'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSortChange('recent')}>
                        Most Recent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange('popular')}>
                        Most Popular
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2v6h-6"></path>
                      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                      <path d="M3 22v-6h6"></path>
                      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    </svg>
                    Refresh
                  </Button>
                </div>
              </div>
              
              {uniqueTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-sm text-gray-500 font-medium">Related tags:</span>
                  {uniqueTags.map(tag => (
                    <Badge 
                      key={tag} 
                      className="cursor-pointer"
                      variant="outline"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedArticles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    userId={mockUser.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                  We couldn't find any articles matching "{searchQuery}". Try a different search term or browse articles by tags.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Go Back
                  </Button>
                  <Button variant="default" onClick={() => window.location.href = '/'}>
                    Browse All Articles
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}