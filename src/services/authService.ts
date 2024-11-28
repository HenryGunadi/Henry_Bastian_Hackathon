import {LoginPayload} from '@/types/types';
import {BrowserWallet} from '@meshsdk/core';
import axios from 'axios';
import {useTransform} from 'framer-motion';
import React from 'react';

// HANDLERS
export const loginHandler = async (
	wallet: BrowserWallet,
	setState: React.Dispatch<React.SetStateAction<string>>,
	toggleLoading: (loading: boolean) => void
): Promise<void> => {
	const loginAPI = 'http://localhost:8080/auth/login';
	toggleLoading(true);

	try {
		const userStakeAddress: string = (await wallet.getUsedAddresses())[0];
		const payload: LoginPayload = {
			stakeAddress: userStakeAddress,
		};

		const response = await axios.post(loginAPI, payload);

		if (response.data) {
			console.log(response.data);
			setState(response.data.nonce);
		}
	} catch (err) {
		console.error(err);
	} finally {
		toggleLoading(false);
	}
};
