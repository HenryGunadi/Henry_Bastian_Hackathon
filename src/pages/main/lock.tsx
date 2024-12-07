import {useContext, useState} from 'react';
import {AppContext} from '@/contexts/appContext';
import {AppContexts} from '@/types/types';
import Button from '@/components/common/Button';
import {handleDeposit} from '@/utils/lockUtils';

export default function Lock() {
	// use context
	const {wallet} = useContext(AppContext) as AppContexts;

	// states
	const [amount, setAmount] = useState<number>(0);

	function amountHandler(e: React.ChangeEvent<HTMLInputElement>): void {
		const value = parseInt(e.target.value);
		setAmount(value);
	}

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<form
				action=""
				className="flex-col justify-center items-center flex w-1/2-screen h-1/2-screen border border-black rounded-md shadow-lg px-6 py-4"
			>
				<input
					type="number"
					onChange={amountHandler}
					className="w-full px-3 py-2 border-b border-black focus:outline-none"
					placeholder="Input ADA"
				/>

				<Button
					onClick={() => {
						if (wallet) {
							handleDeposit(wallet, amount);
						}
					}}
					type="submit"
					className="w-full my-3"
				>
					Deposit
				</Button>
			</form>
		</div>
	);
}
