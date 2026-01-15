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
import MatchBook from "./modules/agent/market_analysis/matchbook.jsx";
import TossBook from "./modules/agent/market_analysis/tossbook.jsx";
import ClientPL from "./modules/agent/market_analysis/client_pl.jsx";
import CashSum from "./modules/agent/market_analysis/cashsum.jsx";
import ClientAcc from "./modules/agent/market_analysis/clientacc.jsx";
import DepositModal from "./modules/agent/market_analysis/depositchips.jsx";
import Withdraw from "./modules/agent/market_analysis/withdrawchips.jsx";
import DepositCash from "./modules/agent/market_analysis/depositcash.jsx";
import WithdrawCash from "./modules/agent/market_analysis/withdrawcash.jsx";
import Totalbook from "./modules/agent/market_analysis/totalbook.jsx";

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
        <Route >
          <Route >
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/agent/dashboard" element={<AgentDashboard />} />

             <Route path="/agent/matchmain" element={<MatchMain />} />
            <Route path="/agent/blockmarket" element={<BlockMarket />} />
            <Route path="/agent/addclients" element={<AddClients />} />
            <Route path="/agent/clientlist" element={<ClientList />} />
            <Route path="/agent/marketprofitloss" element={<MarketProfitLoss />} />
            <Route path="/agent/accstate" element={<AccState />} />
            <Route path="/agent/chipstate" element={<ChipState />} />
            <Route path="/agent/reportproloss" element={<ReportProLoss />} />
            <Route path="/agent/maxlimit" element={<MaxLimit />} />
            <Route path="/agent/chipsum" element={<ChipSum />} />
            <Route path="/agent/matchbook" element={<MatchBook />} />
            <Route path="/agent/tossbook" element={<TossBook />} />
            <Route path="/agent/totalbook" element={<Totalbook />} />
            <Route path="agent/clientpl" element={<ClientPL />} />
            <Route path="/agent/cashsum" element={<CashSum />} />
            <Route path="/agent/clientacc" element={<ClientAcc />} />
            <Route path="/depositchip" element={<DepositModal />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/depositcash" element={<DepositCash />} />
            <Route path="/withdrawcash" element={<WithdrawCash />} />




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
