import { LoginPayload } from "@/types/types";
import { BrowserWallet } from "@meshsdk/core";
import axios from "axios";
import React from "react";
import { NextRouter } from "next/router"; // Import useRouter from next/router

// HANDLERS
export const loginHandler = async (wallet: BrowserWallet, setState: React.Dispatch<React.SetStateAction<string>>, toggleLoading: (loading: boolean) => void, router: NextRouter): Promise<void> => {
  const loginAPI = "http://localhost:8080/auth/login";
  toggleLoading(true);

  try {
    const userStakeAddress: string = (await wallet.getUsedAddresses())[0];
    const payload: LoginPayload = {
      stakeAddress: userStakeAddress,
    };

    const response = await axios.post(loginAPI, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (response.data) {
      console.log(response.data);
      setState(response.data.nonce);

      router.push("/main/dashboard");
    }
  } catch (err) {
    console.error(err);
  } finally {
    toggleLoading(false);
  }
};
