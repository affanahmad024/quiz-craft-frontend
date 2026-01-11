import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-utils': ['axios', 'dayjs', 'react-hot-toast', 'framer-motion'],

          // Context providers
          'contexts': [
            './src/contexts/auth/AuthContextProvider.jsx',
            './src/contexts/quiz/QuizContextProvider.jsx',
            './src/contexts/attempt/AttemptContextProvider.jsx',
            './src/contexts/discovery/DiscoveryContextProvider.jsx',
            './src/contexts/profile/ProfileContextProvider.jsx',
            './src/contexts/admin/AdminContextProvider.jsx',
            './src/contexts/theme/ThemeModeContext.jsx',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize CSS
    cssCodeSplit: true,
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Minification (esbuild is default and faster)
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material'],
  },
})
