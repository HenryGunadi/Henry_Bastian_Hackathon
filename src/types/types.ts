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
}

export type { Wallet, AssetWallet}