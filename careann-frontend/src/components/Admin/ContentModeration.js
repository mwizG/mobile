// src/components/Admin/ContentModeration.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContentModeration() {
    const [content, setContent] = useState([]);

    useEffect(() => {
        async function fetchContent() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/moderation/');
                setContent(response.data);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        }
        fetchContent();
    }, []);

    const moderateContent = async (contentId, action) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/admin/moderation/${contentId}/`, { action });
            setContent(content.filter(c => c.id !== contentId));
        } catch (error) {
            console.error('Error moderating content:', error);
        }
    };

    return (
        <div>
            <h2>Content Moderation</h2>
            <ul>
                {content.map(item => (
                    <li key={item.id}>
                        {item.type}: {item.content}
                        <button onClick={() => moderateContent(item.id, 'approve')}>Approve</button>
                        <button onClick={() => moderateContent(item.id, 'reject')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContentModeration;
