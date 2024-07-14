import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import SocketContextProvider from "@/context/SocketContext";

if (import.meta.env.VITE_REACT_APP_NODE_ENV === "production") {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContextProvider>
    </Provider>
  </React.StrictMode>
);
