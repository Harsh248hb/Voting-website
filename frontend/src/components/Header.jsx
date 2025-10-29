import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signout = () => {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-blue-600 text-white py-3 shadow mb-8">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">Voting App</Link>
        <nav className="flex items-center gap-6">
          {user && (
            <>
              <Link to="/" className="hover:underline">Vote</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hover:underline">Admin Panel</Link>
              )}
              <button 
                className="ml-4 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
                onClick={signout}
              >Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
              {/* <Link to="/candidate-signup" className="hover:underline">Candidate Signup</Link> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
