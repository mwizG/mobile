import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            const token = localStorage.getItem('token');
            console.log('Token:', token); 
            if (!token) {
                console.error('No authentication token found.');
                setError('No authentication token found.');
                setLoading(false);
                return; 
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin_panel/users/', {
                    headers: {
                        Authorization: `Token ${token.trim().replace(/"/g, '')}`, // Use "Token" prefix
                    },
                });
                console.log(response.data); // Log the response
                setUsers(response.data); // Set users based on API response
            } catch (error) {
                console.error('Error fetching users:', error.response ? error.response.data : error.message);
                setError('Error fetching users');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const toggleActiveStatus = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found for toggling status.');
            setError('No authentication token found for toggling status.');
            return;
        }

        try {
            await axios.patch(`http://127.0.0.1:8000/api/admin_panel/user/${userId}/toggle-active/`, null, {
                headers: {
                    Authorization: `Token ${token}`, // Use "Token" prefix
                },
            });
            setUsers(users.map(user => user.id === userId ? { ...user, is_active: !user.is_active } : user));
        } catch (error) {
            console.error('Error toggling user status:', error.response ? error.response.data : error.message);
            setError('Error toggling user status');
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
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
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map(user => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No users available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserManagement;
