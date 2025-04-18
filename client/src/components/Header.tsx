import { useState, useEffect, useRef } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { ArticleWithRelations } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  user?: {
    id: number;
    username: string;
    avatarUrl?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [location, navigate] = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch search results
  const { data: searchResults, isFetching } = useQuery<ArticleWithRelations[]>({
    queryKey: ['/api/articles', { search: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setIsSearchActive(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchActive(true);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      // Escape to blur search
      if (e.key === 'Escape') {
        setIsSearchActive(false);
        setShowResults(false);
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show search results when typing
  useEffect(() => {
    if (searchQuery.length > 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  // Sample notifications data
  const notifications = [
    { 
      id: 1, 
      title: "New comment on your post", 
      message: "John Doe replied to your article", 
      time: "5m ago",
      read: false
    },
    { 
      id: 2, 
      title: "Your article was featured", 
      message: "Your post about React hooks was featured on the homepage", 
      time: "1h ago",
      read: false
    },
    { 
      id: 3, 
      title: "New tag suggestion", 
      message: "The tag #typescript was suggested for your article", 
      time: "3h ago",
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <svg className="w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="ml-2 text-xl font-bold text-primary dark:text-white">Tayar</span>
            </div>
          </Link>
        </div>
        
        <div className="relative flex-1 max-w-xl mx-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <Input
                ref={searchInputRef}
                type="text"
                className="w-full py-2 pl-10 pr-14 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Search for topics, articles, or sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => {
                  // Delay hiding results to allow clicks on the results
                  setTimeout(() => setIsSearchActive(false), 200);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-10 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
                <span>⌘</span>
                <span className="ml-1">K</span>
              </div>
            </div>
          </form>
          
          {showResults && isSearchActive && searchQuery.length > 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                  {isFetching ? 'Searching...' : 'Search Results'}
                </h3>
                
                {isFetching ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary"></div>
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map(article => (
                      <Link key={article.id} href={`/article/${article.id}`}>
                        <div
                          className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md"
                          onClick={() => setShowResults(false)}
                        >
                          <div className="flex items-start">
                            {article.imageUrl && (
                              <div className="flex-shrink-0 w-10 h-10 mr-2">
                                <img 
                                  src={article.imageUrl} 
                                  alt={article.title} 
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {article.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {article.source.name}
                              </p>
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap mt-1">
                                  {article.tags.slice(0, 2).map(tag => (
                                    <Badge 
                                      key={tag.id} 
                                      variant={tag.name as any}
                                      className="mr-1 text-xs px-1 py-0 h-auto"
                                    >
                                      #{tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    <div className="px-2 pt-2 pb-1 mt-1 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-secondary text-sm"
                        onClick={handleSearch}
                      >
                        View all results for "{searchQuery}"
                      </Button>
                    </div>
                  </div>
                ) : searchQuery.length > 2 ? (
                  <div className="px-2 py-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative" 
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      !notification.read ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notification.read ? 'bg-secondary' : 'bg-transparent'}`}></div>
                      <div className="ml-2 flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="text-xs w-full">View all notifications</Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
          
          {user ? (
            <Link href="/profile">
              <div className="group relative flex items-center cursor-pointer">
                <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-secondary">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="text-sm px-3 py-1">Login</Button>
            </Link>
          )}
          
          <Link href="/new-post">
            <Button variant="default" className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-secondary rounded-lg transition-colors">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>New Post</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
