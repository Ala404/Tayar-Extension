import { useState } from 'react';
import { Link } from 'wouter';
import { Bookmark, ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArticleWithRelations } from '@/types';
import { formatTimeAgo, stripHtmlTags } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ArticleCardProps {
  article: ArticleWithRelations;
  userId?: number;
  className?: string;
}

export function ArticleCard({ article, userId, className = '' }: ArticleCardProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(article.bookmarked || false);
  const [reaction, setReaction] = useState({
    likes: article.reactions?.likes || 0,
    comments: article.reactions?.comments || 0
  });

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: t('common.authRequired'),
        description: t('common.loginToBookmark'),
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (!isBookmarked) {
        await apiRequest('POST', '/api/bookmarks', {
          userId,
          articleId: article.id,
          createdAt: new Date()
        });
        setIsBookmarked(true);
        toast({
          title: t('common.articleBookmarked'),
          description: t('common.articleAddedToBookmarks')
        });
      } else {
        await apiRequest('DELETE', '/api/bookmarks', {
          userId,
          articleId: article.id
        });
        setIsBookmarked(false);
        toast({
          title: t('common.bookmarkRemoved'),
          description: t('common.articleRemovedFromBookmarks')
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.bookmarkUpdateFailed'),
        variant: "destructive"
      });
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: t('common.authRequired'),
        description: t('common.loginToLike'),
        variant: "destructive"
      });
      return;
    }
    
    try {
      await apiRequest('POST', '/api/reactions', {
        userId,
        articleId: article.id,
        type: 'like'
      });
      
      setReaction(prev => ({
        ...prev,
        likes: prev.likes + 1
      }));
      
      toast({
        title: t('common.articleLiked'),
        description: t('common.youLikedArticle')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.likeUpdateFailed'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`bg-card dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover card-transition overflow-hidden ${className}`}>
      <div className="relative">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          {article.tags.map(tag => (
            <Badge key={tag.id} variant={tag.name as any}>#{tag.name}</Badge>
          ))}
        </div>
        <Button 
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 p-1.5 rounded-full bg-white bg-opacity-90 ${isBookmarked ? 'text-secondary' : 'text-gray-600 hover:text-secondary'} transition-colors`}
          onClick={handleBookmark}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-3">
          {article.source.logoUrl && (
            <img 
              src={article.source.logoUrl} 
              alt={article.source.name} 
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{article.source.name}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(article.publishedAt)}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-secondary transition-colors">
          <Link href={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {stripHtmlTags(article.description)}
        </p>
        
        {article.url && (
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block text-xs text-secondary hover:underline mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {t('article.readOriginal', { source: article.source.name })}
          </a>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-500 hover:text-secondary transition-colors p-0 h-auto"
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span className="text-xs">{reaction.likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-500 hover:text-secondary transition-colors p-0 h-auto"
              asChild
            >
              <Link href={`/article/${article.id}#comments`}>
                <MessageSquare className="w-4 h-4 mr-1" />
                <span className="text-xs">{reaction.comments}</span>
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-secondary transition-colors p-1"
              title={t('common.shareArticle')}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.description,
                    url: article.url || window.location.origin + `/article/${article.id}`
                  }).catch(err => console.log('Error sharing', err));
                } else {
                  navigator.clipboard.writeText(article.url || window.location.origin + `/article/${article.id}`);
                  toast({
                    title: t('common.linkCopied'),
                    description: t('common.articleLinkCopied')
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-4 mx-2 bg-gray-200 dark:bg-gray-700" />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-secondary transition-colors p-1"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
