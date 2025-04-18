import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, Users, Compass, Clock, Settings, 
  ChevronDown, ChevronLeft, ChevronRight, Bookmark, Folder, Plus,
  Rss, Globe, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  collapsible?: boolean;
}

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  link: string;
  count?: number;
}

export function Sidebar() {
  const [location] = useLocation();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const mainNav: SidebarItem[] = [
    { label: 'My Feed', icon: <Home className="w-5 h-5 mr-3 text-gray-500" />, link: '/' },
    { label: 'Following', icon: <Users className="w-5 h-5 mr-3 text-gray-500" />, link: '/following' },
    { label: 'Explore', icon: <Compass className="w-5 h-5 mr-3 text-gray-500" />, link: '/explore' },
    { label: 'History', icon: <Clock className="w-5 h-5 mr-3 text-gray-500" />, link: '/history' },
    { label: 'Tech Sources', icon: <Rss className="w-5 h-5 mr-3 text-gray-500" />, link: '/tech-sources' },
    { label: 'Settings', icon: <Settings className="w-5 h-5 mr-3 text-gray-500" />, link: '/settings' },
  ];
  
  const customFeeds: SidebarItem[] = [
    { label: 'Frontend Development', color: 'bg-purple-500', link: '/tag/frontend' },
    { label: 'Backend Technologies', color: 'bg-green-500', link: '/tag/backend' },
    { label: 'DevOps & Cloud', color: 'bg-blue-500', link: '/tag/devops' },
  ];
  
  const bookmarks: SidebarItem[] = [
    { label: 'Saved for Later', icon: <Bookmark className="w-5 h-5 mr-3 text-gray-500" />, link: '/bookmarks' },
    { label: 'JavaScript Resources', icon: <Folder className="w-5 h-5 mr-3 text-gray-500" />, link: '/bookmarks/javascript' },
  ];
  
  const popularTags: SidebarItem[] = [
    { label: '#javascript', link: '/tag/javascript', count: 5200 },
    { label: '#react', link: '/tag/react', count: 3800 },
    { label: '#webdev', link: '/tag/webdev', count: 2900 },
  ];
  
  const sections: SidebarSection[] = [
    { title: '', items: mainNav },
    { title: 'Custom Feeds', items: customFeeds, collapsible: true },
    { title: 'Bookmarks', items: bookmarks, collapsible: true },
    { title: 'Popular Tags', items: popularTags, collapsible: true },
  ];
  
  const isActive = (link: string) => {
    if (link === '/' && location === '/') return true;
    if (link !== '/' && location.startsWith(link)) return true;
    return false;
  };
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  return (
    <aside className={cn(
      "hidden md:flex md:flex-col border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "p-4 flex",
        isSidebarCollapsed ? "justify-center" : ""
      )}>
        {!isSidebarCollapsed ? (
          <Link href="/new-post" className="w-full">
            <Button className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-accent hover:bg-secondary rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              <span>New Post</span>
            </Button>
          </Link>
        ) : (
          <Button 
            className="flex items-center justify-center p-2 text-white bg-accent hover:bg-secondary rounded-lg transition-colors"
            title="New Post"
            onClick={() => window.location.href = '/new-post'}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="absolute right-0 top-16 transform translate-x-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-6 h-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 px-2 py-2 space-y-1">
        {sections.map((section, i) => (
          <div key={i} className={i > 0 ? "pt-4 mt-4 border-t border-gray-200 dark:border-gray-800" : ""}>
            {!isSidebarCollapsed && section.title && (
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h3>
                {section.collapsible && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 h-auto p-0"
                    onClick={() => toggleSection(section.title)}
                  >
                    <ChevronDown className={`w-4 h-4 transform ${collapsedSections[section.title] ? 'rotate-180' : ''}`} />
                  </Button>
                )}
              </div>
            )}
            
            {(!section.collapsible || !collapsedSections[section.title]) ? (
              <div className="space-y-1">
                {section.items.map((item, j) => (
                  <div key={j}>
                    <Link href={item.link}>
                      <div 
                        className={cn(
                          "sidebar-item flex items-center py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                          isActive(item.link)
                            ? "text-text dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
                            : "text-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                          isSidebarCollapsed ? "justify-center px-2" : "px-3"
                        )}
                        title={isSidebarCollapsed ? item.label : undefined}
                      >
                        {item.icon ? (
                          item.icon
                        ) : (
                          item.color 
                            ? <span className={`w-2 h-2 ${!isSidebarCollapsed && "mr-3"} ${item.color} rounded-full`}></span>
                            : !isSidebarCollapsed && <span className="text-xs font-medium mr-3 py-1 px-2 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{item.label}</span>
                        )}
                        
                        {!isSidebarCollapsed && (item.icon || item.color) && <span>{item.label}</span>}
                        
                        {!isSidebarCollapsed && item.count && <span className="ml-auto text-xs text-gray-500">{item.count}</span>}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}
