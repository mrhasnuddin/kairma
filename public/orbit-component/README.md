# Modular 3D Web3 Orbit Component

This directory contains a clean, modular, and high-fidelity extraction of the **interactive 3D particle orbit selector** from Soul.io. 

It is designed to be easily copy-pasted into other React, Vue, Next.js, or vanilla JS projects.

## 📁 File Structure
- `index.html`: Fully styled Glassmorphic dashboard showcase.
- `orbit.js`: Reusable ES6 class `Web3OrbitSystem` built on Three.js.
- `data.js`: Simulated Web3 network, protocol, token asset, and gauge data.
- `icons/`: Cloned high-fidelity SVG icon assets.

## 🚀 How to Run Locally
1. Run the dev server script:
   ```bash
   npm run dev:orbit
   ```
2. Open your browser and navigate to **[http://localhost:8125/](http://localhost:8125/)** to view the live interactive showcase.

---

## 🛠️ How to Integrate Into Your Project

### 1. Include the Three.js and GSAP libraries
Add the CDN links to your HTML (or install them via npm: `npm i three gsap`):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
```

### 2. Import and Initialize `Web3OrbitSystem`
Create a target `<div>` in your DOM and instantiate the class with your custom callbacks and data arrays:

```javascript
import { Web3OrbitSystem } from './orbit.js';

const orbit = new Web3OrbitSystem('my-canvas-container', {
  networks: [
    { id: 'sepolia', name: 'Sepolia', icon: 'sepolia.svg' },
    { id: 'base', name: 'Base', icon: 'base.svg' },
    // ...
  ],
  protocols: [
    { id: 'aave', name: 'Aave V3', icon: 'aave.svg' },
    // ...
  ],
  assets: [
    { id: 'usdc', name: 'USDC', icon: 'usdc.svg' },
    // ...
  ],
  // Event triggers when a node is hovered/clicked
  onSelect: (category, item) => {
    console.log(`Selected ${category}:`, item);
    // e.g. update your state, filter tables, etc.
  },
  onDeselect: (category) => {
    console.log(`Deselected category: ${category}`);
  }
});
```

### 3. Expose Controls (Optional)
The system supports direct programming controls:
- **Deselect a category programmatically**:
  ```javascript
  orbit.deselectCategory('network');
  ```
- **Responsive Resize**:
  ```javascript
  orbit.onResize();
  ```
