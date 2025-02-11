import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// for admin routes only
export const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if(user && user.role==='admin'){
    return children;
  }
  return <Navigate to="/login" />;
}

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if(user.role==='admin'){
    return <Navigate to="/admin" />;
  }
  // If user has no team and we're not showing the modal yet
  if (!user.team && window.location.pathname !== '/teamSelection') {
   return <Navigate to="/teamSelection" />;
   }
   // if user is in team and we are not showing team details yet
   if(user.team && window.location.pathname === '/teamSelection') {
       return <Navigate to="/teamDetails" />;
   }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if(user){
    if(user.role==='admin'){
      return <Navigate to="/admin" />;
    }else {
      return <Navigate to="/teamDetails" />;
    }
  }
 
  return children;
}; 