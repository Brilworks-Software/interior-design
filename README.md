# 🏠 3D Room Designer

A browser-based interior design tool that allows users to select room templates, furnish them with interactive 3D objects, and visualize layouts in a realistic environment. Built for client demos, it features a semi-realistic visual style with clean geometry, textured materials, and dynamic lighting.

---

## ✨ Key Features

### 🛠 **Interactive 3D Design**
- **Dollhouse View:** Interactive 3D perspective with smooth camera controls (Orbit, Zoom, Pan).
- **Furniture Catalog:** Choose from 18+ items across categories like Seating, Tables, Storage, Lighting, and Decor.
- **Parametric & Realistic Modes:** Toggle between clean, colored parametric shapes and high-fidelity GLB models.
- **Interactive Placement:** Drag-and-drop furniture with automatic floor detection and surface stacking (e.g., lamps on tables).

### 📐 **Precision Tools**
- **Grid & Wall Snapping:** Align furniture perfectly with a toggleable grid (¼, ½, or 1 ft) and smart wall snapping.
- **Measurement Overlay:** View real-time room dimensions and product footprints in either feet or centimeters.
- **Properties Panel:** Fine-tune every object with rotation, uniform scaling, and a curated color palette.

### 💡 **Aesthetics & Atmosphere**
- **Lighting Moods:** Instantly switch between **Bright**, **Cozy**, **Evening**, and **Night** themes.
- **Room Customization:** Change wall colors and floor materials (Wood, Marble, Concrete) on the fly.
- **Enhanced Visuals:** Procedural textures, soft shadows (PCFSoft), and environment mapping.

### 🤖 **AI & Smart Automation**
- **AI Design Assistant:** Describe your room in natural language (e.g., "Design a bedroom with a bed and rug") and let the AI assistant set it up for you.
- **Smart Layout Engine:** Intelligent rule-based placement that understands furniture relationships—anchoring beds to walls, placing lamps on tables, and grouping kitchen appliances.
- **Auto-Stacking:** Objects smartly detect surfaces, allowing you to place smaller items (microwaves, lamps) on top of furniture automatically.

### 💾 **Persistence & Workflow**
- **Undo/Redo:** 50-step history stack for worry-free design exploration.
- **Export/Import:** Save your designs as JSON files and reload them later.
- **Screenshots:** Capture high-resolution PNGs of your 3D layouts directly from the app.
- **Room Selector:** Choose from 12+ beautiful presets, including a dedicated **Kitchen** section, or start with a custom room.

---

## 🚀 Tech Stack

- **Framework:** [React 18](https://reactjs.org/)
- **3D Engine:** [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber)
- **3D Helpers:** [`@react-three/drei`](https://github.com/pmndrs/drei)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with history middleware)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Analytics:** [PostHog](https://posthog.com/) (Session recording & event tracking)

---

## 🛠 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root based on `.env.example`:
   ```bash
   VITE_POSTHOG_KEY=your_posthog_key_here
   ```

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build
Generate a production-ready bundle:
```bash
npm run build
```

---

## 📂 Project Structure

- `src/three/`: Core 3D logic including Room rendering, Scene setup, and Furniture Group logic.
- `src/components/`: React UI components (Toolbar, Catalog, Properties Panel, Popovers).
- `src/store/`: Zustand state definitions for app logic, design state, and history.
- `src/data/`: Static definitions for rooms, furniture catalog, and lighting presets.
- `public/models/`: GLB assets for realistic mode.

---

## 📝 License
This project is for demonstration purposes. All rights reserved.
