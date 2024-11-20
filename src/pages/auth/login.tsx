import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { BrowserWallet } from "@meshsdk/core";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import login_wallpaper1 from "../../../public/assets/login_wallpaper1.jpg";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    if (availableWallets.length != 0) {
      console.log(availableWallets);
    }
  }, [availableWallets]);

  // // connect wallet
  // async function connectWallet() {
  //   try {
  //     const wallet = await BrowserWallet.enable();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  return (
    <div className="text-zinc-800 overflow-x-hidden box-border w-screen h-screen flex justify-center items-center text-sm">
      {/* login */}
      <div className="w-3/5 h-1/2 border border-black rounded-md p-8 flex">
        <form className="w-5/12 flex flex-col flex-1 justify-between">
          <div>
            <h1 className="font-semibold text-3xl py-2">Welcome Back!</h1>
            <p className="text-zinc-500">Log in securely to explore and purchase your favorite CS2 skins using Cardano. Enjoy a seamless and rewarding experience, tailored just for you.</p>
          </div>

          <div className="w-full pt-24 flex flex-col">
            {/* available wallets */}
            <Select>
              <SelectTrigger className="w-full border rounded-md shadow-md py-2">
                <SelectValue placeholder="Select a wallet" />
              </SelectTrigger>

              <div className="w-full">
                <SelectContent className=" bg-white border border-zinc-500 z-10 p-2 rounded-md shadow-md min-h-16 h-32 mt-2 w-96">
                  <ScrollArea>
                    <SelectGroup>
                      <SelectLabel className="font-semibold">Available Wallets</SelectLabel>

                      {/* {availableWallets.length != 0 &&
                      availableWallets.map((value, index) => (
                        <SelectItem key={index} value={value.name}>
                          {value.name}
                        </SelectItem>
                      ))} */}
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                      <SelectItem value="1">LOL</SelectItem>
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </div>
            </Select>

            <a href="" className="text-blue-600 my-2 w-fit">
              Dont have a wallet?
            </a>

            <Button className="rounded-full w-full mt-3 py-3">Login</Button>
          </div>
        </form>

        <img src={login_wallpaper1.src} alt="wallpaper" className="w-7/12 object-cover object-center pl-12" />
      </div>
    </div>
  );
}
