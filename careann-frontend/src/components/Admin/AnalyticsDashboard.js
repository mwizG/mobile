import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAnalytics() {
            const token = localStorage.getItem('accessToken');  // Retrieve the token
            if (!token) {
                console.error('No authentication token found.');
                setError('No authentication token found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin_panel/analytics/', {
                    headers: {
                        Authorization: `Token ${token.replace(/"/g, '')}`, // Add authorization header
                    },
                });
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error.response ? error.response.data : error.message);
                setError('Could not load analytics data.'); // Set error message
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message
    }

    return (
        <div>
            <h2>Analytics Dashboard</h2>
            <ul>
                <li>Total Users: {analytics.total_users}</li>
                <li>Total Jobs: {analytics.total_jobs}</li>
                <li>Total Payments: {analytics.total_payments}</li>
                <li>Pending Payments: {analytics.pending_payments}</li>
            </ul>
        </div>
    );
}

export default AnalyticsDashboard;
