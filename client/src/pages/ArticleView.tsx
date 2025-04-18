import { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ThumbsUp, MessageSquare, Share2, 
  Bookmark, ArrowLeft, Clock 
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArticleWithRelations } from '@/types';
import { formatTimeAgo } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleView() {
  const [match, params] = useRoute('/article/:id');
  const { toast } = useToast();
  
  const articleId = params?.id ? parseInt(params.id) : 0;
  
  // Mock user data - would be from auth context in a real app
  const mockUser = {
    id: 1,
    username: 'testuser',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };
  
  // Fetch article data
  const { data: article, isLoading, error } = useQuery<ArticleWithRelations>({
    queryKey: [`/api/articles/${articleId}?userId=${mockUser.id}`],
    enabled: articleId > 0,
  });
  
  // Record view in reading history when article loads
  useEffect(() => {
    if (article) {
      apiRequest('POST', '/api/history', {
        userId: mockUser.id,
        articleId: article.id,
        viewedAt: new Date()
      }).catch(() => {
        // Silent failure for reading history
      });
    }
  }, [article]);
  
  const handleBookmark = async () => {
    if (!article) return;
    
    try {
      if (!article.bookmarked) {
        await apiRequest('POST', '/api/bookmarks', {
          userId: mockUser.id,
          articleId: article.id,
          createdAt: new Date()
        });
        
        toast({
          title: "Article bookmarked",
          description: "This article has been added to your bookmarks"
        });
      } else {
        await apiRequest('DELETE', '/api/bookmarks', {
          userId: mockUser.id,
          articleId: article.id
        });
        
        toast({
          title: "Bookmark removed",
          description: "This article has been removed from your bookmarks"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };
  
  const handleLike = async () => {
    if (!article) return;
    
    try {
      await apiRequest('POST', '/api/reactions', {
        userId: mockUser.id,
        articleId: article.id,
        type: 'like'
      });
      
      toast({
        title: "Article liked",
        description: "You liked this article"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like article",
        variant: "destructive"
      });
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
        <Header user={mockUser} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <div className="px-4 py-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                  <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Error Loading Article</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  Sorry, we couldn't load this article. It may have been removed or is temporarily unavailable.
                </p>
                <Link href="/">
                  <Button className="bg-secondary hover:bg-accent text-white">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
        
        <MobileNavbar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="px-4 py-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/">
                <Button variant="ghost" className="mb-4 pl-0 text-gray-600 dark:text-gray-400">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Feed
                </Button>
              </Link>
              
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <div className="flex items-center space-x-2 mb-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-80 w-full mb-6" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-primary dark:text-white mb-4">
                    {article?.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center mb-4">
                    {article?.source && (
                      <div className="flex items-center mr-4 mb-2">
                        {article.source.logoUrl && (
                          <img 
                            src={article.source.logoUrl} 
                            alt={article.source.name} 
                            className="h-6 w-6 rounded-full mr-2"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">{article.source.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center mr-4 mb-2">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {article?.readTime} min read
                      </span>
                    </div>
                    
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {article?.publishedAt && formatTimeAgo(article.publishedAt)}
                    </span>
                    
                    <div className="flex-grow"></div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      {article?.tags.map(tag => (
                        <Badge key={tag.id} variant={tag.name as any}>
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {article?.imageUrl && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </>
              )}
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg mb-4">
                    {article?.description}
                  </p>
                  
                  <p className="whitespace-pre-line">
                    {article?.content}
                  </p>
                  
                  {/* Full content would be rendered here - using description/content for demo */}
                  
                  <div className="mt-12">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Originally published at{' '}
                      <a 
                        href={article?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        {article?.source?.name}
                      </a>
                    </p>
                  </div>
                </div>
              )}
              
              {!isLoading && article && (
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={handleLike}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{article.reactions?.likes || 0}</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{article.reactions?.comments || 0}</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-2"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex items-center space-x-2 ${
                          article.bookmarked ? 'text-secondary border-secondary' : ''
                        }`}
                        onClick={handleBookmark}
                      >
                        <Bookmark className={`h-4 w-4 ${article.bookmarked ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">{article.bookmarked ? 'Saved' : 'Save'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div id="comments" className="mt-12">
                <h3 className="text-xl font-bold mb-6">Comments</h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-20 w-full rounded-md" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={mockUser.avatarUrl} 
                        alt={mockUser.username} 
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea 
                          className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          placeholder="Share your thoughts..."
                          rows={3}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <Button>Post</Button>
                        </div>
                      </div>
                    </div>
                    
                    {article && article.reactions?.comments ? (
                      <div className="mt-8 space-y-6">
                        {/* Comments would be fetched and rendered here */}
                        <p className="text-center text-gray-500 dark:text-gray-400">
                          Join the conversation with {article.reactions.comments} other developers
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">
                          No comments yet. Be the first to share your thoughts!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}
