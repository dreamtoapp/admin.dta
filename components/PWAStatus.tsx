"use client";

import { useEffect, useState } from 'react';
import { Download, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
// Removed next-intl dependency

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAStatus() {
  // Removed useTranslations - using hardcoded English
  const [isMounted, setIsMounted] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Check if PWA is installed
    if (typeof window !== 'undefined') {
      const checkInstallation = () => {
        try {
          // Check multiple indicators of PWA installation
          const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
          const isInApp = window.matchMedia('(display-mode: minimal-ui)').matches;
          const hasNavigatorStandalone = 'standalone' in window.navigator && Boolean(window.navigator.standalone);

          const installationStatus: boolean = isStandalone || isInApp || hasNavigatorStandalone;
          setIsInstalled(installationStatus);
          console.log('PWA Status: Installation check:', { isStandalone, isInApp, hasNavigatorStandalone, installationStatus });
        } catch (error) {
          console.warn('Error checking PWA installation status:', error);
        }
      };

      checkInstallation();
      window.addEventListener('appinstalled', checkInstallation);

      // Check notification permission
      if ('Notification' in window) {
        try {
          setNotificationPermission(Notification.permission);
        } catch (error) {
          console.warn('Error checking notification permission:', error);
        }
      }

      // Listen for install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        try {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setCanInstall(true);
        } catch (error) {
          console.warn('Error handling install prompt:', error);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('appinstalled', checkInstallation);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  // Don't render until mounted
  if (!isMounted) {
    return null;
  }

  // Don't show if already installed
  if (isInstalled) {
    console.log('PWA Status: PWA is installed, hiding banner');
    return null;
  }

  // Don't show if no PWA features are available
  if (!canInstall && notificationPermission !== 'default' && notificationPermission !== 'denied') {
    return null;
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Install prompt not available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        toast.success('Installing...');
        setCanInstall(false);
        setDeferredPrompt(null);
      } else {
        toast.info('Installation cancelled');
      }
    } catch (error) {
      console.error('Error during installation:', error);
      toast.error('Installation failed');
    }
  };

  return (
    <div className="w-full bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-4 text-sm">
          {canInstall && (
            <Button
              onClick={handleInstallClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-primary hover:text-primary/80"
            >
              <Download className="w-4 h-4" />
              <span>Install Available</span>
            </Button>
          )}

          {notificationPermission === 'default' && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span>Enable Notifications</span>
            </div>
          )}

          {notificationPermission === 'denied' && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <BellOff className="w-4 h-4" />
              <span>Notifications Blocked</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}