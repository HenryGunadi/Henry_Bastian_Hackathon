import { useContext, useEffect, useState } from "react";

// Integrasi smart-contract
import contractBlueprint from "../../../smart_contract/plutus.json";
import { applyParamsToScript, Asset, BlockfrostProvider, Data, MeshTxBuilder, serializePlutusScript, UTxO } from "@meshsdk/core";
import { error } from "console";
import { AppContext } from "@/contexts/appContext";
import { AppContexts } from "@/types/types";

// Loading environment variable blockfrost API key dan seedphrares wallet
const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";

// Inisiasi node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockfrostApiKey);

export default function Unlock() {
  // use context
  const { wallet } = useContext(AppContext) as AppContexts;

  const [txHash, setTxHash] = useState<string>("");

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTxHash(value);
  }

  function handleSetProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setProduct();
  }

  async function setProduct() {
    try {
      // Mendapatkan script smart-contract dalam format CBOR
      const { scriptAddr } = getScript(contractBlueprint.validators[0].compiledCode);

      // Mendapatkan index utxo, alamat wallet, dan kolateral
      const { utxos, walletAddress, collateral } = await getWalletInfo();

      const datumValue: Data = new Map<Data, Data>();
      datumValue.set("price", 5);
      datumValue.set("seller", walletAddress);

      const txBuild = new MeshTxBuilder({
        fetcher: nodeProvider,
        evaluator: nodeProvider,
        verbose: true,
      });

      const asset: Asset[] = [{ unit: "lovelace", quantity: "5000000" }];

      const txDraft = await txBuild.setNetwork("preprod").txOut(scriptAddr, asset).txOutInlineDatumValue(datumValue).selectUtxosFrom(utxos).changeAddress(walletAddress).complete();

      const signedTx = await wallet!.signTx(txDraft);
      const txHash = await wallet?.submitTx(signedTx);
      alert(`Transaction successful : ${txHash}`);
    } catch (err) {
      console.error("Transaction error : ", err);
    }
  }

  async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await nodeProvider.fetchUTxOs(txHash);
    console.log("Contract transaction UTXOS: ", utxos);

    if (utxos.length != 0) {
      throw new Error("UTXOS not found in the contract transaction");
    }

    return utxos[0];
  }

  // Fungsi membaca contract address
  function getScript(blueprintCompiledCode: string, params: string[] = [], version: "V1" | "V2" | "V3" = "V3") {
    const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
    const scriptAddr = serializePlutusScript({ code: scriptCbor, version: version }, undefined, 0).address;
    return { scriptCbor, scriptAddr };
  }

  // Fungsi membaca informasi wallet
  async function getWalletInfo() {
    const utxos = await wallet!.getUtxos();
    const collateral = (await wallet!.getCollateral())[0];
    const walletAddress = await wallet!.getChangeAddress();
    return { utxos, collateral, walletAddress };
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form action="" className="w-1/2 h-1/2">
        <h1 className="text-center font-medium text-xl">Seller</h1>

        <button onClick={handleSetProduct}>Set Product On MarketPlace</button>
      </form>
    </div>
  );
}
