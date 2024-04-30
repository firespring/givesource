import { createRequire } from 'node:module'
const require = createRequire( import.meta.url )

import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import vitePluginRequire from 'vite-plugin-require'

const SOURCE_PATH = '../src/admin-pages'
const BUILD_PATH = '../build/admin-pages'

export default defineConfig(({ command, mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd() + '/../../..', '') }

	return {
		root: resolve(__dirname, SOURCE_PATH),
		publicDir: resolve(__dirname, BUILD_PATH),
		emptyOutDir: true,
		plugins: [
			basicSsl(),
			ckeditor5({
				theme: require.resolve('@ckeditor/ckeditor5-theme-lark')
			}),
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
						dest: resolve(__dirname, BUILD_PATH)
					},
					{
						src: resolve(__dirname, './robots-allow.txt'),
						dest: resolve(__dirname, BUILD_PATH),
						rename: 'robots.txt'
					},
				]
			}),
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
				'jquery',
			]
		},
		build: {
			outDir: resolve(__dirname, BUILD_PATH),
			rollupOptions: {
				input: {
					'admin-pages': resolve(__dirname, SOURCE_PATH + '/index.html')
				}
			}
		},
		server: {
			https: {
				port: 3001,
				method: 'GET',
			},
			port: 3001,
			host: '0.0.0.0',
		},
		worker: {
			format: 'es'
		}
	}
})
