import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function TaskManagementDetail() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [description, setDescription] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setTask(response.data);
                setDescription(response.data.description);
                setScheduledTime(response.data.scheduled_time);
            } catch (error) {
                console.error('Error fetching task details:', error);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleUpdateTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                description: description,
                scheduled_time: scheduledTime,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log('Task updated:', response.data);
            navigate('/tasks');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleMarkComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                status: 'Completed',
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log('Task marked as complete:', response.data);
            navigate('/tasks'); // Redirect back to task management after marking complete
        } catch (error) {
            console.error('Error marking task as complete:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log('Task deleted');
            navigate('/tasks'); // Redirect back to task management after deletion
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleBack = () => {
        navigate('/tasks');  // Back to the task management page
    };

    if (!task) {
        return <div>Loading task details...</div>;
    }

    return (
        <div className="task-detail-container">
            <h2>Task Details</h2>
            <div>
                <label>Description:</label>
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>
            <div>
                <label>Scheduled Time:</label>
                <input 
                    type="datetime-local" 
                    value={scheduledTime} 
                    onChange={(e) => setScheduledTime(e.target.value)} 
                />
            </div>
            <div>
                <button onClick={handleUpdateTask}>Update Task</button>
                <button onClick={handleMarkComplete}>Mark as Complete</button>
                <button onClick={handleDeleteTask}>Delete Task</button>
                <button onClick={handleBack}>Back</button> {/* Back button */}
            </div>
        </div>
    );
}

export default TaskManagementDetail;
