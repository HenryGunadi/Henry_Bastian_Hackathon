import { Product } from "@/types/types";
import axios from "axios";
import React, { SetStateAction } from "react";

export function handleInput(e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<SetStateAction<Product>>) {
  const file = e.target.files?.[0];
  const { value, name } = e.target;

  if (name === "file" && file) {
    setState((prev) => ({
      ...prev,
      image: file,
    }));
  } else {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
}

export async function handleSubmitProduct(e: React.FormEvent<HTMLFormElement>, product: Product) {
  e.preventDefault();
  console.log("PRODUCT FROM FRONTEND : ", product);

  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("seller_id", product.seller_id);
    if (product.image) {
      formData.append("image", product.image);
    }

    const res = await axios.post("http://localhost:8000/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  } catch (err) {
    console.error("Error adding prouduct : ", err);
  }
}

export async function getProducts(setState: React.Dispatch<SetStateAction<Product[]>>): Promise<void> {
  try {
    const res = await axios.get<Product[]>("http://localhost:8000/product/get", {
      withCredentials: true,
    });

    setState(res.data);
  } catch (err) {
    console.error("Error getting products : ", err);
  }
}
