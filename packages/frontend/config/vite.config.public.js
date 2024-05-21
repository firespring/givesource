import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import vitePluginRequire from 'vite-plugin-require'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import inject from '@rollup/plugin-inject'
import fetch from '../bin/fetch-dynamic-content.js'

const SOURCE_PATH = '../src/public-pages'
const BUILD_PATH = '../build/public-pages'

export default defineConfig(async ({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd() + '/../../..', '') }

  if (command === 'build') {
    await fetch()
  }

  return {
    root: resolve(__dirname, SOURCE_PATH),
    resolve: {
      alias: {
        vue: resolve(__dirname, '../node_modules/vue/dist/vue.runtime.esm-bundler.js')
      }
    },
    plugins: [
      inject({
        jQuery: 'jquery'
      }),
      basicSsl(),
      splitVendorChunkPlugin(),
      vue({
        template: {
          compilerOptions: {
            customElement: true
          },
          transformAssetUrls: {
            base: null,
            includeAbsolute: false,
            devtools: true
          }
        }
      }),
      vitePluginRequire.default(),
      viteStaticCopy({
        targets: [
          {
            src: resolve(__dirname, './settings.json'),
            dest: resolve(__dirname, SOURCE_PATH)
          },
          {
            src: resolve(__dirname, './robots-allow.txt'),
            dest: resolve(__dirname, SOURCE_PATH),
            rename: 'robots.txt'
          }
        ]
      })
    ],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true
          })
        ]
      },
      include: [
        'jquery'
      ]
    },
    build: {
      outDir: resolve(__dirname, BUILD_PATH),
      emptyOutDir: false,
      rollupOptions: {
        input: {
          'public-pages': resolve(__dirname, SOURCE_PATH + '/index.html')
        }
      }
    },
    server: {
      https: {
        port: 3002,
        method: 'GET'
      },
      port: 3002,
      host: '0.0.0.0'
    },
    worker: {
      format: 'es'
    }
  }
})
