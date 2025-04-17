import "./index.css";
import App from "./app/app.tsx";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
  root.render(<App />);
} catch (e) {
  console.log("e", e);
}
