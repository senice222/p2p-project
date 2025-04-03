import "./index.css";
import App from "./app/app.tsx";
import ReactDOM from "react-dom/client";
import { init } from "./init.ts";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  root.render(<App />);
  init();
} catch (e) {
  console.log("e", e);
}
