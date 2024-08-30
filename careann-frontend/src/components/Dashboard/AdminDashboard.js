// src/pages/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="admin-options">
                <Link to="/admin/users"><button>User Management</button></Link>
                <Link to="/admin/content-moderation"><button>Content Moderation</button></Link>
                <Link to="/admin/payments"><button>Payment Management</button></Link>
                <Link to="/admin/disputes"><button>Dispute Resolution</button></Link>
                <Link to="/admin/analytics"><button>Analytics & Reporting</button></Link>
                <Link to="/admin/support-tickets"><button>Support Tickets</button></Link>
            </div>
        </div>
    );
}

export default AdminDashboard;
