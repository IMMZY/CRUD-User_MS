// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetch("http://localhost:5000/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())

//       .then((data) => {
//         if (data.error) alert(data.error);
//         else localStorage.setItem("loggedInUser", JSON.stringify(data.user));
//         navigate("/home"); // go to Home page on success
//       })
//       .catch((err) => console.error("Error logging in", err));
//   };

//   return (
//     <div className="container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="edit-btn">
//           Login
//         </button>
//       </form>
//       <p>
//         Don't have an account?{" "}
//         <span
//           style={{ color: "#3498db", cursor: "pointer" }}
//           onClick={() => navigate("/signup")}
//         >
//           Sign Up
//         </span>
//       </p>
//     </div>
//   );
// }

// export default Login;
//////////////////////////////////////////////////
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      console.error("Error logging in", err);
      setErrorMsg("Network error. Is the server running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h2 className="authTitle">Welcome back</h2>
          <p className="authSubtitle">Log in to manage your users</p>
        </div>

        {errorMsg && <div className="authError">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="authForm">
          <label className="authLabel">
            Email
            <input
              className="authInput"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label className="authLabel">
            Password
            <input
              className="authInput"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </label>

          <button className="authBtnPrimary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="authFooter">
          <p className="authMuted">
            Don&apos;t have an account?{" "}
            <span className="authLink" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>

          {/* <p className="authMuted">
            <span className="authLink" onClick={() => navigate("/")}>
              ← Back to landing
            </span>
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
