import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { v4 as uuidv4 } from 'uuid';

// Polyfill for UUID if needed for browsers that don't support crypto.randomUUID
if (!window.crypto || !window.crypto.randomUUID) {
  window.crypto.randomUUID = () => uuidv4();
}

createRoot(document.getElementById("root")!).render(<App />);
