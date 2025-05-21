import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to copy large files
function copyLargeFiles() {
  return {
      name: 'copy-large-files',
      buildStart() {
          console.log('Starting build...');
          // Create models directory at the start of the build
          const modelsDir = 'dist/models';
          if (!fs.existsSync(modelsDir)) {
              console.log('Creating models directory...');
              fs.mkdirSync(modelsDir, { recursive: true });
          }
      },
      buildEnd() {
          console.log('Build complete, copying model files...');
          
          // Copy GLB files
          ['menger_sponge.glb', 'sierpinski.glb'].forEach(file => {
              const sourcePath = `public/models/${file}`;
              const destPath = `dist/models/${file}`;
              
              console.log(`Copying ${sourcePath} to ${destPath}...`);
              
              if (fs.existsSync(sourcePath)) {
                  try {
                      fs.copyFileSync(sourcePath, destPath);
                      console.log(`Successfully copied ${file}`);
                  } catch (err) {
                      console.error(`Error copying ${file}:`, err);
                      throw err; // Rethrow to fail the build
                  }
              } else {
                  console.error(`Source file not found: ${sourcePath}`);
                  throw new Error(`Source file not found: ${sourcePath}`);
              }
          });
          
          // Verify files were copied
          console.log('Verifying copied files...');
          fs.readdirSync('dist/models').forEach(file => {
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
      assetsInlineLimit: 0, // Don't inline any assets
      // Add this to ensure models are copied
      emptyOutDir: true // Clear the dist directory before each build
  },
  publicDir: 'public', // Change this to 'public' instead of 'models'
  plugins: [
      copyLargeFiles(),
      {
          name: 'verify-models',
          closeBundle() {
              // Verify models exist after build
              const modelsDir = 'dist/models';
              if (!fs.existsSync(modelsDir)) {
                  throw new Error('Models directory not created in dist!');
              }
              const files = fs.readdirSync(modelsDir);
              if (!files.includes('sierpinski.glb') || !files.includes('menger_sponge.glb')) {
                  throw new Error('Model files not copied to dist!');
              }
              console.log('Verified model files in dist:', files);
          }
      }
  ]
});
