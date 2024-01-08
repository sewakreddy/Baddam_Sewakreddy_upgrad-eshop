import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./common/auth/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function ConnectedApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

root.render(<ConnectedApp />, document.getElementById("root"));
