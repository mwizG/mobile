import React, { useEffect, useState } from 'react';
import { getModerationActions, updateModerationAction } from '../../services/AdminService';

function ContentModeration() {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModerationActions = async () => {
            const token = localStorage.getItem('token'); // Retrieve the token
            if (!token) {
                setError('No authentication token found.');
                setLoading(false);
                return;
            }

            try {
                const data = await getModerationActions(token); // Pass token to the service function
                setActions(data);
            } catch (error) {
                setError(error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchModerationActions();
    }, []);

    const handleUpdateAction = async (actionId, newStatus) => {
        const token = localStorage.getItem('token'); // Retrieve the token
        if (!token) {
            setError('No authentication token found for updating action.');
            return;
        }

        try {
            await updateModerationAction(actionId, newStatus, token); // Pass token to the service function
            setActions(actions.map(action => (action.id === actionId ? { ...action, status: newStatus } : action)));
        } catch (error) {
            setError(error.response ? error.response.data : error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    return (
        <div>
            <h2>Content Moderation</h2>
            <table>
                <thead>
                    <tr>
                        <th>Action ID</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {actions.map(action => (
                        <tr key={action.id}>
                            <td>{action.id}</td>
                            <td>{action.type}</td>
                            <td>{action.status}</td>
                            <td>
                                <button onClick={() => handleUpdateAction(action.id, 'approved')}>Approve</button>
                                <button onClick={() => handleUpdateAction(action.id, 'rejected')}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContentModeration;
