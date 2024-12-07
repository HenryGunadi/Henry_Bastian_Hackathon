import { BrowserWallet } from "@meshsdk/core";
import { Document } from "mongoose";

type AvailableWallets = {
  id?: string;
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

export interface AppContexts {
  toggleAlert: (success: "Success" | "Alert" | "Error", msg: string, alert: boolean) => void;
  toggleLoading: (loading: boolean) => void;
}

export type { AssetWallet, ToggleAlert, LoginPayload, AvailableWallets };
