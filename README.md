# Fractal Explorer

An interactive 3D visualization of fractals using Three.js. View and explore the Menger Sponge and Sierpinski Triangle in your browser.

## Features

- Interactive 3D visualization of fractals
- Menger Sponge with metallic blue texture
- Sierpinski Triangle with custom lighting
- Orbit controls for exploration
- Responsive design

## Live Demo

Visit the live demo at: `https://[your-username].github.io/[repository-name]`

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/[repository-name].git
```

2. Open the project folder:
```bash
cd [repository-name]
```

3. Start a local server (using Python):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

4. Open your browser and visit:
```
http://localhost:8000
```

## Project Structure
```
├── index.html          # Main HTML file
├── main.js            # Three.js and fractal logic
├── menu.js            # Menu interaction handling
├── menger_sponge.glb  # Menger sponge model
├── sierpinski.glb     # Sierpinski triangle model
└── README.md          # This file
```

## Deployment

This project is deployed using GitHub Pages. The site is automatically updated when you push to the main branch.

## Technologies Used

- Three.js for 3D rendering
- JavaScript (ES6+)
- HTML5
- CSS3

## License

MIT License - feel free to use this project for your own purposes. 