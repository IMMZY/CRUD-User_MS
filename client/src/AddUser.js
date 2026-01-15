// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function AddUser() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     fetch("/users", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())
//       .then(() => {
//         setForm({ name: "", email: "", phone: "", password: "" });
//         navigate("/");
//       }) // go back to Home page
//       .catch((err) => console.error("Error adding user:", err));
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Add User</h2>
//       <input
//         type="text"
//         name="name"
//         placeholder="Enter name"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Enter email"
//         value={form.email}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="tel"
//         name="phone"
//         placeholder="Enter phone"
//         value={form.phone}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Enter password"
//         value={form.password}
//         onChange={handleChange}
//         required
//       />
//       <button type="submit">Add</button>
//     </form>
//   );
// }

// export default AddUser;
////////////////////////////////////////////////////////
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        setErrorMsg(data?.error || "Failed to add user. Try again.");
        return;
      }

      setSuccessMsg("User added successfully ✅");
      setForm({ name: "", email: "", phone: "", password: "" });

      // go back to users list
      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      console.error("Error adding user:", err);
      setErrorMsg("Network error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addPage">
      <div className="addCard">
        <div className="addHeader">
          <div>
            <h2 className="addTitle">Add User</h2>
            <p className="addSubtitle">Create a new user record</p>
          </div>

          <button className="btnGhost" onClick={() => navigate("/home")}>
            ← Back
          </button>
        </div>

        {errorMsg && <div className="msgError">{errorMsg}</div>}
        {successMsg && <div className="msgSuccess">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="addForm">
          <label className="label">
            Name
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="label">
            Email
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="label">
            Phone
            <input
              className="input"
              type="tel"
              name="phone"
              placeholder="Enter phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label className="label">
            Password
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="btnPrimary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "+ Add"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
