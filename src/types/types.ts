import { SET_WALLET } from "@/redux/actions";
import { BrowserWallet } from "@meshsdk/core";
import { Document } from "mongoose";

type Wallet = {
  id: string;
  name: string;
  icon: string;
  version: string;
};

type AssetWallet = {
  unit: string;
  policyId: string;
  assetName: string;
  fingerprint: string;
  quantity: string;
};

type ToggleAlert = {
  success: "Success" | "Alert" | "Error";
  msg: string;
  alert: boolean;
};

type LoginPayload = {
  stakeAddress: string;
};

type initialStates = {
  wallet: undefined | BrowserWallet;
};

export interface AppContexts {
  toggleAlert: (success: "Success" | "Alert" | "Error", msg: string, alert: boolean) => void;
  toggleLoading: (loading: boolean) => void;
}

export interface WalletAction {
  type: typeof SET_WALLET;
  payload: BrowserWallet | undefined;
}

export type { Wallet, AssetWallet, ToggleAlert, LoginPayload, initialStates };
