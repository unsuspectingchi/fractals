# Fractal Explorer

An interactive 3D visualization of fractals using Three.js. View and explore the Menger Sponge and Sierpinski Triangle in your browser.

## Features

- Interactive 3D visualization of fractals
- Menger Sponge with metallic blue texture
- Sierpinski Triangle with custom lighting
- Orbit controls for exploration
- Responsive design

## Live Demo

Visit the live demo at: https://unsuspectingchi.github.io/fractals/

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/unsuspectingchi/fractals.git
cd fractals
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

To build the project for production:

```bash
npm run build
```

This will create optimized static files in the `dist` directory.

## Deployment

The project is automatically deployed to GitHub Pages when you push to the `gh-pages` branch. To deploy manually:

```bash
npm run deploy
```

This will:
1. Build the project
2. Create a `.nojekyll` file to prevent GitHub Pages from processing the files
3. Push the built files to the `gh-pages` branch

## Project Structure

```
fractals/
├── index.html          # Main HTML file
├── main.js            # Main application code
├── menu.js            # Menu interaction code
├── vite.config.js     # Vite configuration
├── package.json       # Project dependencies and scripts
└── models/            # 3D model files
    ├── menger_sponge.glb
    └── sierpinski.glb
```

## Technologies Used

- Three.js for 3D rendering
- Vite for development and building
- GitHub Pages for hosting

## License

ISC 