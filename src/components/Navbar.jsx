import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonLoader from "./ButtonLoader";
import "./Navbar.css";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMyBlogLoading, setIsMyBlogLoading] = useState(false);
  const [isAddBlogLoading, setIsAddBlogLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const defaultProfile = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
        const res = await axios.get("https://backend-blog-project-production-67cb.up.railway.app/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
    };
  
    fetchUserData();
  }, []);
  

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMyBlogClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to view your blogs");
      navigate("/login");
      return;
    }
    setIsMyBlogLoading(true);
    setTimeout(() => {
      navigate("/myblog");
      setMenuOpen(false);
      setIsMyBlogLoading(false);
    }, 800);
  };

  const handleAddBlogClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to add a blog");
      navigate("/login");
      return;
    }
    setIsAddBlogLoading(true);
    setTimeout(() => {
      navigate("/addyourblog");
      setMenuOpen(false);
      setIsAddBlogLoading(false);
    }, 800);
  };

  const handleProfileClick = () => {
    setIsProfileLoading(true);
    setTimeout(() => {
      navigate("/profile");
      setMenuOpen(false);
      setIsProfileLoading(false);
    }, 800);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <img src={logo} alt="Blog Logo" className="logo-img" />
        </Link>
      </div>

      <div className="navbar-center-desktop">
        <input 
          type="text" 
          placeholder="Search Blogs..." 
          className="search-bar" 
        />
      </div>

      <div 
        className={`hamburger ${menuOpen ? "open" : ""}`} 
        onClick={toggleMenu} 
        ref={hamburgerRef}
        aria-label="Menu"
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`} ref={menuRef}>
        <div className="navbar-center-mobile">
          <input 
            type="text" 
            placeholder="Search Blogs..." 
            className="search-bar" 
          />
        </div>
        
        {isAuthenticated && (
          <div className="links-button">
            <a 
              href="/addyourblog" 
              className="nav-link" 
              onClick={handleAddBlogClick} 
              disabled={isAddBlogLoading}
            >
              {isAddBlogLoading ? (
                <div className="nav-spinner-container">
                  <div className="spinner nav-spinner"></div>
                </div>
              ) : (
                "Add Blog"
              )}
            </a>
            <a 
              href="/myblog" 
              className="nav-link" 
              onClick={handleMyBlogClick} 
              disabled={isMyBlogLoading}
            >
              {isMyBlogLoading ? (
                <div className="nav-spinner-container">
                  <div className="spinner nav-spinner"></div>
                </div>
              ) : (
                "My Blog"
              )}
            </a>
          </div>
        )}

        {user ? (
          <>
            <div 
              className="profile-container" 
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              {isProfileLoading ? (
                <div className="profile-loader">
                  <div className="spinner profile-spinner"></div>
                </div>
              ) : (
                <img
                  src={user.profileImage || defaultProfile}
                  alt="Profile"
                  className="profile-img"
                />
              )}
            </div>
          </>
        ) : (
          <>
            <Link 
              to="/signup" 
              className="nav-btn auth-btn signup-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Sign Up"
            >
              Sign Up for Free!
            </Link>
            <Link 
              to="/login" 
              className="nav-btn auth-btn login-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

