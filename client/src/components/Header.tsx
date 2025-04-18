import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Link } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  user?: {
    id: number;
    username: string;
    avatarUrl?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
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
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              type="text"
              className="w-full py-2 pl-10 pr-14 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Search for topics, articles, or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
              <span>⌘</span>
              <span className="ml-1">K</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative" 
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
          </Button>
          
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
          
          <Link href="/upgrade">
            <Button variant="default" className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-secondary rounded-lg transition-colors">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Upgrade</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
