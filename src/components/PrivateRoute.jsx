import { AuthContext } from '@/context/authContext';
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
