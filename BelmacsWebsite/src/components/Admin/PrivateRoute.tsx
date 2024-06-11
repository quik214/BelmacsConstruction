import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Handle error appropriately
  }

  return user ? <>{children}</> : <Navigate to="/admin/" />;
};

export default PrivateRoute;
