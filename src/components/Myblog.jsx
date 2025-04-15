import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Modal, Form, Input, message } from "antd";
import "./Myblog.css";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessageText("Please log in to view your blogs.");
          setLoading(false);
          return;
        }

        const res = await axios.get("https://backend-blog-project-production-67cb.up.railway.app/api/blogs/my-blogs", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data.blogs.length === 0) {
          setMessageText("You haven't written any blogs yet.");
        } else {
          setBlogs(res.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching user blogs:", error);
        setMessageText("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  // ✅ Delete Blog Function
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a blog.");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
      if (!confirmDelete) return;

      const res = await axios.delete(`https://backend-blog-project-production-67cb.up.railway.app/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.status === 200) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        message.success("Blog deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error(error.response?.data?.message || "Failed to delete blog.");
    }
  };

  // ✅ Show Edit Modal
  const showEditModal = (blog) => {
    setCurrentBlog(blog);
    form.setFieldsValue({
      title: blog.title,
      description: blog.description,
      category: blog.category,
      image: blog.image || "",
    });
    setEditModalVisible(true);
  };

  // ✅ Handle Edit Submit (DB Update + UI Update)
  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You must be logged in to edit a blog.");
        return;
      }

      const values = await form.validateFields(); // Validate form fields
      const res = await axios.put(
        `https://backend-blog-project-production-67cb.up.railway.app/api/blogs/${currentBlog._id}`,
        {
          title: values.title,
          description: values.description,
          category: values.category,
          image: values.image,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs(
        blogs.map((blog) =>
          blog._id === currentBlog._id
            ? { ...blog, title: values.title, description: values.description, category: values.category, image: values.image }
            : blog
        )
      );

      message.success("Blog updated successfully!");
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating blog:", error);
      message.error(error.response?.data?.message || "Failed to update blog.");
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getDisplayContent = (content, postId) => {
    const isExpanded = expandedPosts[postId];
    return isExpanded ? content : content.substring(0, 100) + "...";
  };

  return (
    <div className="my-blogs-container">
      <h2>My Blogs</h2>

      {loading ? (
        <p>Loading your blogs...</p>
      ) : messageText ? (
        <p>
          {messageText} <Link to="/addyourblog">Create one now!</Link>
        </p>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <h3 className="blog-title">{blog.title}</h3>
              <span className="blog-date">
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <div className="blog-image">
                <img src={blog.image || "default.jpg"} alt={blog.title} />
              </div>

              <p className="category">Category: {blog.category}</p>
              <p className="blog-content">
                {getDisplayContent(blog.description, blog._id)}
              </p>
              <button className="read-more-button" onClick={() => toggleReadMore(blog._id)}>
                {expandedPosts[blog._id] ? "Show Less" : "Read More"}
              </button>

              <div className="blog-divider"></div>
              <div className="blog-actions">
                <Button type="primary" onClick={() => showEditModal(blog)}>
                  Edit
                </Button>

                <Button  className="delete-btn" type="secondry" danger onClick={() => handleDelete(blog._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📝 Edit Blog Modal */}
      <Modal
        title="Edit Blog"
        open={editModalVisible}
        onOk={handleEdit}
        onCancel={() => setEditModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Blog Title" rules={[{ required: true, message: "Please enter title" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please enter category" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: "Please enter image URL" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyBlog;
