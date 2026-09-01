import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

const AppLayout = () => {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#6c4f91] selection:text-white flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
