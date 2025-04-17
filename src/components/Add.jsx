import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import ButtonLoader from "./ButtonLoader";
import PageTransition from "./PageTransition";
import axios from 'axios';
import './Add.css';

const AddBlog = ({ onBlogAdded }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login first to add a blog!");
        navigate('/login');
        return;
      }

      const res = await axios.post(
        "https://backend-blog-project-production-67cb.up.railway.app/api/blogs", 
        { title, description, image, category },
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
        alert("Blog posted successfully!");
        setTitle("");
        setDescription("");
        setImage("");
        setCategory("");
        if (onBlogAdded) onBlogAdded();
        navigate('/myblog');
     
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while posting the blog";
      setError(message);
      alert(message);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <PageTransition>
      <form onSubmit={handleSubmit} className="add-blog-form">
        <h2>Add Your Blog</h2>
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          disabled={isSubmitting}
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          disabled={isSubmitting}
        />
        <input 
          type="text" 
          placeholder="Image URL" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          required 
          disabled={isSubmitting}
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required
          disabled={isSubmitting}
          className="category-dropdown"
        >
          <option value="">Select Category</option>
          <option value="Business">Business</option>
          <option value="Study">Study</option>
          <option value="Technology">Technology</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Others">Others</option>
        </select>

        <div className="form-buttons">
          <button 
            className="add-blog-button" 
            type="submit"
            disabled={isSubmitting}
          >
            <ButtonLoader text="Post Blog" loading={isSubmitting} />
          </button>
          <button 
            className="cancel-button" 
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <ButtonLoader text="Cancel" loading={false} />
          </button>
        </div>
      </form>
    </PageTransition>
  );
};

export default AddBlog;
