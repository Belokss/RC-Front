import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: '/', // Обычно для Railway нужно корневое значение. Измените, если используется поддиректория
  define: {
    global: 'window'
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  },
  server: {
    host: '0.0.0.0', // Railway требует, чтобы сервер слушал на этом хосте
    port: parseInt(process.env.PORT) || 3000, // Используем порт из окружения или 3000
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000', // Используйте VITE_API_URL для динамической настройки API
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: '0.0.0.0', // Аналогично для preview
    port: parseInt(process.env.PORT) || 3000
  }
});
