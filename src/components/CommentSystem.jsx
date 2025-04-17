import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import ButtonLoader from './ButtonLoader';
import './CommentSystem.css';

const CommentSystem = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://backend-blog-project-production-67cb.up.railway.app/api/comments/blog/${blogId}`);
      setComments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const response = await axios.post(
        `https://backend-blog-project-production-67cb.up.railway.app/api/comments/blog/${blogId}`
,
        { content: newComment, blogId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setComments([...comments, response.data.comment]);
      setNewComment('');
      setSubmitting(false);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;
    setEditing(true);

    try {
      const response = await axios.put(
        `https://backend-blog-project-production-67cb.up.railway.app/api/comments/${commentId}`,
        { content: editText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data.comment : comment
      ));
      setEditingCommentId(null);
      setEditText('');
      setEditing(false);
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment');
      setEditing(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeleting(commentId);
    try {
      await axios.delete(`https://backend-blog-project-production-67cb.up.railway.app/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      setDeleting(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
      setDeleting(null);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="comment-loading">
      <Loader size="medium" />
    </div>
  );
  
  if (error) return <div className="comment-error">{error}</div>;

  return (
    <div className="comment-system">
      <h3 className="comment-title">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
            disabled={submitting}
          />
          <div className="comment-buttons">
            <button 
              type="submit" 
              className="comment-submit-btn"
              disabled={submitting || !newComment.trim()}
            >
              <ButtonLoader text="Post Comment" loading={submitting} />
            </button>
            {newComment.trim() && (
              <button 
                type="button" 
                className="comment-cancel-btn"
                onClick={() => setNewComment('')}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="login-prompt">Please login to comment</p>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.user?.username || 'Unknown User'}</span>
              <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            
            {editingCommentId === comment._id ? (
              <div className="edit-comment">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="comment-input"
                  disabled={editing}
                />
                <div className="comment-buttons">
                  <button 
                    onClick={() => handleEdit(comment._id)}
                    className="comment-submit-btn"
                    disabled={editing || !editText.trim()}
                  >
                    <ButtonLoader text="Save" loading={editing} />
                  </button>
                  <button 
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditText('');
                    }}
                    className="comment-cancel-btn"
                    disabled={editing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="comment-content">
                <p>{comment.content}</p>
                {user && user._id === comment.user?._id && (
                  <div className="comment-actions">
                    <button 
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditText(comment.content);
                      }}
                      className="comment-edit-btn"
                      disabled={deleting === comment._id}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(comment._id)}
                      className="comment-delete-btn"
                      disabled={deleting === comment._id}
                    >
                      <ButtonLoader text="Delete" loading={deleting === comment._id} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSystem;
