import {NextFunction, Request, Response} from 'express';
import jwt, {JsonWebTokenError} from 'jsonwebtoken';
import dotenv from 'dotenv';
import BadRequestError from '../classes/BadRequestError';

dotenv.config();

export default async function validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authCookie = req.cookies['auth_cookie'];
	const secret = process.env.ACCESS_TOKEN_SECRET || '';
	const error = new BadRequestError();

	console.log('auth cookie : ', authCookie);

	if (authCookie == undefined) {
		error.statusCode = 401;
		error.message = 'token not found';
		next(error);
	}
	if (secret == '') {
		error.statusCode = 500;
		error.message = 'internal server error';
		next(error);
	}

	// If there is a cookie, verify it
	jwt.verify(authCookie!, secret, (err: JsonWebTokenError | null) => {
		// If there is an error, return an error
		if (err) return res.sendStatus(403);

		// If there is no error, continue the execution
		next();
	});
}
