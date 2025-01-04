import express, {NextFunction, Request, Response} from 'express';
import {loginValidator} from '../validators/authValidator';
import UserStore from '../services/userStore';
import User from '../../db/models/user';
import UserController from '../controller/userController';
import {validationResult} from 'express-validator';
import BadRequestError from '../classes/BadRequestError';
import AuthController from '../controller/authController';

const router = express.Router();

// instances
const userStore: UserStore = new UserStore(User);
const userHandler: UserController = new UserController(userStore);
const authController: AuthController = new AuthController(userStore);

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

router.post('/verify_signature', (req: Request, res: Response, next: NextFunction) => {
	authController.validateSignature(req, res, next);
});

export default router;
