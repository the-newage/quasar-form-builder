import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outDir: 'types',
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
      rollupTypes: true
    })
  ],

  resolve: {
    alias: {
      'src': resolve(import.meta.dirname, './src'),
      '@': resolve(import.meta.dirname, './src')
    }
  },

  build: {
    lib: {
      entry: resolve(import.meta.dirname, './src/index.ts'),
      name: 'QuasarFormBuilder',
      fileName: 'quasar-form-builder',
      formats: ['es', 'umd']
    },

    rollupOptions: {
      external: [
        'vue',
        'quasar',
        'vue-form-builder-core',
        'jalali-moment'
      ],

      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
          'vue-form-builder-core': 'VueFormBuilderCore',
          'jalali-moment': 'moment'
        }
      }
    }
  }
})
