import Button from "@/components/common/Button";
import { Product } from "@/types/types";
import { getProducts, getSellerProducts } from "@/utils/productUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function SellerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getSellerProducts(setProducts);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      console.log(products);
    }
  }, [products]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center p-16">
      <div className="flex flex-col">
        <h1 className="">Seller Dashboard</h1>
        <Button
          className="my-4"
          onClick={() => {
            router.push("/main/seller_order");
          }}
        >
          Order history
        </Button>
        <Button
          onClick={() => {
            router.push("/main/create_product");
          }}
        >
          Add Product
        </Button>
      </div>

      <h1 className="text-2xl font-semibold my-8">Products</h1>
      <div className="gap-12 w-full h-fit grid grid-cols-5 p-4 justify-center items-center">
        {products.length > 0
          ? products.map((product: Product, index: number) => {
              console.log("product image : ", product.image);
              return (
                <div key={index} className="flex justify-center items-center flex-col rounded-md border shadow-sm">
                  <img src={`/assets/${product.image}`} alt="" className="w-full h-auto" />

                  <div className="w-full p-4">
                    <h1 className="text-center text-xl font-semibold pb-4">{product.name}</h1>
                    <h1 className="text-xl">Price : {product.price}</h1>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default SellerDashboard;
