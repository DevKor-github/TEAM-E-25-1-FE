import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 경로 alias 설정: @components → src/components 등으로 매핑
      // 상대경로 지옥(../../../)을 피하고, 가독성 좋고 유지보수 쉬운 import 가능
      "@": path.resolve(__dirname, "src"), 
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
})
