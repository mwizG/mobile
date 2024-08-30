// src/components/Admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/users/');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const toggleActiveStatus = async (userId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/admin/user/${userId}/toggle-active/`);
            setUsers(users.map(user => user.id === userId ? { ...user, is_active: !user.is_active } : user));
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => toggleActiveStatus(user.id)}>
                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;
