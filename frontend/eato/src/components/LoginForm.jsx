import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login form:", form); // Debugging log
    try {
      const res = await API.post("/login", form);
      console.log("Login response:", res.data); // Debugging log
      localStorage.setItem("token", res.data.token);
      setMsg("Login successful!");
      navigate("/dashboard"); // Navigate to Dashboard after login
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message); // Debugging log
      setMsg(err.response?.data?.msg || "Login failed.");
    }
  };
  const navigate = useNavigate(); // 👈 Initialize navigation
  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.left}>
        <img
          src="/burgart.png"
          alt="Burger Visual"
          style={styles.burgerImg}
        />
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <h2 style={styles.title}>Welcome back</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
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
          <div style={styles.forgotRow}>
            <a href="#" style={styles.forgot}>
              Forgot password?
            </a>
          </div>
          <button type="submit" style={styles.submitBtn}>
            Sign in
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>or</p>

        <button style={styles.googleBtn}>
          <img
            src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png"
            alt="Google"
            style={styles.googleIcon}
          />
          Sign in with Google
        </button>

        <p style={styles.registerText}>
          New here?{" "}
          <a href="/register" style={styles.registerLink} onClick={()=> navigate("/RegisterPage")}>
            Create Account
          </a>
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
