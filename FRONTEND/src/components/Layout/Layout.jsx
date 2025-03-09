import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import {useTokenMonitor} from "../../common/UseTokenMonitor"
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return null;
};

function Layout() {
  const location = useLocation();
  const token = useSelector((state) => state.auth.jwt);
  const role = useSelector((state) => state.auth.role);

  const isAdminPage = location.pathname === "/dashboard" && role === "ADMIN";
  
  useTokenMonitor(token);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />

      {!isAdminPage && (
        <div className="w-full block">
          <ToastContainer />
          <Header token={token}/>
        </div>
      )}

      <main className="flex-grow">
        <Outlet />
      </main>

      {!isAdminPage && (
        <div className="w-full block">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Layout;
