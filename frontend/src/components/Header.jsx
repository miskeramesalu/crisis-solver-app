import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ backgroundColor: "#2c3e50", color: "white", padding: "1rem" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem" }}>
          Crisis Solver
        </Link>
        <div>
          {!user ? (
            <>
              <Link to="/register" style={{ color: "white", marginRight: "1rem" }}>Register</Link>
              <Link to="/login" style={{ color: "white" }}>Login</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: "1rem" }}>Welcome, {user.username}!</span>
              <Link to="/dashboard" style={{ color: "white", marginRight: "1rem" }}>Dashboard</Link>
              <button onClick={logout} style={{ background: "none", border: "1px solid white", color: "white", cursor: "pointer" }}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;