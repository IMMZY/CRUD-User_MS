// // import React from "react";
// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   Link,
// //   Navigate,
// // } from "react-router-dom";
// // import Home from "./Home";
// // import AddUser from "./AddUser";
// // import Login from "./Login";
// // import SignUp from "./SignUp";
// // import ProtectedRoute from "./ProtectedRoute";

// // function App() {
// //   return (
// //     <Router>
// //       <nav style={{ marginBottom: "20px" }}>
// //         <Link to="/home">Home</Link> | <Link to="/add">Add User</Link>
// //       </nav>

// //       <Routes>
// //         <Route path="/" element={<Navigate to="/login" />} />
// //         <Route
// //           path="/home"
// //           element={
// //             <ProtectedRoute>
// //               <Home />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route
// //           path="/add"
// //           element={
// //             <ProtectedRoute>
// //               <AddUser />
// //             </ProtectedRoute>
// //           }
// //         />
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/signup" element={<SignUp />} />

// //         <Route path="*" element={<Navigate to="/login" />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;
// //////////////////////////////
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   Navigate,
//   useLocation,
// } from "react-router-dom";

// import Home from "./Home";
// import AddUser from "./AddUser";
// import Login from "./Login";
// import SignUp from "./SignUp";
// import ProtectedRoute from "./ProtectedRoute";

// function AppLayout() {
//   const location = useLocation();

//   // Hide navbar on these pages
//   const hideNav = ["/login", "/signup", "/"].includes(location.pathname);

//   return (
//     <>
//       {!hideNav && (
//         <nav style={{ marginBottom: "20px" }}>
//           <Link to="/home">Home</Link> | <Link to="/add">Add User</Link>
//         </nav>
//       )}

//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />

//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/add"
//           element={
//             <ProtectedRoute>
//               <AddUser />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />

//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppLayout />
//     </Router>
//   );
// }

// export default App;
////////////////////////////////////////
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import Home from "./Home";
// import AddUser from "./AddUser";
// import Login from "./Login";
// import SignUp from "./SignUp";
// import ProtectedRoute from "./ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />

//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/add"
//           element={
//             <ProtectedRoute>
//               <AddUser />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />

//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
//////////////////////////////////////
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Home";
import AddUser from "./AddUser";
import Login from "./Login";
import SignUp from "./SignUp";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
