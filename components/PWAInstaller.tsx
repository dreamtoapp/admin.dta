"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, X, Bell, BellOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to prevent hydration mismatch
    setIsMounted(true);

    // Check if PWA is already installed
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      toast.success('DreamToApp has been installed successfully!');
    };

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial online status
    setIsOnline(typeof window !== 'undefined' ? navigator.onLine : true);

    // Check notification permission
    const checkNotificationPermission = () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            try {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  try {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      // New content is available
                      toast.info('New version available! Refresh to update.');
                    }
                  } catch (error) {
                    console.warn('Error handling service worker state change:', error);
                  }
                });
              }
            } catch (error) {
              console.warn('Error handling service worker update:', error);
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // Initialize
    checkNotificationPermission();
    registerServiceWorker();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
      toast.error('Installation failed. Please try again.');
    }
  };

  const handleNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      } else {
        toast.info('Notifications permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
    }
  };

  const sendTestNotification = () => {
    if (typeof window === 'undefined') return;

    if (notificationPermission === 'granted') {
      new Notification('DreamToApp', {
        body: 'Welcome to DreamToApp! This is a test notification.',
        icon: '/assets/dreamtoapp/logo.webp',
        badge: '/assets/dreamtoapp/logo.webp',
        tag: 'test-notification'
      });
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Don't show if already installed or not supported
  if (isInstalled || !('serviceWorker' in navigator)) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Install DreamToApp
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get quick access to DreamToApp from your home screen
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install
                </Button>
                <Button
                  onClick={() => setShowInstallPrompt(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              {/* Online Status */}
              <div className={`flex items-center gap-1 ${isOnline ? 'text-success' : 'text-destructive'}`}>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {/* PWA Status */}
              <div className="text-muted-foreground">
                {isInstalled ? 'Installed' : 'Web App'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Permission */}
              {notificationPermission === 'default' && (
                <Button
                  onClick={handleNotificationPermission}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  Enable Notifications
                </Button>
              )}

              {notificationPermission === 'granted' && (
                <Button
                  onClick={sendTestNotification}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  Test Notification
                </Button>
              )}

              {notificationPermission === 'denied' && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <BellOff className="w-3 h-3" />
                  Notifications Blocked
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 