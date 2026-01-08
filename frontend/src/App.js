import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

import { useDispatch, useSelector } from "react-redux";
import {
  startUserLoading,
  setUserData,
  setUserDataError,
  clearUserData,
} from "./store/userSlice.js";
import {
  RequireAuth,
  OnlyAgentForNotRole8,
  NonAgentRedirect,
} from "./utils/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./modules/client/Home.jsx";
import Cricket from "./modules/client/pages/Cricket.jsx";
import Tennis from "./modules/client/pages/Tennis.jsx"; 
import Soccer from "./modules/client/pages/Soccer.jsx"; 
import Basketball from "./modules/client/pages/Basketball.jsx"; 
import Livecard from "./modules/client/pages/livecard.jsx";
import Statement from "./modules/client/accounts/statement.jsx";
import ProfitLoss from "./modules/client/accounts/ProfitLoss.jsx";
import ButtonValue from "./modules/client/accounts/ButtonValue.jsx";
import ChangePass from "./modules/client/accounts/ChangePass.jsx";
import Rules from "./modules/client/accounts/Rules.jsx";
import AgentDashboard from "./modules/agent/Dashboard.jsx";
import MatchMain from "./modules/agent/matchbook/MatchMain.jsx";
import BlockMarket from "./modules/agent/BlockMarket.jsx";
import AddClients from "./modules/agent/clientlist/AddClients.jsx";
import ClientList from "./modules/agent/clientlist/ClientList.jsx";
import MarketProfitLoss from "./modules/agent/MarketProfitLoss.jsx";
import AccState from "./modules/agent/report/AccState.jsx";
import ChipState from "./modules/agent/report/ChipState.jsx";
import ReportProLoss from "./modules/agent/report/ReportProLoss.jsx";
import MaxLimit from "./modules/agent/report/MaxLimit.jsx";
import ChipSum from "./modules/agent/report/ChipSum.jsx";
//import AgentProfile from "./modules/agent/profile/Profile.jsx";
//import BookDetails from "./modules/agent/reports/book-details.jsx";
//import AccountList from "./modules/agent/users/accounts-list.jsx";
 
//import "bootstrap/dist/css/bootstrap.min.css";

const queryClient = new QueryClient();

function checkTokenAndLogoutIfExpired() {
  const token = localStorage.getItem("token");
  const currentPath = window.location.pathname;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (currentPath !== "/") {
          window.location.href = "/";
        }
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (currentPath !== "/") {
        window.location.href = "/";
      }
    }
  }
}

function App() {
  const dispatch = useDispatch();

   useEffect(() => {
    const loadUser = async () => {
      dispatch(startUserLoading()); // mark as checking
      try {
        const res = await axiosInstance.get("/user"); // cookie-based session
        if (res.status === 200 && res.data) {
          console.log("User data loaded in App.js:", res.data);
          dispatch(setUserData(res.data));
        } else {
          // no user, mark as initialized anyway
          dispatch(clearUserData());
        }
      } catch (err) {
        console.error("Error loading user:", err);
        dispatch(setUserDataError(err.message));
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Login page */}
        <Route
          path="/"
          element={
            <LoginRedirectIfAuth>
              <Login />
            </LoginRedirectIfAuth>
          }
        />

        {/* Agent routes: Only for user_role !== 8 */}
        <Route element={<RequireAuth />}>
          <Route element={<OnlyAgentForNotRole8 />}>
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            {/*<Route path="/agent/reset-password" element={<AgentProfile />} />
            <Route path="/agent/book-detail" element={<BookDetails />} />
            <Route path="/agent/accounts" element={<AccountList />} />
        <Route path="/agent/accounts/chart" element={<AccountList />} />*/}
            {/* more /agent/* routes can be added here */}
          </Route>
        </Route>

        {/* All other routes */}
        <Route>
          {/* If user_role !== 8, redirect to /agent/dashboard */}
          <Route element={<NonAgentRedirect />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cricket" element={<Cricket />} />
            <Route path="/soccer" element={<Soccer />} />
            <Route path="/tennis" element={<Tennis />} />
            <Route path="/basketball" element={<Basketball />} />
            <Route path="/livecard" element={<Livecard />} />
            <Route path="/statement" element={<Statement />} />
            <Route path="/ProfitLoss" element={<ProfitLoss />} />
            <Route path="/ButtonValue" element={<ButtonValue />} />
            <Route path="/ChangePass" element={<ChangePass />} />
            <Route path="/Rules" element={<Rules />} />
            <Route path="/MatchMain" element={<MatchMain />} />
            <Route path="/BlockMarket" element={<BlockMarket />} />
            <Route path="/AddClients" element={<AddClients />} />
            <Route path="/ClientList" element={<ClientList />} />
            <Route path="/MarketProfitLoss" element={<MarketProfitLoss />} />
            <Route path="/AccState" element={<AccState />} />
            <Route path="/ChipState" element={<ChipState />} />
            <Route path="/ReportProLoss" element={<ReportProLoss />} />
            <Route path="/MaxLimit" element={<MaxLimit />} />
            <Route path="/ChipSum" element={<ChipSum />} />

            
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

function LoginRedirectIfAuth({ children }) {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (user && token) {
    user.user_role && JSON.parse(user).user_role !== 8
      ? window.location.replace("/agent/dashboard")
      : window.location.replace("/home");
    return null;
  }
  return children;
}

export default App;
