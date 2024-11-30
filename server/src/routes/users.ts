import express, {NextFunction, Request, Response} from 'express';
import validateToken from '../middleware/validateToken';
import {loginValidator} from '../validators/authValidator';
import {errorHandler} from '../middleware/error';

const router = express.Router();

// validate token middleware
router.post('/dashboard', validateToken, (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({message: 'Success'});
	console.log('Dashboard data');
});

export default router;
