// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('jwt'); // Vérifiez le token dans localStorage

    if (!token) {
        return <Navigate to="/" />; // Redirige vers /login si pas de token
    }

    return children;
}

export default PrivateRoute;
