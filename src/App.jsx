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
import Categories from "../components/Categories/Categories";
import Subscriber from "../components/subscriber/Subscriber";
import Settings from "../components/Setting/Setting";
import MediaLibrary from "../components/media/MediaLibrary";

// ==========================================
// 1. Protected Route Wrapper Component
// ==========================================
const ProtectedRoute = () => {
  let isAuthenticated = true;

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
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/media-library" element={<MediaLibrary />} />
          <Route path="/subscriber" element={<Subscriber />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
