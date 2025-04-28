// src/components/auth/RegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/auth.css";

function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" // Default role
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = form;
      const result = await register(registrationData);
      
      if (result.success) {
        setSuccess("Registration successful! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img
          src="/assets/images/burgart.png"
          alt="Food Delivery Visual"
          className="auth-image"
        />
      </div>

      <div className="auth-right">
        <h2 className="auth-title">Create Account</h2>
        {success && <p className="auth-success">{success}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="auth-input"
            required
          />
          
          <div className="auth-role-selection">
            <label className="auth-role-label">Register as:</label>
            <div className="auth-radio-group">
              <label className="auth-radio-label">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={form.role === "customer"}
                  onChange={handleChange}
                />
                Customer
              </label>
              <label className="auth-radio-label">
                <input
                  type="radio"
                  name="role"
                  value="restaurant"
                  checked={form.role === "restaurant"}
                  onChange={handleChange}
                />
                Restaurant Owner
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-login-text">
          Already have an account?{" "}
          <span 
            className="auth-login-link" 
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "sans-serif",
  },
  left: {
    flex: 1,
    backgroundColor: "#FF4F00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  burgerImg: {
    width: "80%",
    height: "auto",
    objectFit: "contain",
  },
  burgerImgMobile: {
    width: "60%",
    height: "auto",
    objectFit: "contain",
  },
  right: {
    flex: 1,
    backgroundColor: "#ECE7DA",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "30px",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "12px 14px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#F1EBE5",
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
  },
  submitBtn: {
    backgroundColor: "#FF4F00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  loginText: {
    marginTop: "24px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#FF4F00",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default RegisterForm;
