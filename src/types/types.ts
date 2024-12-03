import { BrowserWallet } from "@meshsdk/core";
import { Document } from "mongoose";

type AvailableWallets = {
  id?: string;
  name: string;
  icon: string;
  version: string;
};

type Wallet = {
  wallet: BrowserWallet | undefined;
  connected: boolean;
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

export interface AppContexts {
  toggleAlert: (success: "Success" | "Alert" | "Error", msg: string, alert: boolean) => void;
  toggleLoading: (loading: boolean) => void;
  connectWallet: () => void;
  selectWallet: (walletName: string) => Promise<void>;
  wallet: Wallet;
}

export type { Wallet, AssetWallet, ToggleAlert, LoginPayload, AvailableWallets };
