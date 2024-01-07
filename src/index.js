import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import useAuthentication from "./common/auth/useAuthentication";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function ConnectedApp() {
  const { AuthProvider } = useAuthentication();
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

root.render(<ConnectedApp />, document.getElementById("root"));
