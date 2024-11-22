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
  loading: boolean;
  alert: boolean;
};

export interface AppContexts {
  toggleAlert: (success: "Success" | "Alert" | "Error", msg: string, loading: boolean, alert: boolean) => void;
}

export type { Wallet, AssetWallet, ToggleAlert };
