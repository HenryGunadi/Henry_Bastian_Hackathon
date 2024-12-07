import { BlockfrostProvider, Asset, deserializeAddress, serializePlutusScript, mConStr0, MeshTxBuilder, applyParamsToScript, BrowserWallet } from "@meshsdk/core";
import contractBlueprint from "../../../smart_contract/plutus.json";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../_app";
import { AppContexts, Wallet } from "@/types/types";
import { useWallet } from "@meshsdk/react";
import { UserRoundPenIcon } from "lucide-react";
import e from "express";

// block frost api key
const blockFrostAPIKey = process.env.NEXT_PUBLIC_BLOCKFROST_API || "";

// initialize node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockFrostAPIKey!);

export default function Lock() {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  // use context
  const [amount, setAmount] = useState<number>(0);

  // handle deposit
  function handleDeposit() {
    if (amount <= 0) {
      alert("Invalid ADA amount");
      return;
    }
    lockAsset();
  }

  // handle lock asset
  async function lockAsset() {
    try {
      // get contract address
      const { scriptAddr } = getScript(contractBlueprint.validators[0].compiledCode);

      // get index utxo and wallet address
      // const { utxos, walletAddress } = getWalletInfo();
    } catch (err) {
      alert("Transaction fail");
    }
  }

  // handle get contract address
  function getScript(blueprintCompiledCode: string, params: string[] = [], version: "V1" | "V2" | "V3" = "V3") {
    const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
    const scriptAddr = serializePlutusScript({ code: scriptCbor, version: version }, undefined, 0).address;

    return { scriptCbor, scriptAddr };
  }

  // get wallet info
  async function getWalletInfo() {
    if (wallet?.wallet) {
      console.log("get wallet function triggered");

      const utxos = await wallet.wallet.getUtxos();
      const collateral = (await wallet.wallet.getCollateral())[0];
      const walletAddress = await wallet.wallet.getChangeAddress();
      return { utxos, collateral, walletAddress };
    } else {
      console.log("Wallet is undefined");
    }
  }

  useEffect(() => {
    if (wallet?.wallet) {
      console.log("Wallet in Lock : ", wallet.wallet);
      getWalletInfo();
    }
  }, [wallet]);

  return (
    <div>
      <h1>Lock assets</h1>
    </div>
  );
}
