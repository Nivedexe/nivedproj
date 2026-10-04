import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowPendingVolunteer = false, allowUnapprovedTippler = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Unapproved volunteers must not access meetings, conventions, or forms until approved
    if (user.role === 'volunteer' && !user.isApproved && !allowPendingVolunteer) {
        return <Navigate to="/volunteer-dashboard" replace />;
    }

    // Unapproved tipplers must complete assessment first before viewing dashboard, meetings, or conventions
    if (user.role === 'tippler' && !user.isApproved && !allowUnapprovedTippler) {
        return <Navigate to="/assessments" replace />;
    }

    return children;
};

export default ProtectedRoute;
