import { Outlet } from "react-router-dom";

const DashBoard = () => {
  return (
    <div className="flex h-full">
      <Outlet />
    </div>
  );
};

export default DashBoard;
