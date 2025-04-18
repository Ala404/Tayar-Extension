import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ImageIcon, Link as LinkIcon, Paperclip, X, 
  ChevronDown, Tag, ExternalLink 
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(120, 'Title is too long'),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  content: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  tags: z.array(z.string()).min(1, 'Please select at least one tag'),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function NewPost() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Mock user data - would be from auth context in a real app
  const mockUser = {
    id: 1,
    username: 'testuser',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };

  // Sample tags available for selection
  const availableTags = [
    { id: 1, name: 'javascript', color: '#F7DF1E' },
    { id: 2, name: 'react', color: '#61DAFB' },
    { id: 3, name: 'cloud', color: '#4285F4' },
    { id: 4, name: 'database', color: '#F29111' },
    { id: 5, name: 'security', color: '#FF5722' },
    { id: 6, name: 'ai', color: '#9C27B0' },
    { id: 7, name: 'webdev', color: '#E91E63' },
    { id: 8, name: 'python', color: '#3776AB' },
    { id: 9, name: 'devops', color: '#05122A' }
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      content: '',
      thumbnailUrl: '',
      tags: [],
    },
  });

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setValue('tags', newTags);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  const filteredTags = availableTags
    .filter(tag => !selectedTags.includes(tag.name))
    .filter(tag => tag.name.toLowerCase().includes(tagInput.toLowerCase()));

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would submit to your API
      await apiRequest('POST', '/api/articles', {
        ...data,
        userId: mockUser.id,
        sourceId: 1, // Assuming the user's posts are from a specific source
        publishedAt: new Date(),
        readTime: Math.ceil(data.content?.length || 0 / 1000) || 3 // Roughly estimate read time
      });
      
      toast({
        title: 'Post submitted successfully',
        description: 'Your article has been posted',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error submitting post',
        description: 'There was a problem submitting your post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch form values for preview
  const watchTitle = watch('title');
  const watchDescription = watch('description');
  const watchContent = watch('content');
  const watchUrl = watch('url');

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-primary dark:text-white">Share Something with the Community</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new post or share an interesting article you've found
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <Tabs defaultValue="newPost" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="newPost">New Post</TabsTrigger>
                    <TabsTrigger value="shareLink">Share a Link</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="newPost">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Post Title*
                          </label>
                          <Input
                            id="title"
                            placeholder="Give your post a descriptive title"
                            {...register('title')}
                            className={errors.title ? 'border-red-500' : ''}
                          />
                          {errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                          )}
                          <div className="mt-1 text-xs text-right text-gray-500">
                            {watchTitle?.length || 0}/120
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Brief Description*
                          </label>
                          <Textarea
                            id="description"
                            placeholder="Provide a short description of your post"
                            rows={3}
                            {...register('description')}
                            className={errors.description ? 'border-red-500' : ''}
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Post Content*
                            </label>
                            <div className="flex space-x-1">
                              <Button
                                type="button"
                                variant={selectedTab === 'write' ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTab('write')}
                              >
                                Write
                              </Button>
                              <Button
                                type="button"
                                variant={selectedTab === 'preview' ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTab('preview')}
                                disabled={!watchContent}
                              >
                                Preview
                              </Button>
                            </div>
                          </div>
                          
                          {selectedTab === 'write' ? (
                            <Textarea
                              id="content"
                              placeholder="Write your post content here..."
                              rows={10}
                              {...register('content')}
                              className={errors.content ? 'border-red-500' : ''}
                            />
                          ) : (
                            <div className="border rounded-md p-4 min-h-[250px] prose dark:prose-invert max-w-none">
                              {watchContent || <span className="text-gray-400">Nothing to preview yet...</span>}
                            </div>
                          )}
                          
                          {errors.content && (
                            <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Thumbnail Image (Optional)
                          </label>
                          <div className="flex">
                            <Input
                              placeholder="Enter image URL"
                              {...register('thumbnailUrl')}
                              className="flex-1 rounded-r-none"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-l-none border-l-0"
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Browse
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tags*
                          </label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {selectedTags.map(tag => (
                              <Badge key={tag} variant="outline" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700">
                                #{tag}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveTag(tag)}
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                            
                            <div className="relative">
                              <Input
                                placeholder="Search or add tags..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                className="w-40 py-1 text-sm"
                              />
                              
                              {tagInput && filteredTags.length > 0 && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                                  {filteredTags.map(tag => (
                                    <div
                                      key={tag.id}
                                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                      onClick={() => handleTagSelect(tag.name)}
                                    >
                                      <span
                                        className="w-2 h-2 rounded-full mr-2"
                                        style={{ backgroundColor: tag.color }}
                                      ></span>
                                      {tag.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {errors.tags && (
                            <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center mt-6 space-x-4">
                          <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none">
                            {isSubmitting ? 'Submitting...' : 'Publish Post'}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => navigate('/')}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="shareLink">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Article URL*
                          </label>
                          <div className="flex">
                            <Input
                              id="url"
                              placeholder="https://example.com/article"
                              {...register('url')}
                              className={`flex-1 ${errors.url ? 'border-red-500' : ''}`}
                            />
                            <Button
                              type="button"
                              variant="default"
                              className="ml-2"
                              onClick={() => {
                                // In a real app, you'd fetch metadata here
                                toast({
                                  title: 'Fetching article data',
                                  description: 'This would fetch title, description and image from the URL',
                                });
                              }}
                            >
                              Fetch Metadata
                            </Button>
                          </div>
                          {errors.url && (
                            <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title*
                          </label>
                          <Input
                            id="title"
                            placeholder="Article title"
                            {...register('title')}
                            className={errors.title ? 'border-red-500' : ''}
                          />
                          {errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description*
                          </label>
                          <Textarea
                            id="description"
                            placeholder="Brief description of the article"
                            rows={3}
                            {...register('description')}
                            className={errors.description ? 'border-red-500' : ''}
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Thumbnail Image (Optional)
                          </label>
                          <div className="flex">
                            <Input
                              placeholder="Enter image URL"
                              {...register('thumbnailUrl')}
                              className="flex-1 rounded-r-none"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-l-none border-l-0"
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Browse
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tags*
                          </label>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {selectedTags.map(tag => (
                              <Badge key={tag} variant="outline" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700">
                                #{tag}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveTag(tag)}
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                            
                            <div className="relative">
                              <Input
                                placeholder="Search or add tags..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                className="w-40 py-1 text-sm"
                              />
                              
                              {tagInput && filteredTags.length > 0 && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                                  {filteredTags.map(tag => (
                                    <div
                                      key={tag.id}
                                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                      onClick={() => handleTagSelect(tag.name)}
                                    >
                                      <span
                                        className="w-2 h-2 rounded-full mr-2"
                                        style={{ backgroundColor: tag.color }}
                                      ></span>
                                      {tag.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {errors.tags && (
                            <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>
                          )}
                        </div>
                        
                        {watchUrl && (
                          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              <a 
                                href={watchUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-secondary hover:underline"
                              >
                                {watchUrl}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center mt-6 space-x-4">
                          <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none">
                            {isSubmitting ? 'Submitting...' : 'Share Article'}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => navigate('/')}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}