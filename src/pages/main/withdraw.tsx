import { AppContexts, Order } from "@/types/types";
import { getOrderById } from "@/utils/orderUtils";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { handleWithdraw } from "@/utils/withdrawFunds";
import { AppContext } from "@/contexts/appContext";

function Withdraw() {
  const router = useRouter();
  const { orderId, withdrawn, status } = router.query;
  const { wallet } = useContext(AppContext) as AppContexts;

  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    if (orderId && typeof orderId === "string") {
      getOrderById(setOrder, orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (order) {
      console.log("ORDER from withdraw : ", order);
    }
  }, [order]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        className="w-1/3 h-fit rounded-md p-6 border"
        onSubmit={(e) => {
          e.preventDefault();

          if (order && wallet) {
            handleWithdraw(order, wallet, "seller");
          }
        }}
      >
        <h1 className="text-center font-semibold text-2xl pb-4">Order</h1>
        <p className="truncate">Order Id: {order?._id}</p>
        <p className="truncate">Buyer: {order?.buyer_address}</p>
        <p className="truncate">Deadline : {order?.deadline ? new Date(order?.deadline).toLocaleString() : ""}</p>
        <p className="truncate">Price: {order?.price}</p>
        <p className="truncate">Status: {order?.status}</p>

        <Button type="submit">Withdraw</Button>
      </form>
    </div>
  );
}

export default Withdraw;
