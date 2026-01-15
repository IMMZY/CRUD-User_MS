// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function SignUp() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetch("http://localhost:5000/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.error) alert(data.error);
//         else
//           localStorage.setItem(
//             "loggedInUser",
//             JSON.stringify({ id: data.userId, ...form })
//           );
//         navigate("/");
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="container">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="email"
//           placeholder="Email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="phone"
//           placeholder="Phone"
//           value={form.phone}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           placeholder="Password"
//           type="password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="add-btn">
//           Sign Up
//         </button>
//       </form>
//       <p>
//         Already have an account?{" "}
//         <span
//           style={{ color: "#3498db", cursor: "pointer" }}
//           onClick={() => navigate("/login")}
//         >
//           Login
//         </span>
//       </p>
//     </div>
//   );
// }

// export default SignUp;
//////////////////////////////////////////
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Sign up failed. Please try again.");
        return;
      }

      // Save user (use backend user object if available)
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user ?? { id: data.userId, ...form })
      );

      navigate("/home");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Is the server running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h2 className="authTitle">Create your account</h2>
          <p className="authSubtitle">Sign up to start managing users</p>
        </div>

        {errorMsg && <div className="authError">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="authForm">
          <label className="authLabel">
            Name
            <input
              className="authInput"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>

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
            Phone
            <input
              className="authInput"
              name="phone"
              placeholder="e.g., 555-1234"
              value={form.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </label>

          <label className="authLabel">
            Password
            <input
              className="authInput"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </label>

          <button className="authBtnPrimary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="authFooter">
          <p className="authMuted">
            Already have an account?{" "}
            <span className="authLink" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
