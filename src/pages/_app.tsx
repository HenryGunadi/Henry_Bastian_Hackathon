import "@/styles/globals.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import Head from "next/head";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createContext, useEffect, useState } from "react";
import { AppContexts, ToggleAlert, Wallet } from "@/types/types";
import { AlertCircle } from "lucide-react";
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
  const [wallet, setWallet] = useState<Wallet>({
    wallet: undefined,
    connected: false,
  });

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

  // select wallet context
  async function selectWallet(walletName: string) {
    try {
      console.log("wallet name : ", walletName);
      const wallet = await BrowserWallet.enable(walletName);

      if (wallet) {
        setWallet({
          wallet: wallet,
          connected: false,
        });
      }
    } catch (err) {
      console.error("Error connecting wallet : ", err);
    }
  }

  // connect wallet context
  function connectWallet(): void {
    if (wallet.wallet) {
      setWallet({
        wallet: wallet.wallet,
        connected: true,
      });
    }
  }

  // clear alert state
  function clearAlert(): void {
    setAlert({
      success: "Alert",
      msg: "",
      alert: false,
    });
  }

  // set wallet localstorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedWallet = localStorage.getItem("wallet");
      if (persistedWallet != null) {
        const localWallet: Wallet = JSON.parse(persistedWallet);

        setWallet({
          wallet: localWallet.wallet,
          connected: localWallet.connected,
        });
      }
    }
  }, []);

  // ALERT TIMEOUT
  useEffect(() => {
    if (alert.alert) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  // handle persistent state updates
  useEffect(() => {
    if (wallet.connected) {
      localStorage.setItem("wallet", JSON.stringify(wallet));
    }
  }, [wallet.connected]);

  return (
    <AppContext.Provider
      value={{
        toggleAlert,
        toggleLoading,
        selectWallet,
        connectWallet,
        wallet,
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
