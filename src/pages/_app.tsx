import "@/styles/globals.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { MeshProvider, useAssets } from "@meshsdk/react";
import Head from "next/head";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createContext, useContext, useEffect, useState } from "react";
import { AppContexts, ToggleAlert } from "@/types/types";
import { AlertCircle, ToggleLeft } from "lucide-react";
import { clearLine } from "readline";
import { SessionProvider } from "next-auth/react";
import { Progress } from "@/components/ui/progress";
import { BrowserWallet } from "@meshsdk/core";

// USE CONTEXT
export const AppContext = createContext<AppContexts | undefined>(undefined);

export default function App({ Component, pageProps }: AppProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<ToggleAlert>({
    success: "Alert",
    msg: "",
    alert: false,
  });

  // get wallet from localstorage
  useEffect(() => {
    const retrievedWlt = localStorage.getItem("wallet");
    console.log("wallet from local storage : ", retrievedWlt);

    const wlt: BrowserWallet | null = retrievedWlt ? JSON.parse(retrievedWlt) : null;
    setWallet(wlt);
  }, []);

  // update persistent wallet state from localstorage
  useEffect(() => {
    if (wallet) {
      localStorage.setItem("wallet", JSON.stringify(wallet));
      console.log("Updated wallet in localStorage:", wallet);
    }
  }, [wallet]);

  // setWallet
  function toggleWallet(wallet: BrowserWallet) {
    setWallet(wallet);
  }

  // ALERT TRIGGER
  const toggleAlert = (success: "Success" | "Error" | "Alert", msg: string, alert: boolean) => {
    setAlert({
      success: success,
      msg: msg,
      alert: alert,
    });
  };

  const toggleLoading = (loading: boolean) => {
    setLoading(loading);
  };

  // CLEAR ALERT STATE
  function clearAlert() {
    setAlert({
      success: "Alert",
      msg: "",
      alert: false,
    });
  }

  // ALERT TIMEOUT
  useEffect(() => {
    if (alert.alert) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <AppContext.Provider
      value={{
        toggleAlert,
        toggleLoading,
      }}
    >
      <SessionProvider>
        <MeshProvider>
          <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
          </Head>

          <div className="overflow-x-hidden relative">
            {alert.alert && (
              <Alert variant={alert.success === "Error" ? "destructive" : "default"} className={alert.success === "Success" ? "text-green-500 border-green-500" : ""}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.success}</AlertTitle>
                <AlertDescription>{alert.msg}</AlertDescription>
              </Alert>
            )}

            {loading && <Progress value={60} className="w-[100%] absolute" />}

            <Component {...pageProps} />
          </div>
        </MeshProvider>
      </SessionProvider>
    </AppContext.Provider>
  );
}
