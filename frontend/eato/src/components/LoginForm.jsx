import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.token);
      setMsg("✅ Login successful!");
      navigate("/home");
    } catch (err) {
      setMsg(err.response?.data?.msg || "❌ Login failed.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <img src="/logimg.jpg" alt="Burger" style={styles.burgerImg} />
      </div>

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

        <div style={styles.orDivider}>or</div>

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
          <a
            href="/register"
            style={styles.registerLink}
            onClick={() => navigate("/RegisterPage")}
          >
            Create Account
          </a>
        </p>

        {msg && <p style={styles.message}>{msg}</p>}
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
    maxHeight: "190%",
    objectFit: "contain",
  },
  right: {
    flex: 1,
    backgroundColor: "#ECE7DA",
    padding: "60px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "12px",
    width: "280px",
    marginTop: "-8px",
    marginBottom: "12px",
  },
  forgot: {
    color: "#555",
    textDecoration: "none",
    fontWeight: "500",
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
  orDivider: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#888",
  },
  googleBtn: {
    width: "280px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px 20px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "16px",
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
    marginLeft: "4px",
  },
  message: {
    marginTop: "20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#d9534f",
  },
};

export default LoginForm;
