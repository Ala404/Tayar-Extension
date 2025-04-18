import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavbar } from '@/components/MobileNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      digest: false
    },
    display: {
      darkMode: false,
      compactView: false,
      reduceAnimations: false
    },
    privacy: {
      shareReadingHistory: true,
      allowRecommendations: true
    }
  });
  
  const updateSetting = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };
  
  // TODO: Replace with actual user data once auth is implemented
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900">
      <Header user={mockUser} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="px-3 py-4 sm:px-6 max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account preferences and application settings.
              </p>
            </div>
            
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-6">
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Username</Label>
                      <input 
                        type="text" 
                        value={mockUser.username}
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-background dark:bg-gray-900"
                      />
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <input 
                        type="email" 
                        value={mockUser.email}
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-background dark:bg-gray-900"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Current Password</Label>
                      <input 
                        type="password" 
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-background dark:bg-gray-900"
                      />
                    </div>
                    
                    <div>
                      <Label>New Password</Label>
                      <input 
                        type="password" 
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-background dark:bg-gray-900"
                      />
                    </div>
                    
                    <div>
                      <Label>Confirm New Password</Label>
                      <input 
                        type="password" 
                        className="w-full p-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md bg-background dark:bg-gray-900"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Change Password</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications about new articles via email
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.email}
                        onCheckedChange={value => updateSetting('notifications', 'email', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.push}
                        onCheckedChange={value => updateSetting('notifications', 'push', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive a weekly summary of top articles
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications.digest}
                        onCheckedChange={value => updateSetting('notifications', 'digest', value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-6">
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Use dark theme for the application
                        </p>
                      </div>
                      <Switch 
                        checked={settings.display.darkMode}
                        onCheckedChange={value => updateSetting('display', 'darkMode', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Compact View</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Show more content with smaller cards
                        </p>
                      </div>
                      <Switch 
                        checked={settings.display.compactView}
                        onCheckedChange={value => updateSetting('display', 'compactView', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reduce Animations</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Minimize animations for better performance
                        </p>
                      </div>
                      <Switch 
                        checked={settings.display.reduceAnimations}
                        onCheckedChange={value => updateSetting('display', 'reduceAnimations', value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-6">
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Share Reading History</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Allow the app to use your reading history for better recommendations
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.shareReadingHistory}
                        onCheckedChange={value => updateSetting('privacy', 'shareReadingHistory', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Personalized Recommendations</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive article recommendations based on your interests
                        </p>
                      </div>
                      <Switch 
                        checked={settings.privacy.allowRecommendations}
                        onCheckedChange={value => updateSetting('privacy', 'allowRecommendations', value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-card dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                  
                  <div className="space-y-4">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <MobileNavbar />
    </div>
  );
}
