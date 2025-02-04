import {LoginPayload, LoginResponse, VerifySignatureReq} from '@/types/types';
import {AssetExtended, BrowserWallet, DataSignature} from '@meshsdk/core';
import axios from 'axios';
import React from 'react';
import {NextRouter} from 'next/router'; // Import useRouter from next/router
import {headers} from 'next/headers';

// HANDLERS
export const loginHandler = async (
	wallet: BrowserWallet,
	toggleLoading: (loading: boolean) => void,
	toggleAlert: (success: 'Success' | 'Error' | 'Alert', msg: string, alert: boolean) => void,
	selectedWallet: string,
	role: 'user' | 'seller' = 'user',
	walletAssets: AssetExtended[] | undefined,
	router: NextRouter
): Promise<void | string> => {
	const userRole = role === 'user' ? 'user' : 'seller';
	const loginAPI = `http://localhost:8000/auth/login?role=${userRole}`;
	toggleLoading(true);

	if (!wallet) {
		toggleAlert('Error', 'Wallet is not found.', true);
		return;
	} else if (walletAssets?.length == 0) {
		toggleAlert('Error', 'Assets not found', true);
		return;
	}

	try {
		const userStakeAddress: string = (await wallet.getUsedAddresses())[0];
		const payload: LoginPayload = {
			stake_addr: userStakeAddress,
		};

		const response = await axios.post<LoginResponse>(loginAPI, payload, {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		});
		console.log(response.data);

		const nonce = response.data.nonce;
		if (!response.data && !nonce) {
			throw new Error('Login response data not found');
		}

		console.log('NONCE FRONTEND : ', nonce);

		localStorage.setItem('wallet_provider', selectedWallet);

		const walletAddress = (await wallet.getUsedAddresses())[0];

		if (nonce && walletAddress) {
			const signature = await wallet.signData(nonce, walletAddress);
			console.log('signature from frontend: ', signature);

			const validated = await validateSignature(signature, walletAddress, role);
			console.log('VALIDATED : ', validated);

			if (validated.validated) {
				localStorage.setItem('user', JSON.stringify({user: validated.response.user.user_id, role: validated.response.user.role}));

				if (role === 'user') {
					router.push('/main/dashboard');
				} else if (role === 'seller') {
					router.push('/main/seller_dashboard');
				}
			} else {
				toggleAlert('Error', 'User signature is not validated', true);
				return;
			}
		} else {
			toggleAlert('Error', 'Nonce is missing', true);
			return;
		}
	} catch (err) {
		console.error(err);
	} finally {
		toggleLoading(false);
	}
};

export const validateSignature = async (
	signature: DataSignature,
	walletAddr: string,
	role: string
): Promise<{validated: boolean; response: any}> => {
	try {
		console.log('waller addr from frontend : ', walletAddr);
		const reqPayload: VerifySignatureReq = {
			user_address: walletAddr,
			signature: JSON.stringify(signature),
		};

		const response = await axios.post(`http://localhost:8000/auth/verify_signature?role=${role}`, reqPayload, {
			withCredentials: true,
		});

		console.log('From validate signature : ', response.data);
		return {validated: true, response: response.data};
	} catch (err) {
		// console.error("Error validating signature : ", err);
		return {validated: false, response: null};
	}
};
