import { useContext, useEffect } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import Shimmer from "../../src/components/others/Shimmer";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  useEffect(() => {
    console.log("entered private useEffect", isAuthenticated);
  }, []);

  if (isLoading || (isAuthenticated && !user) ) {
    return <div className="text-center mt-10"><Shimmer/></div>;
  } else {
    return isAuthenticated ? children : <Navigate to="/login" />;
  }
};
