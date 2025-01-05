import {AppContexts, Order} from '@/types/types';
import {acceptOrder, getOrders} from '@/utils/orderUtils';
import {useRouter} from 'next/router';
import {useContext, useEffect, useState} from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {handleWithdraw} from '@/utils/withdrawFunds';
import {Wallet} from 'lucide-react';
import {AppContext} from '@/contexts/appContext';

function UserOrder() {
	const [orders, setOrders] = useState<Order[]>([]);
	const {wallet} = useContext(AppContext) as AppContexts;
	const router = useRouter();

	useEffect(() => {
		getOrders(setOrders);
	}, []);

	return (
		<div className="w-screen h-screen flex justify-center items-center bg-gray-100">
			<div className="w-3/4 h-3/4 overflow-y-scroll rounded-md border bg-white p-4">
				{/* Table Header */}
				<div className="grid grid-cols-5 font-bold border-b p-2">
					<p className="text-center">Order ID</p>
					<p className="text-center">Buyer</p>
					<p className="text-center">Status</p>
					<p className="text-center">Deadline</p>
					<p className="text-center">Accepted</p>
				</div>

				{/* Table Body */}
				{orders.length > 0 ? (
					orders.map((order: Order, index: number) => (
						<div key={index} className="grid grid-cols-5 p-2 border-b hover:cursor-pointer">
							<p className="text-center truncate">{order._id}</p>
							<p className="text-center truncate">{order.buyer_address}</p>
							<p className="text-center truncate">{order.status}</p>
							<p className="text-center truncate">{new Date(order.deadline).toLocaleString()}</p>
							<AlertDialog>
								<AlertDialogTrigger>
									<Button variant="outline">{order.status === 'terminated' ? 'Refund' : 'Accept Order'}</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>{order.status === 'terminated' ? 'Refund' : 'Accept Order'}</AlertDialogTitle>
										<AlertDialogDescription>
											{order.status === 'terminated'
												? 'Your ADA will be refunded to your wallet.'
												: 'This action cannot be undone. This will set the order to be accepted.'}{' '}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={async () => {
												if (order.status === 'ongoing') {
													await acceptOrder(order._id);
													await getOrders(setOrders);

													alert('Order has been accepted');
												} else if (order.status === 'terminated') {
													if (wallet) {
														handleWithdraw(order, wallet, 'user');
													} else {
														alert('Wallet is not defined');
													}
												}
											}}
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					))
				) : (
					<p className="text-center mt-4">No orders available</p>
				)}
			</div>
		</div>
	);
}

export default UserOrder;
