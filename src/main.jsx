import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { getZoneDetails } from "./utils/configZone";
// import { DepartmentOptionsProvider } from "./context/departmentContext";


const queryClient = new QueryClient();

// const zoneDetails = getZoneDetails();
// try {
//   import(/* @vite-ignore */ zoneDetails?.theme);
// } catch (error) {
//   console.log(error);
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#180d39",
              color: "#ffffff",
              border: "1px solid #4b5563",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            },
          }}
        />
          <AuthProvider>
            <App />
          </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
