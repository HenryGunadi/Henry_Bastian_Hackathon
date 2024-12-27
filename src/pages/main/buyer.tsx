import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/contexts/appContext";
import { AppContexts } from "@/types/types";
import { applyParamsToScript, Asset, BlockfrostProvider, Data, deserializeAddress, mConStr, mConStr0, MeshTxBuilder, resolveDataHash, serializePlutusScript, UTxO } from "@meshsdk/core";
import images from "../../assets/assets";
import contractBlueprint from "../../../smart_contract/plutus.json";

// testing seller address
const sellerAddr: string = "addr_test1qztrf94r78crckxaw6rwxp7vp20gq0setsgmq354uwr3v8arm95m6v6xdzj2yw6p2szjm64c2l00v4f49y3m8yqavjgswf8x02";

// provider
const blockFrostAPIKey: string = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
const nodeProvider = new BlockfrostProvider(blockFrostAPIKey);

export default function Lock() {
  // use context
  const { wallet } = useContext(AppContext) as AppContexts;

  // states
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<Asset[]>([]);

  // submit handler
  function handleSubmitButton() {
    depositFund();
    console.log("handle submit clicked");
  }

  // helpers
  async function getWalletBalance() {
    const balance: Asset[] = await wallet!.getBalance();
    setBalance(balance);
  }

  // deposit fund
  async function depositFund() {
    const assets: Asset[] = [
      {
        unit: "lovelace",
        quantity: "10000000", // 10 ADA
      },
    ];

    const lockUntilTimeStamp = new Date();
    lockUntilTimeStamp.setMinutes(lockUntilTimeStamp.getMinutes() + 1);

    const unsignedTx = await depositFundTxHelper(assets, lockUntilTimeStamp.getTime());

    const signedTx = await wallet!.signTx(unsignedTx);
    const txHash = await wallet!.submitTx(signedTx);

    console.log("txHash", txHash);
  }

  // Later fix
  async function depositFundTxHelper(amount: Asset[], lockUntilTimeStampMs: number): Promise<string> {
    const { utxos, walletAddress } = await getWalletInfo();

    const { scriptAddr } = getScript(contractBlueprint.validators[0].compiledCode);

    const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(walletAddress);
    const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(walletAddress);

    const txBuilder = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    await txBuilder
      .txOut(scriptAddr, amount)
      .txOutInlineDatumValue(mConStr0([lockUntilTimeStampMs, ownerPubKeyHash, beneficiaryPubKeyHash]))
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .complete();
    return txBuilder.txHex;
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
    const useGetWalletInfo = async () => {
      try {
        const { utxos, collateral, walletAddress } = await getWalletInfo();

        console.log("Wallet UTXOS : ", utxos);
        console.log("Wallet Address : ", walletAddress);
      } catch (err) {}
    };

    useGetWalletInfo();
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
