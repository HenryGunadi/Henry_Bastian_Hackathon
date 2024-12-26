import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/contexts/appContext";
import { AppContexts } from "@/types/types";
import Button from "@/components/common/Button";
import { handleDeposit } from "@/utils/lockUtils";
import { applyCborEncoding, applyParamsToScript, Asset, BlockfrostProvider, Data, deserializeAddress, mConStr, MeshTxBuilder, resolveDataHash, serializePlutusScript, UTxO } from "@meshsdk/core";
import images from "../../assets/assets";
import { useWallet } from "@meshsdk/react";
import contractBlueprint from "../../../smart_contract/plutus.json";
import { deserialize } from "v8";

const sellerAddr: string = "addr_test1qztrf94r78crckxaw6rwxp7vp20gq0setsgmq354uwr3v8arm95m6v6xdzj2yw6p2szjm64c2l00v4f49y3m8yqavjgswf8x02";
const blockFrostAPIKey: string = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
const nodeProvider = new BlockfrostProvider(blockFrostAPIKey);

const datumValue: Data = new Map<Data, Data>();
datumValue.set("price", 100);
datumValue.set("seller", sellerAddr);
const txHashParam: string = "c63c38e02a5210e845c16870b099c2071d16fcac6f72fdf7abf45c01ffcaf29b";

export default function Lock() {
  // use context
  const { wallet } = useContext(AppContext) as AppContexts;

  // states
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<Asset[]>([]);

  // handler
  function handleSubmitButton() {
    if (balance.length != 0) {
      if (parseInt(balance[0].quantity) >= 100) {
        lockAsset();
      }
    }
  }

  // helpers
  async function getWalletBalance() {
    const balance: Asset[] = await wallet!.getBalance();
    setBalance(balance);
  }

  async function lockAsset() {
    try {
      const utxo = await getUtxoByTxHash(txHashParam);
      if (utxo === undefined) throw new Error("UTxO not found");

      const redeemerValue: Data = new Map<Data, Data>();
      redeemerValue.set("constructor", "MBuy");
      redeemerValue.set("arguments", []);

      // Convert the redeemer data to CBOR
      const { scriptAddr, scriptCbor } = getScript(contractBlueprint.validators[0].compiledCode);
      const { utxos, walletAddress, collateral } = await getWalletInfo();
      const signerHash = deserializeAddress(walletAddress).pubKeyHash;

      const lovelaceAmount = (10 * 1000000).toString();
      const asset: Asset[] = [{ unit: "lovelace", quantity: lovelaceAmount }];

      const datumValue: Data = new Map<Data, Data>();
      datumValue.set("price", 5);
      datumValue.set("seller", sellerAddr);

      // build transaction draft
      const txBuild = new MeshTxBuilder({
        fetcher: nodeProvider,
        submitter: nodeProvider,
        verbose: true,
      });
      const txDraft = await txBuild.setNetwork("preprod").changeAddress(walletAddress).selectUtxosFrom(utxos).txOut(sellerAddr, asset).txOutInlineDatumValue(datumValue).complete();

      // sign the transaction
      const signedTx = await wallet!.signTx(txDraft);

      // submit the transaction
      const txHash = await wallet!.submitTx(signedTx);
      alert(`Transaction successful : ${txHash}`);
    } catch (err) {
      console.error("Transaction error : ", err);
    }
  }

  function getScript(blueprintCompiledCode: string, params: string[] = [], version: "V1" | "V2" | "V3" = "V3") {
    const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
    const scriptAddr = serializePlutusScript({ code: scriptCbor, version: version }, undefined, 0).address;
    return { scriptCbor, scriptAddr };
  }

  async function getWalletInfo() {
    const utxos = await wallet!.getUtxos();
    const collateral = (await wallet!.getCollateral())[0];
    const walletAddress = await wallet!.getChangeAddress();
    return { utxos, collateral, walletAddress };
  }

  // Fungsi membaca index utxo berdasarkan transaction hash aset yang didepositkan
  async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await nodeProvider.fetchUTxOs(txHash);
    console.log("Fetched UTxOs:", utxos);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
    }
    return utxos[0];
  }

  // useEffects
  useEffect(() => {
    if (wallet) {
      getWalletBalance();
    }
  }, [wallet]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>Wallet funds : {balance.length != 0 ? (parseInt(balance[0].quantity) / 1000).toFixed(2) : 0} ADA</h1>

      <div className="w-1/2 h-1/2 border rounded-md flex gap-6">
        <img src={images.dummyAk.src} alt="" className="w-1/2 h-auto object-cover object-center" />

        <div className="flex flex-col w-1/2 p-4 justify-center">
          <h1>Ak-47 </h1>
          <h2>Price : 100 ADA</h2>

          <button className="text-white font-medium bg-zinc-900 rounded-md w-full mt-4" onClick={handleSubmitButton}>
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
