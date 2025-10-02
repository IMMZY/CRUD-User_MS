import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchUsers = () => {
    fetch("http://localhost:5000/users") // full URL
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setUsers(users.filter((u) => u.id !== id)))
      .catch((err) => console.error(err));
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
    });
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
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null);
        setForm({ name: "", email: "", phone: "", password: "" });
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div>
      <h1>Home Page — Users</h1>
      <button onClick={() => navigate("/add")}>Add User</button>
      <button onClick={handleLogout}>Logout</button>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table border="1" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {editingUser === user.id ? (
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  ) : (
                    user.phone
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={() => setEditingUser(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)}>Edit</button>
                      <button onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;
