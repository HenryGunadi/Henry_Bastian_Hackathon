// import { authenticateUser } from "@/services/authService";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContexts, Product } from "@/types/types";
import { BrowserWallet } from "@meshsdk/core";
import { AppContext } from "@/contexts/appContext";
import axios from "axios";
import { getRequest } from "@/utils/dashboardReq";
import { getProducts } from "@/utils/productUtils";
import Button from "@/components/common/Button";

dotenv.config();

// API Urls
const dashboardMainAPI = "http://localhost:8000/users/dashboard";

export default function dashboard() {
  // states
  const [dashboardData, setDashboardData] = useState<[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // use contexts
  const { toggleLoading } = useContext(AppContext) as AppContexts;

  // router
  const router = useRouter();

  // get products from seller
  useEffect(() => {
    getProducts(setProducts);
  }, []);

  return (
    <div className="m-12 w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="font-semibold text-2xl">Products</h1>
      <Button
        onClick={() => {
          router.push("/main/user_order");
        }}
      >
        Order History
      </Button>

      <div className="grid grid-cols-4 gap-4 w-full">
        {products.length > 0
          ? products.map((product: Product, index: number) => {
              console.log("Product id : ", product._id);
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 border rounded-md hover:cursor-pointer"
                  onClick={() => {
                    router.push({
                      pathname: "/main/purchase",
                      query: { productId: product._id }, // Pass product data as query params
                    });
                  }}
                >
                  <img src={`/assets/${product.image}`} alt="" />

                  <div className="p-4">
                    <h1>{product.name}</h1>
                    <h1>{product.price}</h1>
                    <p className="break-words">Seller : {product.seller_id}</p>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
