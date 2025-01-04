import express, {NextFunction, Request, Response} from 'express';
import validateToken from '../middleware/validateToken';
import {loginValidator} from '../validators/authValidator';
import UserStore from '../services/userStore';
import User from '../../db/models/user';
import UserController from '../controller/userController';

const router = express.Router();
const userStore: UserStore = new UserStore(User);
const userController = new UserController(userStore);

// validate token middleware
router.get('/dashboard', validateToken, (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({message: 'Success'});
});

router.get('/search', validateToken, (req: Request, res: Response, next: NextFunction) => {
	userController.getUser(req, res, next);
});

export default router;
