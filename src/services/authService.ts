import axios from "axios";
import { useTransform } from "framer-motion";

// APIS
const LOGIN_API_URL = "http://localhost:8000/auth/login";

// HANDLERS
export const loginHandler = async (userStakeAddress: string): Promise<any> => {
  try {
    const response = await axios.post(LOGIN_API_URL, userStakeAddress);

    if (response.status === 200 && response.data) {
      console.log(response.data);
    }
  } catch (err) {
    console.error(err);
  }
};
