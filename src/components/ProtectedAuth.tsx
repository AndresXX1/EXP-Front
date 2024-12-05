import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedAuth: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { loading, authenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!authenticated && !loading) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedAuth;
