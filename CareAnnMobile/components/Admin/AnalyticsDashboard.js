// src/components/Admin/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/analytics/');
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        }
        fetchAnalytics();
    }, []);

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