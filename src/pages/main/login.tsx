import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AssetExtended, BrowserWallet } from "@meshsdk/core";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import login_wallpaper1 from "../../../public/assets/login_wallpaper1.jpg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppContexts, AvailableWallets } from "../../types/types";
import { AppContext } from "../_app";
import { loginHandler } from "../../services/authService";

// Environment variable berisi nama NFT dalam format Hex dan policyID
const token1 = process.env.NEXT_PUBLIC_TOKEN_1;
const token2 = process.env.NEXT_PUBLIC_TOKEN_2;
const token3 = process.env.NEXT_PUBLIC_TOKEN_3;

export default function login() {
  // router
  const router = useRouter();

  // use contexts
  const { toggleAlert, toggleLoading, connectWallet, selectWallet, wallet } = useContext(AppContext) as AppContexts;

  // states
  const [availableWallets, setAvailableWallets] = useState<AvailableWallets[]>([]);
  const [walletAssets, setWalletAssets] = useState<AssetExtended[] | undefined>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [nonce, setNonce] = useState<string>("");

  // FUNCTIONS
  // get available wallets
  async function handleGetWallets() {
    try {
      const wallets = await BrowserWallet.getAvailableWallets();

      setAvailableWallets(wallets);
    } catch (err) {
      console.error(err);
    }
  }

  // get wallet assets
  async function getWalletAssets() {
    try {
      const assets = await wallet.wallet!.getAssets();

      if (assets?.length != 0) {
        console.log("Wallet assets : ", assets);
        setWalletAssets(assets);
        toggleAlert("Success", "Assets detected.", false);
      } else {
        toggleAlert("Error", "No assets detected. Please deposit or connect another wallet.", false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleGetWallets();
  }, []);

  useEffect(() => {
    if (availableWallets.length != 0) {
      console.log(availableWallets);
    }
  }, [availableWallets]);

  useEffect(() => {
    if (selectedWallet != "") {
      selectWallet(selectedWallet);
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (wallet.wallet) {
      getWalletAssets();
    }
  }, [wallet.wallet]);

  return (
    <div className="text-zinc-800 overflow-x-hidden box-border w-screen h-screen flex justify-center items-center text-sm">
      {/* login */}
      <div className="w-3/5 h-fit border border-black rounded-md p-8 flex">
        <form className="w-5/12 flex flex-col flex-1 justify-between">
          <div>
            <h1 className="font-semibold text-3xl py-2">Welcome Back!</h1>
            <p className="text-zinc-500">Log in securely to explore and purchase your favorite CS2 skins using Cardano. Enjoy a seamless and rewarding experience, tailored just for you.</p>
          </div>

          <div className="w-full pt-24 flex flex-col">
            {/* available wallets */}
            <Select
              value={selectedWallet}
              onValueChange={(e) => {
                setSelectedWallet(e);
              }}
            >
              <SelectTrigger className="w-full border rounded-md shadow-md py-2">
                <SelectValue placeholder="Select a wallet" />
              </SelectTrigger>

              <SelectContent>
                <ScrollArea>
                  <SelectGroup>
                    <SelectLabel className="font-semibold">Available Wallets</SelectLabel>
                    {availableWallets.length != 0 &&
                      availableWallets.map((value, index) => (
                        <SelectItem key={index} value={value.name} className="hover:cursor-pointer">
                          <div className="flex w-full justify-between gap-2 items-center z-50">
                            <img src={value.icon} alt="" className="w-6 h-6 object-cover object-center" />
                            <p>{value.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>

            <a href="" className="text-blue-600 my-2 w-fit">
              Dont have a wallet?
            </a>

            <Button
              className="rounded-full w-full mt-3 py-3"
              onClick={async (e) => {
                e.preventDefault();

                if (!wallet.wallet) {
                  toggleAlert("Error", "Wallet is not found.", true);
                  return;
                } else if (walletAssets?.length == 0) {
                  toggleAlert("Error", "Assets not found", true);
                  return;
                }

                try {
                  await loginHandler(wallet.wallet, setNonce, toggleLoading, router);
                  connectWallet();
                  router.push("/main/dashboard");
                } catch (err) {
                  console.error("Login Error : ", err);
                  toggleAlert("Error", "Login failed", true);
                }
              }}
            >
              Login
            </Button>
          </div>
        </form>

        <img src={login_wallpaper1.src} alt="wallpaper" className="w-7/12 object-cover object-center pl-12" />
      </div>
    </div>
  );
}
