
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("https://backend-blog-project-production-67cb.up.railway.app/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
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

  const handleLogout = async () => {
    try {
      await axios.post("https://backend-blog-project-production-67cb.up.railway.app/api/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      setUser(null);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
        <div className="links-button">
        <Link to="/addyourblog" className="nav-link">Add Blog</Link>
        <Link to="/myblog" className="nav-link">My Blog</Link>
        </div>

        {user ? (
          <>
            
            <div 
              className="profile-container" 
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              aria-label="Profile"
            >
              <img
                src={user.profileImage || defaultProfile}
                alt="Profile"
                className="profile-img"
              />
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

