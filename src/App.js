import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SideBar } from "./Components/Shared/SideBar";
import { NavigationBar } from "./Components/Shared/NavigationBar";
import { ContractSummary } from "./Components/Contract/ContractSummary";
import { ContractDetail } from "./Components/Contract/ContractDetail";
import { ContractAmendment } from "./Components/Contract/ContractAmendment";
import { ContractNew } from "./Components/Contract/ContractNew";
import { Session } from "./Components/Session/Session";
import { MemberDetail } from "./Components/Contract/MemberDetail";
import { SessionAuditTrail } from "./Components/Session/SessionAuditTrail";
import { Login } from "./Components/Login";
import { useToken } from "./Utility/UseToken";
import { CustomizedSnackbars } from "./Utility/notification";
import {CollateralizedReport} from "./Components/Report/CollateralizedReport";

function App() {
  const { token, setToken } = useToken();
  const [notification, setNotification] = useState({
    message: "",
    openNotif: false,
    severity: "",
  });
  if (!token) {
    return <Login setToken={setToken} />;
  }
  const decodedJwt = JSON.parse(
    atob(localStorage.getItem("userToken").split(".")[1])
  );
  if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
    localStorage.removeItem("userName");
    setToken(null);
    return <Login setToken={setToken} />;
  }
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, openNotif: false }));
  };
  return (
    <div className="App">
      <BrowserRouter>
        <SideBar />
        <NavigationBar setToken={setToken} />
        <div className="main-component-display">
          <Routes>
            <Route path="/ContractSummary" element={<ContractSummary />} />
            <Route path="/ContractDetail" element={<ContractDetail />} />
            <Route path="/ContractAmendment" element={<ContractAmendment />} />
            <Route path="/ContractNew" element={<ContractNew />} />
            <Route path="/Session" element={<Session />} />
            <Route path="/MemberDetail" element={<MemberDetail />} />
            <Route path="/SessionAuditTrail" element={<SessionAuditTrail />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/CollateralizedReport" element={<CollateralizedReport/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      <CustomizedSnackbars
        notification={notification}
        handleNotificationClose={handleNotificationClose}
      ></CustomizedSnackbars>
    </div>
  );
}

export default App;
