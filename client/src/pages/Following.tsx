import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { RightSidebar } from '@/components/RightSidebar';
import { FeedControls } from '@/components/FeedControls';
import { ArticleCard } from '@/components/ArticleCard';
import { SortOption } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';

export default function Following() {
  const [sortOption, setSortOption] = useState<SortOption>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - would come from API in real implementation
  const followingArticles = [];
  
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
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
              title="Following" 
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
                {followingArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followingArticles.map((article) => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        userId={mockUser.id} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                      <UserPlus className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No followed sources yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                      Start following some sources, authors, or topics to get personalized articles in your feed.
                    </p>
                    <Button className="bg-secondary hover:bg-accent text-white">
                      Discover sources to follow
                    </Button>
                  </div>
                )}
                
                {followingArticles.length > 0 && (
                  <div className="mt-8 text-center">
                    <Button 
                      variant="outline" 
                      className="px-6 py-2 text-sm font-medium text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors"
                    >
                      Load More Articles
                    </Button>
                  </div>
                )}
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
