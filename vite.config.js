import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
      rollupTypes: true
    })
  ],

  resolve: {
    alias: {
      src: resolve(import.meta.dirname, './src'),
      '@': resolve(import.meta.dirname, './src')
    }
  },

  build: {
    lib: {
      entry: resolve(import.meta.dirname, './src/index.ts'),
      name: 'QuasarFormBuilder',
      fileName: (format) => `quasar-form-builder.${format === 'es' ? 'js' : 'umd.cjs'}`,
      formats: ['es', 'umd']
    },

    rollupOptions: {
      external: [
        'vue',
        'quasar',
        'vue-form-builder-core',
        'jalali-moment',
        '@vee-validate/rules'
      ],

      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
          'vue-form-builder-core': 'VueFormBuilderCore',
          'jalali-moment': 'moment',
          '@vee-validate/rules': 'VeeValidateRules'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name
        }
      }
    }
  }
})
