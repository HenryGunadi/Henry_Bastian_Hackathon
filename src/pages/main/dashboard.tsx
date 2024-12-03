import { authenticateUser } from "@/services/authService";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../_app";
import { AppContexts } from "@/types/types";
import { BrowserWallet } from "@meshsdk/core";

dotenv.config();
const dashboardMainAPI = "http://localhost:8080/users/dashboard";

export default function dashboard() {
  // states
  const [validated, setValidated] = useState<boolean>(false);

  // use contexts
  const { toggleLoading } = useContext(AppContext) as AppContexts;

  // router
  const router = useRouter();

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

  if (!validated) {
    return <div></div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
