import {Order} from '@/types/types';
import {OrderDoc} from '../../db/models/order';
import {ProductDoc} from '../../db/models/product';
import {UserDoc} from '../../db/models/user';
import BadRequestError from '../classes/BadRequestError';

export interface UserStoreInterface {
	findUserByStakeAddress(stakeAddress: string): Promise<UserDoc | null>;
	findUserById(id: string): Promise<UserDoc | null>;
	updateUser(field: string, stakeAddress: string, updateValue: any): Promise<void>;
}

export interface ProductStoreInterface {
	deleteProduct(id: string): Promise<boolean | BadRequestError>;
	getProducts(): Promise<ProductDoc[] | ProductDoc | BadRequestError>;
	getProductById(id: string): Promise<ProductDoc | BadRequestError>;
	getSellerProducts(seller_id: string): Promise<ProductDoc[] | BadRequestError>;
}

export interface OrderStoreInterface {
	createOrder(order: OrderPayload): Promise<boolean | BadRequestError>;
	getOrders(user_id: string, role: 'seller' | 'user'): Promise<OrderDoc[] | BadRequestError>;
	getOrderById(id: string): Promise<OrderDoc | BadRequestError>;
	acceptOrder(id: string): Promise<boolean | BadRequestError>;
}

export type customError = {
	message: string;
	status: number;
};

export type CustomErrorContent = {
	message: string;
	context?: {[key: string]: any};
};

export type User = {
	id: string;
	stake_addr: string;
	nonce: string;
	verified: boolean;
	roles: string;
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

export type OrderPayload = {
	buyer_address: string;
	seller_address: string;
	price: number;
	productId: string;
	status: boolean;
};
