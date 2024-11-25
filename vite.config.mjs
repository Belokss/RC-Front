import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: process.env.VITE_BASE_URL || '/', // Указываем базовый путь
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
    host: true, // Это важно для Railway, чтобы слушать внешний адрес
    port: parseInt(process.env.PORT) || 3000, // Railway задаёт порт через переменную PORT
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000', // URL API
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: true, // Аналогично, чтобы слушать внешний адрес
    port: parseInt(process.env.PORT) || 3000 // Используем предоставленный Railway порт
  }
});
