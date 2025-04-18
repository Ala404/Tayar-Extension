import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // Languages with their display names and direction
  const languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'fr', name: 'Français', dir: 'ltr' },
  ];

  // After mounting, we can access the window object
  useEffect(() => {
    setMounted(true);
    
    // Set the document direction based on the current language
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      document.documentElement.dir = currentLang.dir;
      document.documentElement.lang = currentLang.code;
    }
  }, [i18n.language]);

  if (!mounted) {
    return null;
  }

  // Handle language change
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      // Update document direction and language attribute
      const selectedLang = languages.find(lang => lang.code === lng);
      if (selectedLang) {
        document.documentElement.dir = selectedLang.dir;
        document.documentElement.lang = selectedLang.code;
      }
    });
  };

  // Get the current language name for display
  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    return currentLang ? currentLang.name : 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Change Language"
        >
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={i18n.language === lang.code ? 'bg-gray-100 dark:bg-gray-800' : ''}
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}