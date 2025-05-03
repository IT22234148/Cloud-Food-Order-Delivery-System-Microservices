import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [msg, setMsg] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name validation
    if (!/^[A-Za-z ]{3,}$/.test(form.name)) {
      setMsg("Name must be at least 3 characters long and contain only letters and spaces.");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMsg("Please enter a valid email address.");
      return;
    }

    // Password strength validation
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) {
      setMsg("Password must be at least 6 characters and include both letters and numbers.");
      return;
    }

    // Confirm password match
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }

    // Terms and conditions
    if (!form.agreed) {
      setMsg("You must agree to the terms and conditions.");
      return;
    }

    try {
      await API.post("/register", {
        username: form.name,
        email: form.email,
        password: form.password,
      });
      setMsg("Registration successful!");
      // Optional: navigate to login
      // navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <div style={{ ...styles.container, flexDirection: isMobile ? "column" : "row" }}>
      {/* Left Panel */}
      <div style={{ ...styles.left, height: isMobile ? "40vh" : "100vh" }}>
        <img
          src="/logimg.jpg"
          alt="Burger Visual"
          style={isMobile ? styles.burgerImgMobile : styles.burgerImg}
        />
      </div>

      {/* Right Panel */}
      <div style={{ ...styles.right, padding: isMobile ? "30px 20px" : "60px 40px" }}>
        <h2 style={styles.title}>Create account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <div style={styles.checkboxWrapper}>
            <input
              type="checkbox"
              name="agreed"
              checked={form.agreed}
              onChange={handleChange}
              style={styles.checkbox}
              id="agree"
            />
            <label htmlFor="agree">I agree terms & conditions</label>
          </div>
          <button type="submit" style={styles.submitBtn}>Sign up</button>
        </form>
        <p style={styles.loginText}>
          Already have an account? <a href="/" style={styles.loginLink}>Sign in Here</a>
        </p>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  left: {
    flex: 1,
    backgroundColor: "#FF4F00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  burgerImg: {
    width: "98%",
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
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    width: "100%",
  },
  input: {
    width: "280px",
    padding: "10px 12px",
    fontSize: "14px",
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
    width: "280px",
    backgroundColor: "#FF4F00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px",
    fontSize: "14px",
    cursor: "pointer",
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
