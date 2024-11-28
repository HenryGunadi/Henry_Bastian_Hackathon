import express, {NextFunction, Request, Response} from 'express';
import {loginValidator} from '../validators/authValidator';
import UserStore from '../services/userStore';
import User from '../../db/models/user';
import {UserHandler} from '../controller/userController';
import {validationResult} from 'express-validator';
import {errorHandler} from '../middleware/error';
import BadRequestError from '../classes/BadRequestError';

const router = express.Router();

// instances
const userStore: UserStore = new UserStore(User);
const userHandler: UserHandler = new UserHandler(userStore);

// middleware 1
router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new BadRequestError({code: 400, message: 'Invalid payload validation'});
		next(error);
		return;
	}

	userHandler.login(req, res, next);
});

// error middleware
router.use(errorHandler);

export default router;
