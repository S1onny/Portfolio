import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
export default defineConfig({
  root: '.',
  plugins: [
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
        }
      }
    })
  ],
})
