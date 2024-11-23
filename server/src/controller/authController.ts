import express, {Request, Response} from 'express';
import UserStore from '../services/userStore';
import {UserDoc} from '../../db/models/user';

export class UserHandler {
	// attributes
	private store: UserStore;

	// constructor
	constructor(store: UserStore) {
		this.store = store;
	}

	// methods
	login = (req: Request, res: Response) => {
		// handle requets body
		const payload: UserDoc | undefined = req.body;

		// check if user exists
        if ()
	};
}
