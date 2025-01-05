import { useState, ChangeEvent } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import {
  SLOT_CONFIG_NETWORK,
  ConStr0,
  Integer,
  BuiltinByteString,
  BlockfrostProvider,
  UTxO,
  deserializeAddress,
  serializePlutusScript,
  mConStr0,
  stringToHex,
  MeshTxBuilder,
  deserializeDatum,
  unixTimeToEnclosingSlot,
  BrowserWallet,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";
import dotenv from "dotenv";

dotenv.config();

// Integrasi smart-contract
import contractBlueprint from "../../smart_contract/plutus.json";
import e from "express";
import { Order } from "@/types/types";
import { Wallet } from "lucide-react";

// Loading environment variable blockfrost API key dan seedphrares wallet
const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";

// Inisiasi node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockfrostApiKey);

// vesting datum type
export type VestingDatum = ConStr0<[Integer, BuiltinByteString, BuiltinByteString]>;

// withdraw key for seller
const withdrawKey: string = process.env.WITHDRAW_KEY || "";

export async function handleWithdraw(order: Order, wallet: BrowserWallet, role: string) {
  try {
    // for seller
    if (order.status === "ongoing" && role === "seller") {
      alert("Customer has not accepted the product yet");
      return;
    } else if (order.status === "terminated" && role === "seller") {
      alert("Deadline has reached, order has been terminated cannot withdraw ADA");
      return;
    }

    // for customer
    if (order.status === "ongoing" && role === "user") {
      alert("Product is ongoin cannot refund ADA.");
      return;
    } else if (order.status === "accepted" && role === "user") {
      alert("Order has been accepted");
      return;
    }

    await withdrawFundTx(order, wallet);
    alert("ADA has been withdrawn to your wallet.");
  } catch (err) {
    console.error(err);
  }
}

export async function withdrawFundTx(order: Order, wallet: BrowserWallet): Promise<void> {
  try {
    const utxo = await getUtxoByTxHash(order.txHash);
    console.log("CONTRACT UTXO : ", utxo);

    if (utxo === undefined) throw new Error("UTxO not found");

    const unsignedTx = await withdrawFundTxHelper(utxo, wallet);

    if (unsignedTx) {
      console.log("UNSIGNEDTX : ", unsignedTx);

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash", txHash);
    } else {
      alert("No unsigned tx!");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function withdrawFundTxHelper(vestingUtxo: UTxO, wallet: BrowserWallet): Promise<void | string> {
  try {
    const { utxos, walletAddress, collateral } = await getWalletInfo(wallet);
    console.log("UTXOS : ", utxos);
    console.log("wallet address : ", walletAddress);
    console.log("Collateral : ", collateral);

    const { scriptAddr, scriptCbor } = getScript(contractBlueprint.validators[0].compiledCode);

    const { pubKeyHash } = deserializeAddress(walletAddress); // seller or the owner

    const datum = deserializeDatum<VestingDatum>(vestingUtxo.output.plutusData!);

    const invalidBefore = unixTimeToEnclosingSlot(Math.min(datum.fields[0].int as number, Date.now() - 15000), SLOT_CONFIG_NETWORK.preprod) + 1;

    const txBuilder = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    console.log("CONTRACT UTXO ADDR : ", vestingUtxo.output.address);
    console.log("WITHDRAW KEY : ", withdrawKey);

    console.log("UTxO:", vestingUtxo);
    console.log("Datum:", datum);
    console.log("Withdraw Key:", withdrawKey);
    console.log("Wallet Info:", { utxos, walletAddress, collateral });

    await txBuilder
      .setNetwork("preprod")
      .spendingPlutusScript("V3")
      .txIn(vestingUtxo.input.txHash, vestingUtxo.input.outputIndex, vestingUtxo.output.amount, vestingUtxo.output.address)
      .spendingReferenceTxInInlineDatumPresent()
      .txInScript(scriptCbor)
      .txInRedeemerValue(mConStr0([mConStr0([stringToHex(withdrawKey)])])) // withdraw key
      .txOut(walletAddress, [])
      .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
      .invalidBefore(invalidBefore)
      .requiredSignerHash(pubKeyHash)
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .complete();

    return txBuilder.txHex;
  } catch (err) {
    alert(`Transaction error : ${err}`);
  }
}

// Fungsi membaca index utxo berdasarkan transaction hash aset yang didepositkan
export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
  const utxos = await nodeProvider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}

// Fungsi membaca contract address
export function getScript(blueprintCompiledCode: string, params: string[] = [], version: "V1" | "V2" | "V3" = "V3") {
  const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
  const scriptAddr = serializePlutusScript({ code: scriptCbor, version: version }, undefined, 0).address;
  return { scriptCbor, scriptAddr };
}

// Fungsi membaca informasi wallet
export async function getWalletInfo(wallet: BrowserWallet) {
  const utxos = await wallet.getUtxos();
  const collateral = (await wallet.getCollateral())[0];
  const walletAddress = await wallet.getChangeAddress();

  // if (!utxos || utxos?.length === 0) {
  // 	throw new Error('No utxos found');
  // }
  // if (!collateral) {
  // 	throw new Error('No collateral found');
  // }
  // if (!walletAddress) {
  // 	throw new Error('No wallet address found');
  // }

  return { utxos, collateral, walletAddress };
}
