// import { authenticateUser } from "@/services/authService";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContexts } from "@/types/types";
import { BrowserWallet } from "@meshsdk/core";
import { AppContext } from "@/contexts/appContext";
import axios from "axios";
import { getRequest } from "@/utils/dashboardReq";

dotenv.config();

// API Urls
const dashboardMainAPI = "http://localhost:8000/users/dashboard";

export default function dashboard() {
  // states
  const [validated, setValidated] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<[]>([]);

  // use contexts
  const { toggleLoading } = useContext(AppContext) as AppContexts;

  // router
  const router = useRouter();

  useEffect(() => {
    getRequest<any>(dashboardMainAPI, setDashboardData);
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
