# Plan and Build

**Plan and Build** is a primitive web-based 3D Minecraft structure planner that enables users to design and visualize custom structures with selectable block types built with JavaScript and ThreeJS.

**Website:** [https://samy-y.github.io/Plan-And-Build/]

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/plan-and-build.git
   cd plan-and-build
   ```

2. **Open Locally**:
   Open `index.html` in a browser to run the project locally. I recommend using a local server to run the project:
   - **Using Python**:
     ```bash
     python -m http.server
     ```
   - **Using Node.js (http-server)**:
     ```bash
     npx http-server .
     ```
   - **Using Live Server (VScode extension)**:
     Click on the __Go live__ button.

3. **Visit**: Open the address provided by your server (probably `localhost:XXXX`) to view the application.

## Usage

1. **Block Selection**:
   - Customize the block types for different sections (Base, Middle, Top) using the **Select Blocks** section.

2. **Interactive Controls**:
   - Use the mouse to rotate, zoom, and pan the view:

## Project Structure

```
plan-and-build/
├── data/
│   ├── house.json
│   └── textures.json
├── textures/
│   ├── oak_planks.png
│   ├── cobblestone.png
│   └── bricks.png
├── index.html
├── main.js
├── style.css
└── README.md
```

## To-do list

These are features I plan on adding to this project:
- **Adding Structures**: Add new JSON files in the `data/` directory with structure data.
- **Adding Blocks**: Add textures in the `textures/` directory and reference them in `textures.json`.
