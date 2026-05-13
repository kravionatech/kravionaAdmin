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
import PostPage from "../components/Post/PostPage";
import Services from "../components/Services/Services";
import Projects from "../components/Projects/Projects";
import Testimonials from "../components/Testimonials/Testimonials";
import Team from "../components/Team/Team";
import Analytics from "../components/Analytics/Analytics";
import Campaigns from "../components/Campaigns/Campaigns";
import AuditLogs from "../components/AuditLogs/AuditLogs";
import { DependencyError } from "../config/config";


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
          <Route path="/posts" element={<PostPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/team" element={<Team />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/missing"element={<DependencyError/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
