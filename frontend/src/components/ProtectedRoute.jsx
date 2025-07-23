// frontend/src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Check for token and user in localStorage
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');

      console.log('🔐 Checking authentication...');
      console.log('Token exists:', !!token);
      console.log('User exists:', !!userStr);

      if (!token || !userStr) {
        console.log('❌ No authentication found');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Parse user data
      let user;
      try {
        user = JSON.parse(userStr);
        console.log('👤 User data:', user);
      }