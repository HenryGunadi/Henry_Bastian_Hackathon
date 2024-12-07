import { AppContexts, ToggleAlert } from "@/types/types";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export const AppContext = createContext<AppContexts | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [alerts, setAlert] = useState<ToggleAlert>({
    success: "Alert",
    msg: "",
    alert: false,
  });
  const [walletProvider, setWalletProvide] = useState<string>("");

  // alert state handler
  const toggleAlert = (success: "Success" | "Error" | "Alert", msg: string, alert: boolean): void => {
    setAlert({
      success: success,
      msg: msg,
      alert: alert,
    });
  };

  // loading state handler
  const toggleLoading = (loading: boolean): void => {
    setLoading(loading);
  };

  // clear alert state
  function clearAlert(): void {
    setAlert({
      success: "Alert",
      msg: "",
      alert: false,
    });
  }

  // ALERT TIMEOUT
  useEffect(() => {
    if (alerts.alert) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <AppContext.Provider
      value={{
        toggleAlert,
        toggleLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
