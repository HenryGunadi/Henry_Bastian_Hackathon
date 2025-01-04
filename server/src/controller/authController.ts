import {NextFunction, Request, Response} from 'express';
import BadRequestError from '../classes/BadRequestError';
import {checkSignature, DataSignature} from '@meshsdk/core';
import {VerifySignature} from '../types/types';
import UserStore from '../services/userStore';
import jwt from 'jsonwebtoken';

class AuthController {
	private _userStore: UserStore;
	private _secret: string = process.env.ACCESS_TOKEN_SECRET || '';

	constructor(userStore: UserStore) {
		this._userStore = userStore;
	}

	validateSignature = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const payload: VerifySignature = req.body;
			const reqArgument = req.query as {role: string};
			const signature = JSON.parse(payload.signature) as DataSignature;
			const user = await this._userStore.findUserByStakeAddress(payload.user_address);

			if (!user) {
				const error = new BadRequestError({code: 500, message: 'Internal server error', context: {error: 'User is not found'}});
				return next(error);
			}

			const result = checkSignature(user!.nonce, signature, payload.user_address);
			if (result) {
				// create jwt token
				if (!this._secret) {
					const error = new BadRequestError({code: 500, message: 'Internal server error', context: {error: 'Secret is missing'}});
					return next(error);
				}

				const token = jwt.sign(
					{
						id: user.id,
						stake_addr: user.stakeAddress,
						verified: user.verified,
						roles: reqArgument.role,
					},
					this._secret
				);

				// store the token in cookie
				res.cookie('auth_cookie', token, {maxAge: 3 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict'}); // secure : false only in development and sameSite = "strict" for preventing disapearance on reload
			} else {
				const error = new BadRequestError({code: 400, message: 'Unauthorized', context: {error: 'Invalid wallet signature'}});
				return next(error);
			}

			return res.status(200).json({message: 'Login success', user: {user_id: user.id, role: reqArgument.role}});
		} catch (err) {
			const error = new BadRequestError({code: 500, message: 'Internal server error', context: {error: err}});
			next(error);
		}
	};
}

export default AuthController;
