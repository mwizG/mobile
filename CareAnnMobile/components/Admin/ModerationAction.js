// src/components/Admin/ModerationAction.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModerationAction() {
    const [moderationActions, setModerationActions] = useState([]);

    useEffect(() => {
        async function fetchModerationActions() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/moderation-actions/');
                setModerationActions(response.data);
            } catch (error) {
                console.error('Error fetching moderation actions:', error);
            }
        }
        fetchModerationActions();
    }, []);

    const handleModeration = async (actionId, decision) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/moderation-action/${actionId}/`, { decision });
            setModerationActions(moderationActions.filter(action => action.id !== actionId));
        } catch (error) {
            console.error('Error handling moderation action:', error);
        }
    };

    return (
        <div>
            <h2>Moderation Actions</h2>
            <ul>
                {moderationActions.map(action => (
                    <li key={action.id}>
                        {action.content_type}: {action.content}
                        <button onClick={() => handleModeration(action.id, 'approve')}>Approve</button>
                        <button onClick={() => handleModeration(action.id, 'reject')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ModerationAction;
