import React from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    return (
        <nav className="navbar">
            <h1>Powerlifting Application</h1>
            <ul>
                <li><CustomLink to="/">Home</CustomLink></li>
                <li><CustomLink to="/calculate">One Rep Max</CustomLink></li>
                <li><CustomLink to="/plan">Create Plan</CustomLink></li>
                <li><CustomLink to="/track">Track Progress</CustomLink></li>
                <li><CustomLink to="/compare">Compare Strength</CustomLink></li>
                {isAuthenticated ? (
                    <li><button onClick={logout}>Logout</button></li>
                ) : (
                    <li><CustomLink to="/login">Login</CustomLink></li>
                )}
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  
    return (
        <Link 
            to={to} 
            {...props}
            className={isActive ? "active" : ""}
        >
            {children}
        </Link>
    );
}