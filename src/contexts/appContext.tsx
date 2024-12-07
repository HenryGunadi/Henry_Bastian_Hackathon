import {AppContexts, AppProviderProps, ToggleAlert} from '@/types/types';
import {BrowserWallet} from '@meshsdk/core';
import {useRouter} from 'next/router';
import React, {createContext, ReactNode, useEffect, useState} from 'react';

export const AppContext = createContext<AppContexts | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode; props: AppProviderProps}> = ({children, props}) => {
	const [wallet, setWallet] = useState<BrowserWallet | null>(null);
	const [walletProvider, setWalletProvider] = useState<string>('');

	const router = useRouter();

	// alert state handler
	const toggleAlert = (success: 'Success' | 'Error' | 'Alert', msg: string, alert: boolean): void => {
		props.setAlert({
			success: success,
			msg: msg,
			alert: alert,
		});
	};

	// loading state handler
	const toggleLoading = (loading: boolean): void => {
		props.setLoading(loading);
	};

	// connect wallet
	async function connectWallet(): Promise<void> {
		try {
			const wlt = await BrowserWallet.enable(walletProvider);
			setWallet(wlt);
		} catch (err) {
			console.error('Error connecting to wallet : ', err);
		}
	}

	useEffect(() => {
		if (typeof window != undefined) {
			const walletProv = localStorage.getItem('wallet_provider');

			if (walletProv) {
				setWalletProvider(walletProv);
				return;
			}

			console.log('Wallet provider is not selected');
		}
	}, []);

	useEffect(() => {
		if (walletProvider != '') {
			connectWallet();
		}
	}, [walletProvider]);

	return (
		<AppContext.Provider
			value={{
				toggleAlert,
				toggleLoading,
				wallet,
				setWalletProvider,
				router,
				connectWallet,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
