import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserActivity() {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        async function fetchUserActivities() {
            const token = localStorage.getItem('token'); // Retrieve the token
            if (!token) {
                console.error('No authentication token found.');
                setError('No authentication token found.');
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin_panel/user-activities/', {
                    headers: {
                        Authorization: `Token ${token.replace(/"/g, '')}`, // Add authorization header
                    },
                });
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching user activities:', error.response ? error.response.data : error.message);
                setError('Error fetching user activities'); // Set error message
            }
        }
        fetchUserActivities();
    }, []);

    return (
        <div>
            <h2>User Activity Log</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Activity</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.length > 0 ? ( // Check if there are activities to display
                        activities.map(activity => (
                            <tr key={activity.id}>
                                <td>{activity.username}</td>
                                <td>{activity.action}</td> {/* Changed from activity to action */}
                                <td>{new Date(activity.timestamp).toLocaleString()}</td> {/* Format timestamp */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No user activities found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserActivity;
