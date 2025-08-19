#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting optimized build for Netlify...');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('rm -rf dist', { stdio: 'inherit' });
} catch (error) {
  // Directory might not exist, continue
}

// Step 2: Generate Prisma Client
console.log('🔧 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  process.exit(1);
}

// Step 3: Build the application
console.log('📦 Building application...');
execSync('npm run build:client', { stdio: 'inherit' });

// Step 4: Optimize bundle
console.log('⚡ Optimizing bundle...');

// Add service worker for caching
const swContent = `
const CACHE_NAME = 'ss-ecom-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
`;

try {
  writeFileSync(join(process.cwd(), 'dist/spa/sw.js'), swContent);
  console.log('✅ Service worker created');
} catch (error) {
  console.warn('⚠️  Could not create service worker:', error.message);
}

// Step 5: Create manifest.json for PWA
const manifest = {
  name: 'SS Stores',
  short_name: 'SS Stores',
  description: 'Modern e-commerce platform',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#7c3aed',
  icons: [
    {
      src: '/favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/x-icon'
    }
  ]
};

try {
  writeFileSync(
    join(process.cwd(), 'dist/spa/manifest.json'), 
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ PWA manifest created');
} catch (error) {
  console.warn('⚠️  Could not create manifest:', error.message);
}

// Step 6: Generate bundle analysis
console.log('📊 Analyzing bundle...');
try {
  execSync('npx vite-bundle-analyzer dist/spa --mode static --open false', { 
    stdio: 'inherit' 
  });
} catch (error) {
  console.warn('⚠️  Bundle analysis failed:', error.message);
}

console.log('✅ Build optimization complete!');
console.log('📁 Output directory: dist/spa');
console.log('🌐 Ready for Netlify deployment');
