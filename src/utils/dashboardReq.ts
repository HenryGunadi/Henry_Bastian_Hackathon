import axios from "axios";
import { SetStateAction } from "react";

export async function getRequest<T>(url: string, state: React.Dispatch<SetStateAction<T>>) {
  try {
    const response = await axios.get<T>(url, { withCredentials: true });

    console.log(response.data);
  } catch (err) {
    console.error("Error : ", err);
  }
}
