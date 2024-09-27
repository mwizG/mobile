// src/pages/ContentModeration.js
import React, { useEffect, useState } from 'react';
import { getModerationActions, updateModerationAction } from '../../services/AdminService';

function ContentModeration() {
    const [actions, setActions] = useState([]);

    useEffect(() => {
        const fetchModerationActions = async () => {
            try {
                const data = await getModerationActions();
                setActions(data);
            } catch (error) {
                console.error('Error fetching moderation actions:', error);
            }
        };

        fetchModerationActions();
    }, []);

    const handleUpdateAction = async (actionId, newStatus) => {
        try {
            await updateModerationAction(actionId, newStatus);
            setActions(actions.map(action => (action.id === actionId ? { ...action, status: newStatus } : action)));
        } catch (error) {
            console.error('Error updating moderation action:', error);
        }
    };

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
