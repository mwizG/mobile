// src/components/Admin/UserActivity.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserActivity() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        async function fetchUserActivities() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/user-activity/');
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching user activities:', error);
            }
        }
        fetchUserActivities();
    }, []);

    return (
        <div>
            <h2>User Activity Log</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Activity</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity => (
                        <tr key={activity.id}>
                            <td>{activity.username}</td>
                            <td>{activity.activity}</td>
                            <td>{activity.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserActivity;
