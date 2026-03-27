import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import Home from "./page/Home/Home";
import Messages from "../components/Message/MassageSection";

import LoginPage from "../components/Auth/LoginPage";
import Layout from "../components/Layout/Layout";

// ==========================================
// 1. Protected Route Wrapper Component
// ==========================================
const ProtectedRoute = () => {
  let isAuthenticated = false;

  if (localStorage.getItem("token")) {
    isAuthenticated = true;
  } else {
    isAuthenticated = false;
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
