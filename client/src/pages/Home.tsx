import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArticleWithRelations, SortOption } from '@/types';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { RightSidebar } from '@/components/RightSidebar';
import { ArticleCard } from '@/components/ArticleCard';
import { FeedControls } from '@/components/FeedControls';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [sortOption, setSortOption] = useState<SortOption>('all');
  
  const { data: articles = [], isLoading, refetch } = useQuery<ArticleWithRelations[]>({
    queryKey: ['/api/articles'],
  });
  
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortOption === 'popular') {
      const aPopularity = (a.reactions?.likes || 0) * 2 + (a.reactions?.comments || 0);
      const bPopularity = (b.reactions?.likes || 0) * 2 + (b.reactions?.comments || 0);
      return bPopularity - aPopularity;
    }
    return 0;
  });
  
  // TODO: Replace with actual user data once auth is implemented
  const mockUser = {
    id: 1,
    username: 'testuser',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="px-3 py-4 sm:px-6 max-w-7xl mx-auto">
            <FeedControls 
              title="My Feed" 
              onSortChange={handleSortChange} 
              onRefresh={handleRefresh}
              currentSort={sortOption}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 text-secondary animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedArticles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      userId={mockUser.id} 
                    />
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    className="px-6 py-2 text-sm font-medium text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors"
                  >
                    Load More Articles
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
        
        <RightSidebar />
      </div>
      
      <MobileNavbar />
    </div>
  );
}
