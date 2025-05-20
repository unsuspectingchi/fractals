import { defineConfig } from 'vite';

export default defineConfig({
    base: '/fractals/', // This should match your repository name
    server: {
        open: true,
        port: 3000
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        // Ensure the build is optimized for production
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    'three': ['three'],
                    'vendor': ['three/examples/jsm/controls/OrbitControls.js', 'three/examples/jsm/loaders/GLTFLoader.js']
                }
            }
        }
    }
}); 