// Registrar Service Worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registrado:', registration.scope);

      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nova versão disponível!');
              
              // Notificar usuário sobre atualização
              if (confirm('Nova versão disponível! Recarregar agora?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      // Limpar cache periodicamente
      setInterval(() => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage('CLEAR_CACHE');
        }
      }, 1000 * 60 * 30); // A cada 30 minutos

      return registration;
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
    }
  } else {
    console.warn('⚠️ Service Worker não suportado neste navegador');
  }
};

// Verificar se está instalado como PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Verificar se pode instalar PWA
export const canInstallPWA = (): boolean => {
  return 'BeforeInstallPromptEvent' in window;
};

// Verificar status online/offline
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Adicionar listener para mudanças de conectividade
export const onConnectivityChange = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};