import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import ButtonLoader from "./ButtonLoader";
import PageTransition from "./PageTransition";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    qualification: ""
  });

  // Basic country list
  const countryList = [
    { name: "Pakistan" },
    { name: "India" },
    { name: "United States" },
    { name: "United Kingdom" },
    { name: "Canada" },
    { name: "Australia" }
  ];

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await axios.get("https://backend-blog-project-production-67cb.up.railway.app/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
      }
    });
      setUser(response.data);
      
      // Check if this is first time (profile not complete)
      if (!response.data.firstName || !response.data.lastName) {
        setIsFirstTime(true);
        setIsModalOpen(true); // Auto-open modal for first-timers
      }

      if (response.data) {
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          age: response.data.age || "",
          gender: response.data.gender || "",
          phone: response.data.phone || "",
          country: response.data.country || "",
          city: response.data.city || "",
          address: response.data.address || "",
          qualification: response.data.qualification || ""
        });
      }
    } catch (error) {
      setError("Failed to load profile data. Please try again later.");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchUserData(); 
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "https://backend-blog-project-production-67cb.up.railway.app/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );
      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setError("Logout failed. Please try again.");
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // All fields are required for first-time profile creation
    if (isFirstTime) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.age) newErrors.age = "Age is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.qualification) newErrors.qualification = "Qualification is required";
      if (!formData.address) newErrors.address = "Address is required";
    } else {
      // Only basic fields required for updates
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsUpdating(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.put("https://backend-blog-project-production-67cb.up.railway.app/api/user/update", formData,  {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
      setUser(response.data.user);
      setIsFirstTime(false); // No longer first time after successful submit
      setIsUpdating(false);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
      console.error("Update failed:", error);
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <Loader size="large" color="primary" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="profile-page">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}
        
        <div className="profile-card">
          <div className="profile-header-section">
            <img 
              src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt="Profile" 
              className="profile-avatar"
            />
            <h2 className="profile-username">{user?.username || "Guest"}</h2>
            <p className="profile-email-text">{user?.email}</p>
          </div>

          <div className="profile-info-section">
            {user?.firstName && (
              <div className="profile-info-item">
                <span className="info-label">Name:</span>
                <p className="info-value">{user.firstName} {user.lastName}</p>
              </div>
            )}
            
            {user?.age && (
              <div className="profile-info-item">
                <span className="info-label">Age:</span>
                <p className="info-value">{user.age}</p>
              </div>
            )}

            {user?.country && (
              <div className="profile-info-item">
                <span className="info-label">Location:</span>
                <p className="info-value">{user.city && `${user.city}, `}{user.country}</p>
              </div>
            )}

            {user?.qualification && (
              <div className="profile-info-item">
                <span className="info-label">Qualification:</span>
                <p className="info-value">{user.qualification}</p>
              </div>
            )}
          </div>

          <div className="profile-action-buttons">
            <button 
              className="button-primary"
              onClick={() => setIsModalOpen(true)}
              disabled={isLoggingOut}
            >
              <ButtonLoader 
                text={isFirstTime ? "Complete Profile" : "Edit Profile"} 
                loading={false} 
              />
            </button>
            <button 
              className="button-secondary" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <ButtonLoader text="Logout" loading={isLoggingOut} />
            </button>
            <button 
              className="button-ghost" 
              onClick={() => navigate("/")}
              disabled={isLoggingOut}
            >
              <ButtonLoader text="Go Back" loading={false} />
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="profile-modal-overlay">
            <div className="profile-edit-modal">
              <div className="modal-title-section">
                <h3 className="modal-title">
                  {isFirstTime ? "Complete Your Profile " : "Update Your Profile"}
                </h3>
                {!isFirstTime && (
                  <button 
                    className="modal-close-button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isUpdating}
                  >
                    &times;
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="form-fields-grid">
                  <div className="form-field-group">
                    <label className="form-label">First Name{isFirstTime ? '*' : ''}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Hassan"
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Last Name{isFirstTime ? '*' : ''}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Khan"
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Age{isFirstTime ? '*' : ''}</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="e.g. 25"
                      min="1"
                      max="120"
                      className={`form-input ${errors.age ? 'error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.age && <span className="error-text">{errors.age}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Gender{isFirstTime ? '*' : ''}</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`form-select ${errors.gender ? 'error' : ''}`}
                      disabled={isUpdating}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Phone Number{isFirstTime ? '*' : ''}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 03001234567"
                      pattern="[0-9]{10,15}"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Country{isFirstTime ? '*' : ''}</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`form-select ${errors.country ? 'error' : ''}`}
                      disabled={isUpdating}
                    >
                      <option value="">Select Country</option>
                      {countryList.map((country, index) => (
                        <option key={index} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && <span className="error-text">{errors.country}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">City{isFirstTime ? '*' : ''}</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Karachi"
                      className={`form-input ${errors.city ? 'error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Qualification{isFirstTime ? '*' : ''}</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g. BSCS"
                      className={`form-input ${errors.qualification ? 'error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.qualification && <span className="error-text">{errors.qualification}</span>}
                  </div>

                  <div className="form-field-group full-width">
                    <label className="form-label">Address{isFirstTime ? '*' : ''}</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Full address..."
                      rows="3"
                      className={`form-textarea ${errors.address ? 'error' : ''}`}
                      disabled={isUpdating}
                    ></textarea>
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                </div>

                <div className="form-submit-section">
                  <button 
                    type="submit" 
                    className="button-primary form-submit-button"
                    disabled={isUpdating}
                  >
                    <ButtonLoader text="Save Changes" loading={isUpdating} />
                  </button>
                  {!isFirstTime && (
                    <button 
                      type="button" 
                      className="button-secondary form-cancel-button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isUpdating}
                    >
                      <ButtonLoader text="Cancel" loading={isUpdating} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Profile;