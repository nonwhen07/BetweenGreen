import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: '/BetweenGreen/', // 這裡要加結尾的 / （vite 官方建議）
  plugins: [react()],
  // 直接用 import.meta.url 包一層
  // resolve: {
  //   alias: {
  //     '@': path.resolve(new URL('./src', import.meta.url).pathname),
  //   },
  // },
  // Windows 相容性更好的寫法（推薦）：
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
