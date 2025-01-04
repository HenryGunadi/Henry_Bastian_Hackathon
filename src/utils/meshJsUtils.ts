import {BrowserWallet} from '@meshsdk/core';
import React, {SetStateAction} from 'react';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '@/contexts/appContext';
import {AppContexts} from '@/types/types';
import {
	applyParamsToScript,
	Asset,
	BlockfrostProvider,
	Data,
	deserializeAddress,
	mConStr,
	mConStr0,
	MeshTxBuilder,
	resolveDataHash,
	serializePlutusScript,
	UTxO,
} from '@meshsdk/core';
import contractBlueprint from '../../smart_contract/plutus.json';

// testing seller address
// const sellerAddr: string = 'addr_test1qztrf94r78crckxaw6rwxp7vp20gq0setsgmq354uwr3v8arm95m6v6xdzj2yw6p2szjm64c2l00v4f49y3m8yqavjgswf8x02';

// provider
const blockFrostAPIKey: string = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || '';
const nodeProvider = new BlockfrostProvider(blockFrostAPIKey);

// helpers
export async function getWalletBalance(wallet: BrowserWallet): Promise<number> {
	const balance: Asset[] = await wallet!.getBalance();

	return parseInt(balance[0].quantity) / 1000000;
}

// deposit fund
export async function depositFund(wallet: BrowserWallet, sellerAddr: string, amount: number) {
	try {
		const walletBalance = await getWalletBalance(wallet);

		const assets: Asset[] = [
			{
				unit: 'lovelace',
				quantity: String(amount * 1000000), // 10 ADA
			},
		];

		if (walletBalance < amount) {
			alert('Not enough ADA');
			return;
		}

		const lockUntilTimeStamp = new Date();
		lockUntilTimeStamp.setMinutes(lockUntilTimeStamp.getMinutes() + 1); // 1 minutes in miliseconds

		const unsignedTx = await depositFundTxHelper(wallet, assets, lockUntilTimeStamp.getTime(), sellerAddr);

		const signedTx = await wallet!.signTx(unsignedTx);
		const txHash = await wallet!.submitTx(signedTx);

		console.log('txHash', txHash);
	} catch (err) {
		console.error(err);
	}
}

// Later fix
export async function depositFundTxHelper(
	wallet: BrowserWallet,
	amount: Asset[],
	lockUntilTimeStampMs: number,
	sellerAddr: string
): Promise<string> {
	const {utxos, walletAddress} = await getWalletInfo(wallet);

	const {scriptAddr} = getScript(contractBlueprint.validators[0].compiledCode);

	const {pubKeyHash: ownerPubKeyHash} = deserializeAddress(sellerAddr); // for seller
	const {pubKeyHash: beneficiaryPubKeyHash} = deserializeAddress(walletAddress); // for buyer refund

	const txBuilder = new MeshTxBuilder({
		fetcher: nodeProvider,
		evaluator: nodeProvider,
		verbose: true,
	});

	await txBuilder
		.setNetwork('preprod')
		.txOut(scriptAddr, amount)
		.txOutInlineDatumValue(mConStr0([lockUntilTimeStampMs, ownerPubKeyHash, beneficiaryPubKeyHash]))
		.changeAddress(walletAddress)
		.selectUtxosFrom(utxos)
		.complete();
	return txBuilder.txHex;
}

function getScript(blueprintCompiledCode: string, params: string[] = [], version: 'V1' | 'V2' | 'V3' = 'V3') {
	const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
	const scriptAddr = serializePlutusScript({code: scriptCbor, version: version}, undefined, 0).address;
	return {scriptCbor, scriptAddr};
}

export async function getWalletInfo(wallet: BrowserWallet) {
	const utxos = await wallet!.getUtxos();
	const collateral = (await wallet!.getCollateral())[0];
	const walletAddress = await wallet!.getChangeAddress();
	return {utxos, collateral, walletAddress};
}

export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
	const utxos = await nodeProvider.fetchUTxOs(txHash);
	console.log('Fetched UTxOs:', utxos);
	if (utxos.length === 0) {
		throw new Error('UTxO not found');
	}

	return utxos[0];
}
