import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Rss, ExternalLink, Search, BookmarkPlus, Star, Shield, Edit } from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Source } from '@/types';

export default function TechSources() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data - would be from auth context in a real app
  const mockUser = {
    id: 1,
    username: 'testuser',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };
  
  // Fetch sources
  const { data: sources, isLoading } = useQuery<Source[]>({
    queryKey: ['/api/sources'],
  });
  
  // Featured sources (would come from API in a real app)
  const featuredSources = [
    {
      id: 1,
      name: 'Dev.to',
      description: 'A constructive and inclusive social network for software developers',
      url: 'https://dev.to',
      logoUrl: 'https://dev-to.s3.amazonaws.com/favicon.ico',
      category: 'Community',
      tags: ['webdev', 'javascript', 'opensource'],
      featured: true
    },
    {
      id: 2,
      name: 'Medium - Technology',
      description: 'Stories and thoughts on the latest tech trends and innovations',
      url: 'https://medium.com/topic/technology',
      logoUrl: 'https://miro.medium.com/1*m-R_BkNf1Qjr1YbyOIJY2w.png',
      category: 'Publications',
      tags: ['ai', 'data-science', 'startup'],
      featured: true
    },
    {
      id: 3,
      name: 'Hacker News',
      description: 'Social news website focusing on computer science and entrepreneurship',
      url: 'https://news.ycombinator.com',
      logoUrl: 'https://news.ycombinator.com/favicon.ico',
      category: 'News Aggregator',
      tags: ['tech', 'startup', 'programming'],
      featured: true
    },
    {
      id: 4,
      name: 'CSS-Tricks',
      description: 'Tips, tricks, and techniques on using CSS',
      url: 'https://css-tricks.com',
      logoUrl: 'https://css-tricks.com/favicon.ico',
      category: 'Tutorial Site',
      tags: ['css', 'webdev', 'frontend'],
      featured: true
    },
    {
      id: 5,
      name: 'GitHub Blog',
      description: 'Updates, ideas, and inspiration from GitHub to help developers build and design software',
      url: 'https://github.blog',
      logoUrl: 'https://github.githubassets.com/favicons/favicon.png',
      category: 'Company Blog',
      tags: ['github', 'opensource', 'development'],
      featured: true
    },
    {
      id: 6,
      name: 'Smashing Magazine',
      description: 'For web designers and developers',
      url: 'https://www.smashingmagazine.com',
      logoUrl: 'https://www.smashingmagazine.com/images/favicon/favicon.png',
      category: 'Publications',
      tags: ['design', 'webdev', 'ux'],
      featured: true
    }
  ];
  
  // Filter sources based on search
  const filteredSources = featuredSources.filter(source => 
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Group sources by category
  const sourcesByCategory = filteredSources.reduce((acc, source) => {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, typeof featuredSources>);
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-white">Tech News Resources</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Discover the best sources for tech news, tutorials, and articles
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex-shrink-0">
                <Button className="mr-2">
                  <Rss className="w-4 h-4 mr-2" />
                  Import RSS Feed
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Suggest Source
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search for tech news sources by name, description, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <section>
                <h2 className="text-xl font-bold text-primary dark:text-white mb-4">Featured Sources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSources.slice(0, 6).map(source => (
                    <div key={source.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
                      <div className="p-5">
                        <div className="flex items-center mb-4">
                          <img 
                            src={source.logoUrl} 
                            alt={source.name} 
                            className="h-10 w-10 rounded-md mr-3 object-contain bg-white"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-primary dark:text-white">{source.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{source.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {source.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {source.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-gray-500 hover:text-secondary"
                          >
                            <BookmarkPlus className="w-4 h-4 mr-1" />
                            <span className="text-xs">Follow</span>
                          </Button>
                          
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-secondary hover:text-accent text-sm font-medium flex items-center"
                          >
                            <span>Visit</span>
                            <ExternalLink className="ml-1 w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {Object.entries(sourcesByCategory).map(([category, sources]) => (
                <section key={category}>
                  <h2 className="text-xl font-bold text-primary dark:text-white mb-4">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sources.map(source => (
                      <div key={source.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
                        <div className="p-5">
                          <div className="flex items-center mb-4">
                            <img 
                              src={source.logoUrl} 
                              alt={source.name} 
                              className="h-10 w-10 rounded-md mr-3 object-contain bg-white"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-primary dark:text-white">{source.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{source.category}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {source.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {source.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-gray-500 hover:text-secondary"
                            >
                              <BookmarkPlus className="w-4 h-4 mr-1" />
                              <span className="text-xs">Follow</span>
                            </Button>
                            
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-secondary hover:text-accent text-sm font-medium flex items-center"
                            >
                              <span>Visit</span>
                              <ExternalLink className="ml-1 w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              
              <section>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden shadow-md">
                  <div className="bg-opacity-90 bg-gray-900 bg-pattern p-6 md:p-8">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
                      <div className="mb-6 md:mb-0 md:mr-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                          Want to add your own RSS feed?
                        </h2>
                        <p className="text-blue-200 mb-4">
                          Share your favorite tech news sources and blogs with the community
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                          <Button variant="default" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            <Rss className="w-4 h-4 mr-2" />
                            Submit RSS Feed
                          </Button>
                          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                            Learn More
                          </Button>
                        </div>
                      </div>
                      <div className="hidden md:block w-1/3">
                        <Rss className="w-24 h-24 text-blue-300/30 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}