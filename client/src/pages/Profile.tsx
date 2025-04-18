import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Edit, 
  BookmarkIcon, 
  History as HistoryIcon, 
  UserCircle,
  Mail,
  Globe,
  Twitter,
  Github
} from 'lucide-react';
import { ArticleWithRelations } from '@/types';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');
  
  // Mock user data - would be from auth context in a real app
  const mockUser = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    bio: 'Software developer passionate about web technologies and open source.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    website: 'https://example.com',
    twitter: 'testuser',
    github: 'testuser',
    joinedDate: new Date('2023-01-01')
  };
  
  // Fetch user's bookmarks
  const { data: bookmarks = [], isLoading: isLoadingBookmarks } = useQuery<ArticleWithRelations[]>({
    queryKey: [`/api/users/${mockUser.id}/bookmarks`],
  });
  
  // Fetch user's reading history
  const { data: historyArticles = [], isLoading: isLoadingHistory } = useQuery<ArticleWithRelations[]>({
    queryKey: [`/api/users/${mockUser.id}/history`],
  });
  
  // Remove duplicate articles from history
  const uniqueHistoryArticles = Array.from(
    new Map(historyArticles.map(article => [article.id, article])).values()
  );
  
  // Mock user's posts (in a real app, this would be fetched from the API)
  const userPosts = [
    {
      id: 100,
      title: "My Experience with React Hooks",
      description: "A personal journey into functional React components and hooks",
      content: "This is my article about React hooks...",
      imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
      sourceId: 1,
      url: "/article/100",
      publishedAt: new Date('2023-05-10'),
      readTime: 5,
      source: {
        id: 1,
        name: "Personal Blog",
        logoUrl: null
      },
      tags: [
        { id: 1, name: "react", color: "#61DAFB" },
        { id: 7, name: "webdev", color: "#E91E63" }
      ],
      reactions: {
        likes: 24,
        comments: 5
      }
    }
  ];
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={mockUser.avatarUrl} />
                  <AvatarFallback className="text-2xl">{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-primary dark:text-white">{mockUser.name}</h1>
                      <p className="text-gray-600 dark:text-gray-400">@{mockUser.username}</p>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-4 md:mt-0 gap-2">
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </div>
                  
                  <p className="mt-3 text-gray-700 dark:text-gray-300">{mockUser.bio}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <UserCircle className="w-4 h-4 mr-1.5" />
                      <span>Joined {formatDate(mockUser.joinedDate)}</span>
                    </div>
                    
                    {mockUser.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1.5" />
                        <a href={`mailto:${mockUser.email}`} className="hover:text-secondary">{mockUser.email}</a>
                      </div>
                    )}
                    
                    {mockUser.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1.5" />
                        <a href={mockUser.website} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">{new URL(mockUser.website).hostname}</a>
                      </div>
                    )}
                    
                    {mockUser.twitter && (
                      <div className="flex items-center">
                        <Twitter className="w-4 h-4 mr-1.5" />
                        <a href={`https://twitter.com/${mockUser.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">@{mockUser.twitter}</a>
                      </div>
                    )}
                    
                    {mockUser.github && (
                      <div className="flex items-center">
                        <Github className="w-4 h-4 mr-1.5" />
                        <a href={`https://github.com/${mockUser.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">{mockUser.github}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <Tabs defaultValue="posts" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                <TabsTrigger value="history">Reading History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                {userPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userPosts.map(post => (
                      <ArticleCard 
                        key={post.id} 
                        article={post} 
                        userId={mockUser.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                      <Edit className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                      You haven't published any posts yet. Share your knowledge and experiences with the community!
                    </p>
                    <Link href="/new-post">
                      <Button variant="default" className="gap-2">
                        <Edit className="w-4 h-4" />
                        <span>Create New Post</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="bookmarks">
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarks.map(article => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        userId={mockUser.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                      <BookmarkIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                      You haven't bookmarked any articles yet. Find interesting content and save it for later.
                    </p>
                    <Link href="/">
                      <Button variant="default">Explore Articles</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history">
                {uniqueHistoryArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {uniqueHistoryArticles.map(article => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        userId={mockUser.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                      <HistoryIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No reading history</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                      You haven't read any articles yet. Start exploring to build your reading history.
                    </p>
                    <Link href="/">
                      <Button variant="default">Explore Articles</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}