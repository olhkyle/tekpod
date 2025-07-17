import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import dotenv from 'dotenv';

// dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [react()],
		server: {
			proxy: {
				'/api': {
					target: 'https://openapi.naver.com',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, ''),
					headers: {
						'X-Naver-Client-Id': env.VITE_X_NAVER_CLIENT_ID || '',
						'X-Naver-Client-Secret': env.VITE_X_NAVER_CLIENT_SECRET || '',
					},
				},
				'/ntruss': {
					target: 'https://maps.apigw.ntruss.com',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/ntruss/, ''),
					headers: {
						'X-NCP-APIGW-API-KEY-ID': env.VITE_API_GATEWAY_API_KEY_ID || '',
						'X-NCP-APIGW-API-KEY': env.VITE_API_GATEWAY_API_KEY || '',
					},
				},
			},
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						// Reducing the vendor chunk size
						// creating a chunk to react routes deps. Reducing the vendor chunk size
						if (id.includes('react-router-dom') || id.includes('@remix-run') || id.includes('react-router')) {
							return '@react-router';
						}

						if (id.includes('supabase/supabase-js')) {
							return '@supabase';
						}

						if (id.includes('framer-motion')) {
							return '@motion';
						}

						if (id.includes('zod')) {
							return '@zod';
						}
					},
				},
			},
		},
	};
});
