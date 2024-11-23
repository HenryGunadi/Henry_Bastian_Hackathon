import express, {NextFunction, Request, Response} from 'express';
import {loginValidator} from '../validators/authValidator';
import UserStore from '../services/userStore';
import User from '../../db/models/user';
import {UserHandler} from '../controller/authController';

const router = express.Router();

// instances
const userStore: UserStore = new UserStore(User);
const userHandler: UserHandler = new UserHandler(userStore);

// middleware 1
router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) => {
    
});

export default router;
