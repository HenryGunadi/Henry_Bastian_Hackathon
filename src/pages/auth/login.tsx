import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { BrowserWallet } from "@meshsdk/core";
import { Button } from "@/components/ui/button";

export default function login() {
  const router = useRouter();
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([]);
  const [selectWallet, setSelectWallet] = useState<string>("");
  const [wallet, setWallet] = useState<Wallet>();

  // get available wallets
  async function getAvailableWallets() {
    try {
      const availableWallets: Wallet[] = await BrowserWallet.getAvailableWallets();

      if (availableWallets.length != 0) {
        setAvailableWallets(availableWallets);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getAvailableWallets();
  }, []);

  // // connect wallet
  // async function connectWallet() {
  //   try {
  //     const wallet = await BrowserWallet();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  return (
    <div className="text-zinc-800 overflow-x-hidden box-border w-screen h-screen flex justify-center items-center">
      {/* login */}
      <div className="w-1/2 h-1/3 border border-black rounded-md px-6 py-6 flex flex-col">
        <h1 className="font-semibold text-2xl text-center">Login</h1>

        <form className="flex flex-col flex-1 justify-center">
          <Button>Login</Button>
        </form>
      </div>
    </div>
  );
}
