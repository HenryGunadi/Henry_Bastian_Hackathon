import {body} from 'express-validator';

export const loginValidator = [
	body('stakeAddress', 'stakeAddress is empty').not().isEmpty(),
	body('stakeAddress', 'Invalid type').isString(),
];
