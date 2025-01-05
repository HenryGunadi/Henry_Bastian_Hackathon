import Button from "@/components/common/Button";
import { Product, ProductPayload } from "@/types/types";
import { handleInput, handleSubmitProduct } from "@/utils/productUtils";
import { useEffect, useState } from "react";

function CreateProduct() {
  // states
  const [product, setProduct] = useState<ProductPayload>({
    name: "",
    price: 0,
    image: null,
    seller_id: "",
  });

  useEffect(() => {
    let user: { user: string; role: string } = { user: "", role: "" };

    if (typeof window !== "undefined") {
      const userFromLocalStorage = localStorage.getItem("user");
      user = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : {};
    }

    setProduct((prev) => ({
      ...prev,
      seller_id: user.user,
    }));

    console.log("USER FROM LOCALSTORAGE : ", user);
    console.log("User ID: ", user.user);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        action=""
        className="flex flex-col justify-center items-center gap-4"
        onSubmit={(e) => {
          handleSubmitProduct(e, product, setProduct);
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
