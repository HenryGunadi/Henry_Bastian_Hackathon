import {NextFunction, Request, Response} from 'express';
import UserStore from '../services/userStore';
import User from '../../db/models/user';
import {generateNonce} from '@meshsdk/core';
import BadRequestError from '../classes/BadRequestError';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class UserHandler {
	// attributes
	private store: UserStore;
	private secret: string | '';

	// constructor
	constructor(store: UserStore) {
		this.store = store;
		this.secret = process.env.ACCESS_TOKEN_SECRET || '';
	}

	// methods
	login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
				} catch (error) {
					const err = new BadRequestError({code: 500, message: 'Something went wrong inserting user to db.'});
					return next(err);
				}

				// create jwt token
				const token = jwt.sign(newUser.stakeAddress, this.secret);

				// store the token in cookie
				res.cookie('auth_cookie', token, {maxAge: 3 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict'}); // secure : false only in development
			} else {
				// if user exists, just update the nonce
				user.nonce = nonce;

				try {
					await this.store.updateUser('nonce', user.stakeAddress, nonce);
				} catch (error) {
					const err = new BadRequestError({code: 500, message: `Internal server error : ${error}`});
					return next(err);
				}

				// create jwt token
				const token = jwt.sign(user.stakeAddress, this.secret);

				// store the token in cookie
				res.cookie('auth_cookie', token, {maxAge: 3 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict'}); // secure : false only in development
			}

			console.log('Cookie set');
			return res.status(202).json({message: 'Login successful', nonce: nonce});
		} catch (error) {
			const err = new BadRequestError({code: 500, message: `Something went wrong in login. ${error}`});
			next(err);
		}
	};
}
