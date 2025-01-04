import {AppContexts, Product} from '@/types/types';
import {getProductById, getProducts, getSeller} from '@/utils/productUtils';
import {useRouter} from 'next/router';
import {useContext, useEffect, useState} from 'react';
import Button from '@/components/common/Button';
import {AppContext} from '@/contexts/appContext';
import {Asset} from '@meshsdk/core';
import {depositFund, getWalletBalance} from '@/utils/meshJsUtils';

function Purchase() {
	const {wallet} = useContext(AppContext) as AppContexts;
	const router = useRouter();
	const {productId} = router.query;

	// states
	const [amount, setAmount] = useState<number>(0);
	const [sellerAddr, setSellerAddr] = useState<string>('');
	const [product, setProduct] = useState<Product>({
		_id: '',
		name: '',
		price: 0,
		image: null,
		seller_id: '',
	});

	useEffect(() => {
		if (typeof productId === 'string' && productId) {
			getProductById(setProduct, productId);
		}
	}, [productId]);

	useEffect(() => {
		getSeller(product.seller_id, setSellerAddr);
	}, [product]);

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<div className="border rounded-md w-1/3 h-fit flex flex-col">
				<img src={`/assets/${product.image}`} alt="" />

				<form
					action=""
					onSubmit={(e) => {
						e.preventDefault();

						if (wallet && sellerAddr) {
							depositFund(wallet, sellerAddr, product.price);
						}
					}}
				>
					<h1>{product.name}</h1>
					<h1>{product.price}</h1>
					<h1>{product.seller_id}</h1>

					<Button type="submit">Purchase</Button>
				</form>
			</div>
		</div>
	);
}

export default Purchase;
