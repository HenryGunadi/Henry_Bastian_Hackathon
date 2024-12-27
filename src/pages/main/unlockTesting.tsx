import { useState, ChangeEvent } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { SLOT_CONFIG_NETWORK, ConStr0, Integer, BuiltinByteString, BlockfrostProvider, UTxO, deserializeAddress, serializePlutusScript, mConStr0, stringToHex, MeshTxBuilder, deserializeDatum, unixTimeToEnclosingSlot } from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";

// Integrasi smart-contract
import contractBlueprint from "../../../smart_contract/plutus.json";

// Loading environment variable blockfrost API key dan seedphrares wallet
const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";

// Inisiasi node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockfrostApiKey);

// vesting datum type
export type VestingDatum = ConStr0<[Integer, BuiltinByteString, BuiltinByteString]>;

export default function Home() {
  const { connected, wallet } = useWallet();
  const [txHashFromDesposit, setTxHashFromDeposit] = useState("");
  const [refNumber, setRefNumber] = useState<string>("");

  function txHashHandler(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setTxHashFromDeposit(value);
  }

  function redeemerHandler(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setRefNumber(value);
  }

  function handleWithdraw() {
    if (!txHashFromDesposit) {
      alert("Tx Hash tidak boleh kosong !");
      return;
    }
    withdrawFundTx();
  }

  async function withdrawFundTx() {
    const utxo = await getUtxoByTxHash(txHashFromDesposit);

    if (utxo === undefined) throw new Error("UTxO not found");

    const unsignedTx = await withdrawFundTxHelper(utxo);

    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log("txHash", txHash);
  }

  async function withdrawFundTxHelper(vestingUtxo: UTxO): Promise<string> {
    const { utxos, walletAddress, collateral } = await getWalletInfo();
    const { input: collateralInput, output: collateralOutput } = collateral;

    const { scriptAddr, scriptCbor } = getScript(contractBlueprint.validators[0].compiledCode);

    const { pubKeyHash } = deserializeAddress(walletAddress);

    const datum = deserializeDatum<VestingDatum>(vestingUtxo.output.plutusData!);

    const invalidBefore = unixTimeToEnclosingSlot(Math.min(datum.fields[0].int as number, Date.now() - 15000), SLOT_CONFIG_NETWORK.preprod) + 1;

    const txBuilder = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    await txBuilder
      .spendingPlutusScript("V3")
      .txIn(vestingUtxo.input.txHash, vestingUtxo.input.outputIndex, vestingUtxo.output.amount, scriptAddr)
      .spendingReferenceTxInInlineDatumPresent()
      .spendingReferenceTxInRedeemerValue("")
      .txInScript(scriptCbor)
      .txOut(walletAddress, [])
      .txInCollateral(collateralInput.txHash, collateralInput.outputIndex, collateralOutput.amount, collateralOutput.address)
      .invalidBefore(invalidBefore)
      .requiredSignerHash(pubKeyHash)
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .complete();
    return txBuilder.txHex;
  }

  // Fungsi membaca index utxo berdasarkan transaction hash aset yang didepositkan
  async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await nodeProvider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
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
    const utxos = await wallet.getUtxos();
    const collateral = (await wallet.getCollateral())[0];
    const walletAddress = await wallet.getChangeAddress();
    return { utxos, collateral, walletAddress };
  }

  return (
    <div className="min-h-screen bg-slate-900 w-full text-white text-center">
      {/* NAVBAR */}
      <div className="bg-gray-900 flex justify-between items-center p-6 border-b border-white mb-24">
        <h1 className="text-4xl font-bold">UNLOCK ADA</h1>
        <CardanoWallet />
      </div>

      {/* FORM */}
      {connected && (
        <div className="flex-col justify-center items-center">
          <div className="mb-4">
            <input className="border border-white rounded-lg bg-slate-700 px-3 py-2 w-1/3" type="text" placeholder="Masukan ID Transaksi (Tx-Hash)" onChange={txHashHandler} />
          </div>
          <div className="mb-4">
            <input className="border border-white rounded-lg bg-slate-700 px-3 py-2 w-1/3" type="text" placeholder="Masukan Reference Number" onChange={redeemerHandler} />
          </div>
          <div>
            <button className="border border-white rounded-xl bg-blue-700 hover:bg-blue-500 px-3 py-2 w-1/3" onClick={handleWithdraw}>
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
