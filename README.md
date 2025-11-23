# 🚀 Desktop App Template (Vite + React + Electron)

This project provides a clean, scalable setup for building modern desktop applications using:

* **Vite** (React + TypeScript)
* **Electron**
* **Hot Reloading**
* **Secure BrowserWindow + Preload Scripts**
* **Electron Builder for Packaging**

This template is ideal for desktop-first applications, dashboards, tools, or internal apps.

---

# 📁 Project Structure

```
project/
│
├─ src/
│   ├─ ui/                 # React (Vite) frontend
│   ├─ electron/           # Main & preload scripts
│   │    ├─ main.js
│   │    └─ preload.js
│   └─ ...
│
├─ dist-react/            # Vite build output (auto-generated)
│
├─ index.html
├─ vite.config.ts
├─ package.json
└─ ...
```

---

# 🧩 1. Create Vite App

```bash
npm create vite@latest
```

Choose:

* **React**
* **TypeScript**

---

# 🗂️ 2. Create `src/ui` and Move UI Files

Move everything from `src/` into:

```
src/ui/
```

---

# 📝 3. Update `index.html`

```html
<script type="module" src="/src/ui/main.tsx"></script>
```

---

# ⚙️ 4. Install Electron

```bash
npm install --save-dev electron
```

---

# 🏗️ 5. Vite Build Configuration

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-react",
  },
});
```

---

# 🪟 6. Electron Main Process (`main.js`)

`src/electron/main.js`:

```js
import { app, BrowserWindow } from "electron";
import path from "path";

// Handle refresh on Windows
if (require("electron-squirrel-startup")) app.quit();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(
      path.join(app.getAppPath(), "/dist-react/index.html")
    );
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
```

---

# 🧠 7. Add Preload Script

`src/electron/preload.js`:

```js
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  version: () => "1.0.0",
});
```

Your React code can now safely access:

```ts
window.api.version();
```

---

# 🔥 8. Hot Reload (Electron + React)

Install:

```bash
npm install --save-dev electronmon concurrently
```

Scripts:

```json
"dev": "concurrently \"npm run dev:react\" \"npm run dev:electron\"",
"dev:react": "vite",
"dev:electron": "electronmon ."
```

Run both with:

```bash
npm run dev
```

✔ React reloads instantly
✔ Electron restarts automatically

---

# 📦 9. Packaging with Electron Builder

Install:

```bash
npm install --save-dev electron-builder
```

Update `package.json`:

```json
"main": "src/electron/main.js",
"build": {
  "appId": "com.example.desktopapp",
  "directories": {
    "output": "release"
  },
  "files": [
    "build-react/**/*",
    "src/electron/**/*"
  ],
  "extraMetadata": {
    "main": "src/electron/main.js"
  }
},
"scripts": {
  "dev": "concurrently \"npm run dev:react\" \"npm run dev:electron\"",
  "dev:react": "vite",
  "dev:electron": "electronmon .",
  "build": "tsc -b && vite build",
  "dist": "npm run build && electron-builder"
}
```

Build a packaged desktop app:

```bash
npm run dist
```

Output binaries go into:

```
release/
```

---

# 🎉 Done!

You now have:

✔ Fully working Electron + Vite + React setup
✔ Preload script with safe bridging
✔ Secure BrowserWindow
✔ Live reload for both layers
✔ Production build with electron-builder

