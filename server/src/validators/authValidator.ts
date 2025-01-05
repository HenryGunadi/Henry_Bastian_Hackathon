import { body } from "express-validator";

export const loginValidator = [body("stake_addr", "stakeAddress is empty").not().isEmpty(), body("stake_addr", "Invalid type").isString()];
