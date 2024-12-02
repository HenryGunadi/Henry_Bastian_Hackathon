import { authenticateUser } from "@/services/authService";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../_app";
import { AppContexts, initialStates } from "@/types/types";
import { BrowserWallet } from "@meshsdk/core";
import { useSelector } from "react-redux";

dotenv.config();
const dashboardMainAPI = "http://localhost:8080/users/dashboard";

export default function dashboard() {
  // states
  const [validated, setValidated] = useState<boolean>(false);

  // redux
  const { wallet } = useSelector((state: initialStates) => state.wallet);

  // use contexts
  const { toggleLoading } = useContext(AppContext) as AppContexts;

  // router
  const router = useRouter();

  // authenticate user from backend
  useEffect(() => {
    const localWallet = localStorage.getItem("wallet");

    localWallet && (wallet = JSON.parse(localWallet));
  }, []);

  useEffect(() => {
    const checkAuthenticaion = async () => {
      const authenticated = await authenticateUser(dashboardMainAPI);

      console.log("Authenticated : ", authenticated);

      if (!authenticated) {
        router.push("/main/login");
      } else {
        setValidated(true);
      }
    };

    checkAuthenticaion();
  }, []);

  useEffect(() => {
    console.log("Wallet from dashboard : ", wallet);
  }, []);

  if (!validated) {
    return <div></div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
