import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import logo from "../assets/logo1.png";
import ButtonLoader from "./ButtonLoader";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const response = await axios.post("https://backend-blog-project-production-67cb.up.railway.app/api/signup", formData, {
        withCredentials: true, 
      });

      if (response.data.success) {
        setMessage({ text: "Signup successful! Redirecting...", type: "success" });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Signup failed!", type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src={logo} alt="Logo" className="signup-logo" />
        <h2 className="signup-title">Sign Up</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="signup-input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email (Only @gmail.com)"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (5-10 chars)"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
            required
          />

          <input
            type="text"
            name="profileImage"
            placeholder="Profile Image URL"
            value={formData.profileImage}
            onChange={handleChange}
            className="signup-input"
            required
          />

          <button type="submit" className="signup-button" disabled={loading}>
            <ButtonLoader text="Sign Up" loading={loading} />
          </button>

          {message.text && (
            <p className={`signup-message ${message.type === "success" ? "success" : "error"}`}>
              {message.text}
            </p>
          )}
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
