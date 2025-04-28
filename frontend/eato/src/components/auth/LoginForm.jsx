// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/auth.css";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setError(result.message);
      }
      // Navigation is handled in the AuthContext based on user role
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
          alt="Burger Visual"
          className="auth-image"
        />
      </div>

      <div className="auth-right">
        <h2 className="auth-title">Welcome back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
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
          <div className="auth-forgot-row">
            <a href="#" className="auth-forgot">
              Forgot password?
            </a>
          </div>
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-divider">or</p>

        <button className="auth-google-btn">
          <img
            src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png"
            alt="Google"
            className="auth-google-icon"
          />
          Sign in with Google
        </button>

        <p className="auth-register-text">
          New here?{" "}
          <span 
            className="auth-register-link" 
            onClick={() => navigate("/register")}
          >
            Create Account
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
    maxHeight: "90%",
    objectFit: "contain",
  },
  right: {
    flex: 1,
    backgroundColor: "#ECE7DA",
    padding: "60px 40px",
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
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "12px",
    marginTop: "-10px",
    marginBottom: "10px",
  },
  forgot: {
    color: "#888",
    textDecoration: "none",
  },
  submitBtn: {
    backgroundColor: "#FF4F00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
  },
  googleBtn: {
    marginTop: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px 20px",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "14px",
  },
  googleIcon: {
    width: "18px",
    height: "18px",
  },
  registerText: {
    marginTop: "24px",
    fontSize: "14px",
  },
  registerLink: {
    color: "#FF4F00",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default LoginForm;
