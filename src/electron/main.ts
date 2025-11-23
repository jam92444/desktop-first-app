import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { poolResource } from "./resourceManager.js";
import { getPreloadedPath } from "./pathResolver.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences:{
      preload: getPreloadedPath(),
      
    }
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5432/");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }

  poolResource();
});
