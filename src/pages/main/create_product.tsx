import Button from "@/components/common/Button";
import { Product } from "@/types/types";
import { handleInput, handleSubmitProduct } from "@/utils/productUtils";
import { useEffect, useState } from "react";

let userId: string = "";

if (typeof window !== "undefined") {
  userId = localStorage.getItem("user") || "";
}

function CreateProduct() {
  // states
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    image: null,
    seller_id: userId,
  });

  useEffect(() => {
    console.log("User ID: ", userId);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        action=""
        className="flex flex-col justify-center items-center gap-4"
        onSubmit={(e) => {
          handleSubmitProduct(e, product);
        }}
      >
        <input
          type="text"
          className="w-full p-3 rounded-md border"
          placeholder="Product name"
          onChange={(e) => {
            handleInput(e, setProduct);
          }}
          value={product.name}
          name="name"
        />
        <input
          type="number"
          className="w-full p-3 rounded-md border"
          placeholder="Price in ADA"
          onChange={(e) => {
            handleInput(e, setProduct);
          }}
          value={product.price}
          name="price"
        />
        <input
          type="file"
          className="w-full p-3 rounded-md border"
          placeholder="Product image"
          name="file"
          onChange={(e) => {
            handleInput(e, setProduct);
          }}
        />

        <Button type="submit">Add product</Button>
      </form>
    </div>
  );
}

export default CreateProduct;
