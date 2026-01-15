import React, { useEffect, useState } from "react";
import AddUser from "./AddUser";

function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Fetch users
  const fetchUsers = () => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = (id) => {
    fetch(`/users/${id}`, { method: "DELETE" })
      .then(() => setUsers(users.filter((u) => u.id !== id)))
      .catch((err) => console.error("Error deleting user:", err));
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
    });
  };

  // Save edit
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`/users/${editingUser}`, {
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
      .catch((err) => console.error("Error updating user:", err));
  };

  return (
    <div>
      <h1>Users from MySQL</h1>
      <AddUser onUserAdded={(newUser) => setUsers([...users, newUser])} />

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {editingUser === user.id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                {user.name} — {user.email} — {user.phone}
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
