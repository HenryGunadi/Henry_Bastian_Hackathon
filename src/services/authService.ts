import { LoginPayload } from "@/types/types";
import { BrowserWallet } from "@meshsdk/core";
import axios from "axios";
import React from "react";
import { NextRouter } from "next/router"; // Import useRouter from next/router
import { headers } from "next/headers";

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
    }
  } catch (err) {
    console.error(err);
  } finally {
    toggleLoading(false);
  }
};

export async function authenticateUser(api: string): Promise<boolean> {
  try {
    const response = await axios.post(
      api,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Response data : ", response.data);
    return true;
  } catch (err) {
    console.error(`User is not authenticated on : ${api}`);
    return false;
  }
}
