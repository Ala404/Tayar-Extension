import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Tag } from '@/types';

export function RightSidebar() {
  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['/api/tags']
  });
  
  const trendingTopics = tags.slice(0, 5).map((tag, idx) => ({
    ...tag,
    position: idx + 1,
    articles: Math.floor(Math.random() * 5000) + 1000
  }));
  
  const developers = [
    {
      id: 1,
      name: 'Alex Morgan',
      role: 'Senior Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      following: false
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      following: false
    },
    {
      id: 3,
      name: 'James Wilson',
      role: 'DevOps Specialist',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
      following: true
    }
  ];
  
  const readingList = [
    {
      id: 1,
      title: 'Building Micro-Frontends with Module Federation',
      thumbnail: 'https://images.unsplash.com/photo-1599658880436-c61792e70672',
      readTime: 2,
      savedDaysAgo: 3
    },
    {
      id: 2,
      title: 'Understanding Web Accessibility: WCAG 2.1 Guidelines',
      thumbnail: 'https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6',
      readTime: 4,
      savedDaysAgo: 7
    }
  ];
  
  return (
    <aside className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-800 overflow-y-auto px-4 py-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary dark:text-white mb-4">Trending Topics</h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, idx) => (
            <div key={idx} className="flex items-center">
              <span 
                className={`w-8 h-8 flex items-center justify-center 
                  ${idx === 0 ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 
                    idx === 1 ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                      idx === 2 ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' :
                        idx === 3 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                  } rounded-full text-xs font-bold`}
              >
                {topic.position}
              </span>
              <span className="ml-3 text-text dark:text-gray-300 font-medium">#{topic.name}</span>
              <span className="ml-auto text-xs text-gray-500">{(topic.articles / 1000).toFixed(1)}k articles</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-primary dark:text-white mb-4">Who to Follow</h3>
        <div className="space-y-4">
          {developers.map(dev => (
            <div key={dev.id} className="flex items-center">
              <img 
                src={dev.avatar} 
                alt={dev.name} 
                className="h-10 w-10 rounded-full object-cover" 
              />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-text dark:text-gray-200">{dev.name}</h4>
                <p className="text-xs text-gray-500">{dev.role}</p>
              </div>
              <Button 
                variant={dev.following ? "outline" : "default"}
                size="sm"
                className={`ml-auto text-xs ${dev.following ? 
                  'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' : 
                  'text-secondary border border-secondary hover:bg-secondary hover:text-white'
                } rounded-full px-3 py-1`}
              >
                {dev.following ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Link href="/discover">
            <a className="text-xs text-secondary hover:underline">Show more</a>
          </Link>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold text-primary dark:text-white mb-4">Reading List</h3>
        <div className="space-y-3">
          {readingList.map(item => (
            <div key={item.id} className="group flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-text dark:text-gray-200 group-hover:text-secondary transition-colors line-clamp-2">
                  <Link href={`/article/${item.id}`}>{item.title}</Link>
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {item.readTime} min read · Saved {item.savedDaysAgo} day{item.savedDaysAgo !== 1 ? 's' : ''} ago
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Link href="/bookmarks">
            <a className="text-xs text-secondary hover:underline">View all saved articles</a>
          </Link>
        </div>
      </div>
    </aside>
  );
}
