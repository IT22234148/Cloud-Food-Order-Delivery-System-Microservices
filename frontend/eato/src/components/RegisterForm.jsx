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
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
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
    } catch (err) {
      setMsg(err.response?.data?.msg || "Registration failed.");
    }
  };
  const navigate = useNavigate(); // 👈 Initialize navigation

  return (
    <div style={{ ...styles.container, flexDirection: isMobile ? "column" : "row" }}>
      {/* Left Panel */}
      <div style={{ ...styles.left, height: isMobile ? "40vh" : "100vh" }}>
        <img
          src="/foods2.png" // Make sure this image path is valid
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
