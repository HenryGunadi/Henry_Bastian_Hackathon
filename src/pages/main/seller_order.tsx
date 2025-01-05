import {Order} from '@/types/types';
import {getOrders} from '@/utils/orderUtils';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

function SellerOrder() {
	const [orders, setOrders] = useState<Order[]>([]);
	const router = useRouter();

	useEffect(() => {
		getOrders(setOrders);
	}, []);

	return (
		<div className="w-screen h-screen flex justify-center items-center bg-gray-100">
			<div className="w-3/4 h-3/4 overflow-y-scroll rounded-md border bg-white p-4">
				{/* Table Header */}
				<div className="grid grid-cols-4 font-bold border-b p-2">
					<p className="text-center">Order ID</p>
					<p className="text-center">Buyer</p>
					<p className="text-center">Status</p>
					<p className="text-center">Deadline</p>
				</div>

				{/* Table Body */}
				{orders.length > 0 ? (
					orders.map((order: Order, index: number) => (
						<div
							key={index}
							className="grid grid-cols-4 p-2 border-b hover:cursor-pointer"
							onClick={() => {
								router.push({
									pathname: '/main/withdraw',
									query: {orderId: order._id}, // Pass product data as query params
								});
							}}
						>
							<p className="text-center truncate">{order._id}</p>
							<p className="text-center truncate">{order.buyer_address}</p>
							<p className="text-center truncate">{order.status}</p>
							<p className="text-center truncate">{new Date(order.deadline).toLocaleString()}</p>
						</div>
					))
				) : (
					<p className="text-center mt-4">No orders available</p>
				)}
			</div>
		</div>
	);
}

export default SellerOrder;
