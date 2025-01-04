import Button from '@/components/common/Button';
import {Product} from '@/types/types';
import {getProducts} from '@/utils/productUtils';
import {Divide} from 'lucide-react';
import {useEffect, useState} from 'react';
import image from '../../../public/assets/image_date_04-01-2025_keyboard_test.jpg';

function SellerDashboard() {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts(setProducts);
	}, []);

	useEffect(() => {
		if (products.length > 0) {
			console.log(products);
		}
	}, [products]);

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<div>
				<h1 className="">Seller Dashboard</h1>
				<Button className="my-4">Order history</Button>
			</div>

			<div className="gap-4 w-1/2 h-fit flex flex-col p-4 justify-center items-center">
				{products.length > 0
					? products.map((product: Product, index: number) => {
							console.log('product image : ', product.image);
							return (
								<div key={index}>
									<img src={`/assets/${product.image}`} alt="" className="w-10 h-10" />
								</div>
							);
					  })
					: ''}
			</div>
		</div>
	);
}

export default SellerDashboard;
