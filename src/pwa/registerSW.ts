import { registerSW } from 'virtual:pwa-register';

export function registerAppServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    registerSW({
      immediate: true,
      onRegisterError(error) {
        console.warn('Service worker registration skipped:', error);
      },
    });
  } catch (error) {
    console.warn('Service worker initialization skipped:', error);
  }
}
