import { createRoot } from "react-dom/client";
import { ServiceStorage } from "./services/service-storage.service";
import { WordsStorageManager } from "./services/words-storage-manager.service";
import App from "./App";

ServiceStorage.wordsStorageManager = new WordsStorageManager();
//init storage
ServiceStorage.wordsStorageManager.initIpcRendererListeners();
ServiceStorage.wordsStorageManager.startRefreshShortPulling();

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);