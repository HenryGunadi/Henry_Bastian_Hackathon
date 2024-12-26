import { useState, ChangeEvent } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { BlockfrostProvider, UTxO, deserializeAddress, serializePlutusScript, mConStr0, stringToHex, MeshTxBuilder } from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";

// Integrasi smart-contract
import contractBlueprint from "../../../smart_contract/plutus.json";

// Loading environment variable blockfrost API key dan seedphrares wallet
const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";

// Inisiasi node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockfrostApiKey);

export default function Home() {
  const { connected, wallet } = useWallet();
  const [txHash, setTxHash] = useState("");
  const [refNumber, setRefNumber] = useState("");

  function txHashHandler(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setTxHash(value);
  }

  function redeemerHandler(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setRefNumber(value);
  }

  function handleWithdraw() {
    if (!txHash || !refNumber) {
      alert("Tx Hash atau Reference Number tidak boleh kosong !");
      return;
    }
    unlockAssets();
    console.log("Ref number : ", refNumber);
  }

  async function unlockAssets() {
    try {
      // Mendapatkan index utxo berdasarkan transaction hash aset yang didepostikan di contract address
      const utxo = await getUtxoByTxHash(txHash);
      if (utxo === undefined) throw new Error("UTxO not found");

      // Mendapatkan script smart-contract dalam format CBOR
      const { scriptCbor } = getScript(contractBlueprint.validators[0].compiledCode);

      // Mendapatkan index utxo, alamat wallet, dan kolateral
      const { utxos, walletAddress, collateral } = await getWalletInfo();

      // Mendapatkan pub key hash sebagai persetujuan user untuk menandatangi transaksi
      const signerHash = deserializeAddress(walletAddress).pubKeyHash;

      // Membuat draft transaksi
      const txBuild = new MeshTxBuilder({
        fetcher: nodeProvider,
        evaluator: nodeProvider,
        verbose: true,
      });
      const txDraft = await txBuild
        .setNetwork("preprod")
        .spendingPlutusScript("V3")
        .txIn(utxo.input.txHash, utxo.input.outputIndex, utxo.output.amount, utxo.output.address)
        .txInScript(scriptCbor)
        .txInRedeemerValue(mConStr0([stringToHex(refNumber)]))
        .txInDatumValue(mConStr0([signerHash]))
        .requiredSignerHash(signerHash)
        .changeAddress(walletAddress)
        .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
        .selectUtxosFrom(utxos)
        .complete();

      console.log("String to hex : ", [stringToHex(refNumber)]);

      // Menandatangani transaksi
      const signedTx = await wallet.signTx(txDraft);

      // Submit transaksi dan mendapatkan transaksi hash
      const txHash_ = await wallet.submitTx(signedTx);
      alert(`Transaction successful : ${txHash_}`);
      return;
    } catch (error) {
      // Error handling jika transaksi gagal
      alert(`Transaction failed ${error}`);
      return;
    }
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
