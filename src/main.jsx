// Main Entry Point
// Following Phoenix pattern

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import ThemeModeProvider from "./contexts/theme/ThemeModeContext";
import AuthContextProvider from "./contexts/auth/AuthContextProvider";
import QuizContextProvider from "./contexts/quiz/QuizContextProvider";
import AttemptContextProvider from "./contexts/attempt/AttemptContextProvider";
import DiscoveryContextProvider from "./contexts/discovery/DiscoveryContextProvider";
import ProfileContextProvider from "./contexts/profile/ProfileContextProvider";
import AdminContextProvider from "./contexts/admin/AdminContextProvider";
import NotificationContextProvider from "./contexts/notifications/NotificationContextProvider";
import "./styles/variables.css";
import "./styles/global.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <AuthContextProvider>
          <NotificationContextProvider>
            <QuizContextProvider>
              <AttemptContextProvider>
                <DiscoveryContextProvider>
                  <ProfileContextProvider>
                    <AdminContextProvider>
                      <App />
                      <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: "#FFFFFF",
                          color: "#2D3436",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                        },
                        success: {
                          iconTheme: {
                            primary: "#00B894",
                            secondary: "#FFFFFF",
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: "#FF6B6B",
                            secondary: "#FFFFFF",
                          },
                        },
                      }}
                    />
                    </AdminContextProvider>
                  </ProfileContextProvider>
                </DiscoveryContextProvider>
              </AttemptContextProvider>
            </QuizContextProvider>
          </NotificationContextProvider>
        </AuthContextProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  </StrictMode>
);
