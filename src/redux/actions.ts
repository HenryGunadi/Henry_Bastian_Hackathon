import { BrowserWallet } from "@meshsdk/core";

// actions
export const SET_WALLET = "SET_WALLET";

export const setWallet = (wallet: BrowserWallet | undefined) => ({
  type: SET_WALLET,
  payload: wallet,
});
