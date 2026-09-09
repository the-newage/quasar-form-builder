import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const __dirname = fileURLToPath(
    new URL('.', import.meta.url)
)

const projectRoot = resolve(__dirname, '..')

export default defineConfig({
  root: __dirname,

  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: undefined
    })
  ],

  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      src: resolve(projectRoot, 'src'),
      dev: resolve(projectRoot, '.'),
      components: resolve(projectRoot, 'src/components')
    }
  },

  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler'
      }
    }
  },

  server: {
    port: 9000
  }
})