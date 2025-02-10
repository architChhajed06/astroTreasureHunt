import React from "react";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "../components/space-background";
import Levels from "./LevelPage";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <SpaceBackground />
      </div>
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6"
          >
            Logout
          </Button>
        </div>
        {/* show all levels */}
        <Levels />
      </div>
    </div>
  );
};
export default AdminPage;
