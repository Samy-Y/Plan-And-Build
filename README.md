# Plan and Build v1.2

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
├── data/ ...
├── textures/ ...
├── index.html
├── main.js
├── style.css
└── README.md
```

## To-do list

- **Adding a larger selection of blocks to choose from.**
- **Optimizing structure construction.**
- **Adding schematica support**: That will take **a `lot`** of time.
