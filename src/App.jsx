import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AddYourPage from "./pages/AddYourBlogPage";
import MyBlogPage from "./pages/MyBlogPage";

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/addyourblog" element={<AddYourPage />} />
        <Route path="/myblog" element={<MyBlogPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
