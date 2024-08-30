// src/components/Admin/DisputeResolution.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisputeResolution() {
    const [disputes, setDisputes] = useState([]);

    useEffect(() => {
        async function fetchDisputes() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/disputes/');
                setDisputes(response.data);
            } catch (error) {
                console.error('Error fetching disputes:', error);
            }
        }
        fetchDisputes();
    }, []);

    const resolveDispute = async (disputeId, resolution) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/admin/dispute/${disputeId}/`, { resolution });
            setDisputes(disputes.filter(dispute => dispute.id !== disputeId));
        } catch (error) {
            console.error('Error resolving dispute:', error);
        }
    };

    return (
        <div>
            <h2>Dispute Resolution</h2>
            <table>
                <thead>
                    <tr>
                        <th>Dispute ID</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {disputes.map(dispute => (
                        <tr key={dispute.id}>
                            <td>{dispute.id}</td>
                            <td>{dispute.issue}</td>
                            <td>{dispute.status}</td>
                            <td>
                                <button onClick={() => resolveDispute(dispute.id, 'Resolved')}>Mark as Resolved</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DisputeResolution;
