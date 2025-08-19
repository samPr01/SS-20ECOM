import { useEffect, useState } from 'react';

// Performance monitoring hook
export function usePerformance() {
  useEffect(() => {
    // Web Vitals monitoring
    if ('web-vitals' in window) return;

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/api/placeholder/400/300', // Common placeholder
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Prefetch likely next pages
    const prefetchPages = () => {
      const likelyPages = ['/products', '/signin', '/cart'];
      
      likelyPages.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Optimize images with intersection observer
    const optimizeImages = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    };

    // Run optimizations
    preloadCriticalResources();
    prefetchPages();
    optimizeImages();

    // Cleanup
    return () => {
      // Remove preloaded resources if needed
    };
  }, []);
}

// Hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


