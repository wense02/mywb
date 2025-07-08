// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import components
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Gallery from '../pages/Gallery';
import GalleryView from '../pages/GalleryView';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Placeholder components for other routes
const Store = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Store (Coming Soon)</h1>
    <p>Online store functionality will be available soon!</p>
  </div>
);

const Settings = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Settings</h1>
    <p>User settings and preferences.</p>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes - Only accessible when NOT logged in */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected Routes - Only accessible when logged in */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gallery" 
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gallery/:id" 
        element={
          <ProtectedRoute>
            <GalleryView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/store" 
        element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />

      {/* Redirect logged-in users from root to dashboard */}
      <Route 
        path="*" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;