import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from '../context/AuthContext';  // Import useAuth

export default function NavBar() {
  const { user, logout } = useAuth();  // Get user and logout function from context

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white">
            Space Quest
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              // Show these when user is logged in
              <div className="flex items-center gap-4">
                <span className="text-white">
                  Welcome, {user.name || 'Commander'}
                </span>
                <Button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              // Show these when user is not logged in
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-purple-400">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}