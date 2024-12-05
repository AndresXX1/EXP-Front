import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashBoard = () => {
  return (
    <div className="flex h-full">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default DashBoard;
