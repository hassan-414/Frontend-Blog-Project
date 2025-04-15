import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Add.css';

const AddBlog = ({ onBlogAdded }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login first to add a blog!");
        navigate('/login');
        return;
      }

      const res = await fetch("https://backend-blog-project-production-67cb.up.railway.app/api/blogs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, image, category }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Blog posted successfully!");
        setTitle("");
        setDescription("");
        setImage("");
        setCategory("");
        if (onBlogAdded) {
          onBlogAdded();
        }
        navigate('/myblog');
      } else {
        setError(data.message || "Failed to post blog");
        alert(data.message || "Failed to post blog");
      }
    } catch (err) {
      setError("An error occurred while posting the blog");
      alert("An error occurred while posting the blog");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="add-blog-form">
        <h2>Add Your Blog</h2>
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Image URL" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          required 
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Business">Business</option>
          <option value="Study">Study</option>
          <option value="Technology">Technology</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Others">Others</option>
        </select>

        <button className="add-blog-button" type="submit">Post Blog</button>
      </form>
    </>
  );
};

export default AddBlog;
