import {BlockfrostProvider, Asset, deserializeAddress, serializePlutusScript, mConStr0, MeshTxBuilder} from '@meshsdk/core';
import contractBlueprint from '../../../smart_contract/plutus.json';
import {useContext, useState} from 'react';
import {AppContext} from '../_app';
import {AppContexts} from '@/types/types';

// block frost api key
const blockFrostAPIKey = process.env.NEXT_BLOCKFROST_API;

// initialize node provider Blockfrost
const nodeProvider = new BlockfrostProvider(blockFrostAPIKey!);

export default function Lock() {
	// use contexts
	const {wallet} = useContext(AppContext) as AppContexts;

	// states
	const [amount, setAmount] = useState<number>(0);

	// handle deposit
	function handleDeposit() {
		if (amount <= 0) {
			alert('Invalid ADA amount');
			return;
		}
		lockAsset();
	}

	// handle lock asset
	async function lockAsset() {
		try {
			// get contract address
			const {scriptAddr} = getScript(contractBlueprint.validators[0].compiledCode);
		} catch (err) {
			alert('Transaction fail');
		}
	}

	// handle get contract address
	function getScript() {}

	return <div></div>;
}
