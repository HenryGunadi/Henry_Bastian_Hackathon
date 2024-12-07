// Dependencies / modules yang digunakan
import {useState, ChangeEvent, useEffect} from 'react';
import {CardanoWallet, useWallet} from '@meshsdk/react';
import {BlockfrostProvider, Asset, deserializeAddress, serializePlutusScript, mConStr0, MeshTxBuilder} from '@meshsdk/core';
import {applyParamsToScript} from '@meshsdk/core-csl';

// Integrasi smart-contract
import contractBlueprint from '../../../smart_contract/plutus.json';

// Loading environment variable blockfrost API key
const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || '';

// Inisiasi node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockfrostApiKey);

export default function Lock() {
	const {connected, wallet} = useWallet();
	const [amount, setAmount] = useState(0);

	function amountHandler(event: ChangeEvent<HTMLInputElement>): void {
		const value = parseInt(event.target.value);
		setAmount(value);
	}

	function handleDeposit() {
		if (amount <= 0) {
			alert('Jumlah ADA tidak valid');
			return;
		}
		lockAssets();
	}

	async function lockAssets() {
		try {
			// Mendapatkan kontrak address
			const {scriptAddr} = getScript(contractBlueprint.validators[0].compiledCode);

			// Mendapatkan index utxo dan alamat wallet
			const {utxos, walletAddress} = await getWalletInfo();

			// Mendapatkan pub key hash sebagai persetujuan user untuk menandatangi transaksi
			const signerHash = deserializeAddress(walletAddress).pubKeyHash;

			const lovelaceAmount = (amount * 1000000).toString();
			// Menentukan jumlah aset yang akan di kunci
			const assets: Asset[] = [{unit: 'lovelace', quantity: lovelaceAmount}];

			// Membuat draft transaksi
			const txBuild = new MeshTxBuilder({
				fetcher: nodeProvider,
				evaluator: nodeProvider,
				verbose: true,
			});
			const txDraft = await txBuild
				.setNetwork('preprod')
				.txOut(scriptAddr, assets)
				.txOutDatumHashValue(mConStr0([signerHash]))
				.changeAddress(walletAddress)
				.selectUtxosFrom(utxos)
				.complete();

			// Menandatangani transaksi
			const signedTx = await wallet.signTx(txDraft);

			// Submit transaksi dan mendapatkan transaksi hash
			const txHash = await wallet.submitTx(signedTx);
			alert(`Transaction successful : ${txHash}`);
			return;
		} catch (error) {
			// Error handling jika transaksi gagal
			alert(`Transaction failed ${error}`);
			return;
		}
	}

	// Fungsi membaca contract address
	function getScript(blueprintCompiledCode: string, params: string[] = [], version: 'V1' | 'V2' | 'V3' = 'V3') {
		const scriptCbor = applyParamsToScript(blueprintCompiledCode, params);
		const scriptAddr = serializePlutusScript({code: scriptCbor, version: version}, undefined, 0).address;
		return {scriptCbor, scriptAddr};
	}

	// Fungsi membaca informasi wallet
	async function getWalletInfo() {
		const utxos = await wallet.getUtxos();
		const collateral = (await wallet.getCollateral())[0];
		const walletAddress = await wallet.getChangeAddress();
		return {utxos, collateral, walletAddress};
	}

	useEffect(() => {
		console.log('wallet type testing : ', typeof wallet);
	}, [wallet]);

	return (
		<div className="min-h-screen bg-slate-900 w-full text-white text-center">
			{/* NAVBAR */}
			<div className="bg-gray-900 flex justify-between items-center p-6 border-b border-white mb-24">
				<h1 className="text-4xl font-bold">LOCK ADA</h1>
				<CardanoWallet />
			</div>

			{/* FORM */}
			{connected && (
				<div className="flex-col justify-center items-center">
					<div className="mb-4">
						<input
							className="bg-slate-700 border border-white rounded-lg px-3 py-2 w-1/3"
							type="number"
							placeholder="Jumlah ADA yang Akan di Depostikan"
							onChange={amountHandler}
						/>
					</div>
					<div>
						<button
							className="border border-white rounded-xl bg-blue-700 hover:bg-blue-500 hover:font-bold py-2 w-1/3"
							onClick={handleDeposit}
						>
							Deposit
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
