import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: '/', // Путь по умолчанию для деплоя на корень
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
    host: '0.0.0.0', // Добавь хост 0.0.0.0, чтобы Railway мог обращаться к серверу
    open: true,
    port: parseInt(process.env.PORT) || 3000, // Используй PORT из окружения, если доступен
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: '0.0.0.0', // Аналогично, чтобы preview слушал на 0.0.0.0
    open: true,
    port: parseInt(process.env.PORT) || 3000 // Используй PORT из окружения
  }
});
