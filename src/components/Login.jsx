import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Login.css";
import logo from "../assets/logo1.png"; 
import ButtonLoader from "./ButtonLoader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const response = await axios.post(
        "https://backend-blog-project-production-67cb.up.railway.app/api/login",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        await login(response.data.token, response.data.user);
        
        setMessage({ text: "Login successful! Redirecting...", type: "success" });

        setTimeout(() => {
          navigate("/"); 
        }, 1000);
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Invalid credentials!", type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>

          <input  type="email"  name="email"  placeholder="Email (Only @gmail.com)"  value={formData.email}  onChange={handleChange}  className="login-input"  required/>

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="login-input" required/>

          <button type="submit" className="login-button" disabled={loading}>
            <ButtonLoader text="Login" loading={loading} />
          </button>

          {message.text && (
            <p className={`login-message ${message.type === "success" ? "success" : "error"}`}>
              {message.text}
            </p>
          )}
        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
