import { Link, useLocation } from 'wouter';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavbar() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', link: '/' },
    { icon: <Compass className="w-6 h-6" />, label: 'Explore', link: '/explore' },
    { icon: <Bookmark className="w-6 h-6" />, label: 'Saved', link: '/bookmarks' },
    { icon: <User className="w-6 h-6" />, label: 'Profile', link: '/profile' },
  ];
  
  const isActive = (link: string) => {
    if (link === '/' && location === '/') return true;
    if (link !== '/' && location.startsWith(link)) return true;
    return false;
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, i) => (
          <Link key={i} href={item.link}>
            <a className={cn(
              "flex flex-col items-center p-2",
              isActive(item.link) 
                ? "text-secondary" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
