import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to copy large files
function copyLargeFiles() {
    return {
        name: 'copy-large-files',
        buildStart() {
            console.log('Starting build...');
        },
        buildEnd() {
            console.log('Build complete, copying model files...');
            
            // Ensure models directory exists in dist
            const modelsDir = 'dist/models';
            if (!fs.existsSync(modelsDir)) {
                console.log('Creating models directory...');
                fs.mkdirSync(modelsDir, { recursive: true });
            }
            
            // Copy GLB files
            ['menger_sponge.glb', 'sierpinski.glb'].forEach(file => {
                const sourcePath = `models/${file}`;
                const destPath = `${modelsDir}/${file}`;
                
                console.log(`Copying ${sourcePath} to ${destPath}...`);
                
                if (fs.existsSync(sourcePath)) {
                    try {
                        fs.copyFileSync(sourcePath, destPath);
                        console.log(`Successfully copied ${file}`);
                    } catch (err) {
                        console.error(`Error copying ${file}:`, err);
                    }
                } else {
                    console.error(`Source file not found: ${sourcePath}`);
                }
            });
            
            // Verify files were copied
            console.log('Verifying copied files...');
            fs.readdirSync(modelsDir).forEach(file => {
                console.log(`Found in models directory: ${file}`);
            });
        }
    };
}

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
        },
        // Copy model files to the build directory
        copyPublicDir: true,
        assetsInlineLimit: 0 // Don't inline any assets
    },
    publicDir: 'models', // Specify the directory containing model files
    plugins: [copyLargeFiles()]
}); 