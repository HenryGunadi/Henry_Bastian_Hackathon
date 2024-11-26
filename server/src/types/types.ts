import { UserDoc } from "../../db/models/user";

export interface UserStoreInterface {
  findUserByStakeAddress(stakeAddress: string): Promise<UserDoc | null>;
  insertUser(user: UserDoc): Promise<void>;
  updateUser(field: string, stakeAddress: string, updateValue: any): Promise<void>;
}

export type customError = {
  message: string;
  status: number;
};

export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: any };
};
