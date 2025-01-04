import { ProductDoc } from "../../db/models/product";
import { UserDoc } from "../../db/models/user";
import BadRequestError from "../classes/BadRequestError";

export interface UserStoreInterface {
  findUserByStakeAddress(stakeAddress: string): Promise<UserDoc | null>;
  updateUser(field: string, stakeAddress: string, updateValue: any): Promise<void>;
}

export interface ProductStoreInterface {
  deleteProduct(id: string): Promise<boolean | BadRequestError>;
}

export type customError = {
  message: string;
  status: number;
};

export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: any };
};

export type User = {
  id: string;
  stakeAddress: string;
  nonce: string;
  verified: boolean;
};

export type ProductPayload = {
  name: string;
  price: number;
  image: string;
  seller_id: string;
};

export type VerifySignature = {
  user_address: string;
  signature: string;
};
