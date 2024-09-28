// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../services/AdminService';
function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="admin-options">
                <Link to="/admin/users"><button>User Management</button></Link>
                <Link to="/admin/user-activity"><button>User Activity</button></Link>
                <Link to="/admin/content-moderation"><button>Content Moderation</button></Link>
                <Link to="/admin/payments"><button>Payment Management</button></Link>
                <Link to="/admin/disputes"><button>Dispute Resolution</button></Link>
                <Link to="/admin/analytics"><button>Analytics & Reporting</button></Link>
                <Link to="/admin/support-tickets"><button>Support Tickets</button></Link>
            </div>
            <div>
                <h3>Users List</h3>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.username} - {user.status}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
