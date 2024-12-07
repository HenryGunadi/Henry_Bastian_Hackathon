import {
	BlockfrostProvider,
	Asset,
	deserializeAddress,
	serializePlutusScript,
	mConStr0,
	MeshTxBuilder,
	applyParamsToScript,
	BrowserWallet,
} from '@meshsdk/core';
import contractBluePrint from '../../smart_contract/plutus.json';

// block frost api key
const blockFrostAPIKey = process.env.NEXT_PUBLIC_BLOCKFROST_API || '';

// initialize node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockFrostAPIKey!);

// handle deposit
export function handleDeposit(wallet: BrowserWallet, amount: number) {
	if (amount <= 0) {
		alert('Invalid ADA amount');
		return;
	}
	lockAsset(wallet, amount);
}

// get wallet info
export async function getWalletInfo(wallet: BrowserWallet) {
	const utxos = await wallet.getUtxos();
	const collateral = (await wallet.getCollateral())[0];
	const walletAddress = await wallet.getChangeAddress();
	return {utxos, collateral, walletAddress};
}

// handle lock asset
export async function lockAsset(wallet: BrowserWallet, amount: number) {
	try {
		// get contract address
		const {scriptAddr} = getScript(contractBluePrint.validators[0].compiledCode);

		// get index utxo and wallet address
		const {utxos, walletAddress} = await getWalletInfo(wallet);

		// get pub key hash for user be able to sign the contract
		const signerHash = deserializeAddress(walletAddress).pubKeyHash;

		// set lovelace amount to lock in the contract
		const loveLaceAmount = (amount * 1000000).toString();
		const asset: Asset[] = [{unit: 'lovelace', quantity: loveLaceAmount}];

		// make transaction draft
		const txBuild = new MeshTxBuilder({
			fetcher: nodeProvider,
			evaluator: nodeProvider,
			verbose: true,
		});
		const txDraft = await txBuild
			.setNetwork('preprod')
			.txOut(scriptAddr, asset) // the recipient address and the locked assets
			.txOutDatumEmbedValue(mConStr0([signerHash]))
			.changeAddress(walletAddress)
			.selectUtxosFrom(utxos)
			.complete();

		// sign the transaction
		const signedTx = await wallet.signTx(txDraft);

		// submit transaction and get transaction hash
		const txHash = await wallet.submitTx(signedTx);
		alert(`Transaction successful : ${txHash}`);
	} catch (err) {
		alert('Transaction fail');
	}
}

// handle get contract address
export function getScript(blueprintCompiledCode: string, params: string[] = [], version: 'V1' | 'V2' | 'V3' = 'V3') {
	const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
	const scriptAddr = serializePlutusScript({code: scriptCbor, version: version}, undefined, 0).address;

	return {scriptCbor, scriptAddr};
}
