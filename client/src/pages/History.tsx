import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Loader2, History as HistoryIcon, Trash2 } from 'lucide-react';
import { ArticleWithRelations } from '@/types';

export default function History() {
  const userId = 1; // TODO: Replace with actual user data once auth is implemented
  
  const { data: historyArticles = [], isLoading, refetch } = useQuery<ArticleWithRelations[]>({
    queryKey: [`/api/users/${userId}/history`],
  });
  
  const mockUser = {
    id: userId,
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-primary dark:text-white">Reading History</h2>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="text-sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 text-secondary animate-spin" />
              </div>
            ) : (
              <>
                {historyArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historyArticles.map((article) => (
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
                      <HistoryIcon className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No reading history yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                      Articles you read will appear here. Start exploring to build your reading history.
                    </p>
                    <Button className="bg-secondary hover:bg-accent text-white">
                      Explore Articles
                    </Button>
                  </div>
                )}
                
                {historyArticles.length > 0 && (
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
      </div>
      
      <MobileNavbar />
    </div>
  );
}
