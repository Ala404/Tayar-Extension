import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookmarkIcon } from 'lucide-react';
import { ArticleWithRelations } from '@/types';

export default function Bookmarks() {
  const userId = 1; // TODO: Replace with actual user data once auth is implemented
  
  const { data: bookmarkedArticles = [], isLoading, refetch } = useQuery<ArticleWithRelations[]>({
    queryKey: [`/api/users/${userId}/bookmarks`],
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
                <h2 className="text-xl font-bold text-primary dark:text-white">Bookmarks</h2>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="text-sm">
                  Create Collection
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Bookmarks</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript Resources</TabsTrigger>
                <TabsTrigger value="create">+ New Collection</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-10 w-10 text-secondary animate-spin" />
                  </div>
                ) : (
                  <>
                    {bookmarkedArticles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {bookmarkedArticles.map((article) => (
                          <ArticleCard 
                            key={article.id} 
                            article={{...article, bookmarked: true}} 
                            userId={mockUser.id} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                          <BookmarkIcon className="h-10 w-10 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                          Save interesting articles to read later by clicking the bookmark icon.
                        </p>
                        <Button className="bg-secondary hover:bg-accent text-white">
                          Explore Articles
                        </Button>
                      </div>
                    )}
                    
                    {bookmarkedArticles.length > 0 && (
                      <div className="mt-8 text-center">
                        <Button 
                          variant="outline" 
                          className="px-6 py-2 text-sm font-medium text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors"
                        >
                          Load More Bookmarks
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="javascript">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                    <BookmarkIcon className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No bookmarks in this collection</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                    Save JavaScript articles to this collection.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="create">
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-4">
                  <h3 className="text-lg font-semibold mb-4">Create New Collection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Collection Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background dark:bg-gray-900"
                        placeholder="E.g., Machine Learning Resources"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <div className="flex space-x-2">
                        {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'].map(color => (
                          <div key={color} className={`${color} w-6 h-6 rounded-full cursor-pointer`}></div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">Create Collection</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}
