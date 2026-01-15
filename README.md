# CRUD Management System (React + Node/Express + MySQL)

A full-stack CRUD (Create, Read, Update, Delete) user management system built with **React** (frontend), **Node.js/Express** (backend), and **MySQL** (database).  
It includes **authentication (Login/Sign Up)**, **protected routes**, and a modern UI with **search, modals, toast notifications, pagination, and dark/light mode**.

---

## Features

### Core CRUD

- Create a new user
- View users list
- Update user details (Edit in **modal**)
- Delete user (Delete **confirmation modal**)

### Authentication

- Sign Up
- Login
- Logout
- Protected pages using `ProtectedRoute`
- Saves logged-in user in `localStorage`

### UI/UX Improvements

- Modern dashboard styling
- Search/filter by name, email, or phone
- Toast notifications for success/error
- Pagination + page size selector (10/20/50)
- Dark/Light mode toggle (saved in localStorage)
- Status badge (Active/Inactive) _(optional / frontend demo unless persisted in DB)_

---

## Tech Stack

**Frontend**

- React
- React Router DOM
- CSS (custom styling)

**Backend**

- Node.js
- Express.js

**Database**

- MySQL

---

## Requirements

Node.js (v16+ recommended)  
npm  
MySQL (Workbench or CLI)

---

## Database Setup (MySQL)

### 1. Create database

```sql
CREATE DATABASE crud_db;
USE crud_db;
```

### Frontend Setup (Client)

1. Open a terminal and go into the backend folder:

```bash
cd client
```

2. Install dependencies

```bash
npm install
```

3. Start the React App:

```bash
npm start
```

4. Frontend should run:

```bash
http://localhost:3000
```

### Backend Setup (Server)

1. Open a terminal and go into the backend folder:

```bash
cd server
```

2. Install dependencies

```bash
npm install
```

3. Start the React App:

```bash
npm start
```

4. Frontend should run:

```bash
http://localhost:5000
```

### If you use `nodemon`, you can add this script in `server/package.json`:

```bash
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Then run:

```bash
npm run dev
```
