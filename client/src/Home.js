// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const fetchUsers = () => {
//     fetch("http://localhost:5000/users") // full URL
//       .then((res) => res.json())
//       .then((data) => setUsers(Array.isArray(data) ? data : []))
//       .catch((err) => console.error(err));
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleDelete = (id) => {
//     fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
//       .then((res) => res.json())
//       .then(() => setUsers(users.filter((u) => u.id !== id)))
//       .catch((err) => console.error(err));
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user.id);
//     setForm({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       password: "",
//     });
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     fetch(`http://localhost:5000/users/${editingUser}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())
//       .then((updatedUser) => {
//         setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
//         setEditingUser(null);
//         setForm({ name: "", email: "", phone: "", password: "" });
//       })
//       .catch((err) => console.error(err));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("loggedInUser");
//     navigate("/login");
//   };

//   return (
//     <div>
//       <h1>Home Page — Users</h1>
//       <button onClick={() => navigate("/add")}>Add User</button>
//       <button onClick={handleLogout}>Logout</button>
//       {users.length === 0 ? (
//         <p>No users found</p>
//       ) : (
//         <table border="1" style={{ marginTop: "20px", width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>
//                   {editingUser === user.id ? (
//                     <input
//                       value={form.name}
//                       onChange={(e) =>
//                         setForm({ ...form, name: e.target.value })
//                       }
//                     />
//                   ) : (
//                     user.name
//                   )}
//                 </td>
//                 <td>
//                   {editingUser === user.id ? (
//                     <input
//                       value={form.email}
//                       onChange={(e) =>
//                         setForm({ ...form, email: e.target.value })
//                       }
//                     />
//                   ) : (
//                     user.email
//                   )}
//                 </td>
//                 <td>
//                   {editingUser === user.id ? (
//                     <input
//                       value={form.phone}
//                       onChange={(e) =>
//                         setForm({ ...form, phone: e.target.value })
//                       }
//                     />
//                   ) : (
//                     user.phone
//                   )}
//                 </td>
//                 <td>
//                   {editingUser === user.id ? (
//                     <>
//                       <button onClick={handleUpdate}>Save</button>
//                       <button onClick={() => setEditingUser(null)}>
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={() => handleEdit(user)}>Edit</button>
//                       <button onClick={() => handleDelete(user.id)}>
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default Home;

//////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user?")) return;

    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setUsers((prev) => prev.filter((u) => u.id !== id)))
      .catch((err) => console.error(err));
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/users/${editingUser}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        cancelEdit();
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="page">
      {/* Top bar */}
      <header className="topbar">
        <div>
          <h1 className="title">Users</h1>
          <p className="subtitle">Manage users in your system</p>
        </div>

        <div className="topbarActions">
          <button className="btn btnPrimary" onClick={() => navigate("/add")}>
            + Add User
          </button>
          <button className="btn btnGhost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Card */}
      <section className="card">
        <div className="cardHeader">
          <div className="searchWrap">
            <input
              className="input"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="pill">{filteredUsers.length} users</span>
          </div>

          <button className="btn btnGhost" onClick={fetchUsers}>
            Refresh
          </button>
        </div>

        {users.length === 0 ? (
          <div className="empty">
            <p className="emptyTitle">No users found</p>
            <p className="emptyText">Create your first user to get started.</p>
            <button className="btn btnPrimary" onClick={() => navigate("/add")}>
              Add User
            </button>
          </div>
        ) : (
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>Name</th>
                  <th style={{ width: "35%" }}>Email</th>
                  <th style={{ width: "20%" }}>Phone</th>
                  <th style={{ width: "14%" }} className="actionsCell">
                    Actions
                  </th>
                  {/* <th style={{ width: "4%" }}>Actions</th> */}
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const isEditing = editingUser === user.id;

                  return (
                    <tr key={user.id}>
                      <td>
                        {isEditing ? (
                          <input
                            className="input inputSmall"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                          />
                        ) : (
                          <span className="cellMain">{user.name}</span>
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            className="input inputSmall"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                          />
                        ) : (
                          <span className="cellSub">{user.email}</span>
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            className="input inputSmall"
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                          />
                        ) : (
                          <span className="cellMain">{user.phone}</span>
                        )}
                      </td>

                      <td className="right">
                        {isEditing ? (
                          <form
                            onSubmit={handleUpdate}
                            className="actionsInline"
                          >
                            <button className="btn btnPrimary" type="submit">
                              Save
                            </button>
                            <button
                              className="btn btnGhost"
                              type="button"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <div className="actionsInline">
                            <button
                              className="btn btnGhost"
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btnDanger"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="emptyRow">No results for “{search}”</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
