import {NextFunction, Request, Response} from 'express';
import UserStore from '../services/userStore';
import User from '../../db/models/user';
import {generateNonce} from '@meshsdk/core';
import BadRequestError from '../classes/BadRequestError';

export class UserHandler {
	// attributes
	private store: UserStore;

	// constructor
	constructor(store: UserStore) {
		this.store = store;
	}

	// methods
	login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		let error: Error | null = null;

		// handle request body
		try {
			// find user
			const user = await this.store.findUserByStakeAddress(req.body.stakeAddress);
			const nonce = generateNonce('I agree to the term and condition of the Mesh: ');

			// handle if user doesnt exist
			if (!user) {
				// generate new nonce

				// initiate new user
				const newUser = new User({
					stakeAddress: req.body.stakeAddress, // Use the actual stakeAddress from the request
					nonce: nonce,
					verified: false,
				});

				// insert to db
				try {
					await newUser.save();

					return res.status(201).json({message: 'user inserted to db', nonce: nonce});
				} catch (error) {
					const err = new BadRequestError({code: 500, message: 'Something went wrong inserting user to db.'});
					return next(err);
				}
			} else {
				// if user exists, just update the nonce
				user.nonce = nonce;

				try {
					await this.store.updateUser('nonce', user.stakeAddress, nonce);

					return res.status(202).json({message: 'user exists.', nonce: nonce});
				} catch (error) {
					const err = new BadRequestError({code: 500, message: `Internal server error : ${error}`});
					return next(err);
				}
			}
		} catch (error) {
			const err = new BadRequestError({code: 500, message: 'Something went wrong in login.'});
			next(err);
		}
	};
}
