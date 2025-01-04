import { AppContext } from "@/contexts/appContext";
import { BrowserWallet } from "@meshsdk/core";
import { Document } from "mongoose";
import { NextRouter } from "next/router";
import React from "react";

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

type AppProviderProps = {
  setAlert: React.Dispatch<React.SetStateAction<ToggleAlert>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface AppContexts {
  toggleAlert: (success: "Success" | "Alert" | "Error", msg: string, alert: boolean) => void;
  toggleLoading: (loading: boolean) => void;
  connectWallet: () => Promise<void>;
  wallet: BrowserWallet | null;
  setWalletProvider: React.Dispatch<React.SetStateAction<string>>;
  router: NextRouter;
}

export interface AuthenticatedRequest extends Request {
  user?: string | object;
}

export type { AssetWallet, ToggleAlert, LoginPayload, AvailableWallets, AppProviderProps };

export type LoginResponse = {
  message: string;
  nonce: string;
};

export type VerifySignatureReq = {
  user_address: string;
  signature: string;
};

export type Product = {
  name: string;
  price: number;
  image: File | null;
  seller_id: string;
};
