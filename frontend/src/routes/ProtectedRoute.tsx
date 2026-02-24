import { useAuthStore } from '@/stores/useAuthStore'
import { useShallow } from 'zustand/react/shallow';
import { Outlet } from 'react-router';
import {  useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = () => {
    
    const [starting,setStarting] = useState(true);
    const { accessToken, user, loading,refresh,fetchMe } = useAuthStore(useShallow(state => ({
    accessToken: state.accessToken,
    user: state.user,
        loading: state.loading,
        refresh: state.refresh,
        fetchMe: state.fetchMe
    })));
    const init = async() => {
        if (!accessToken) {
            await refresh();
        }
        if(accessToken && !user){
            await fetchMe();
        }
        setStarting(false);
    }
   useEffect(() => {
       const initialize = async () => {
           await init();
       };
         initialize();
   },[]);
    if (loading || starting) {
        return <div>Loading...</div>;
    }
   
    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }
  return (
   <Outlet />
  )
}

export default ProtectedRoute