import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TaskManagement() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/tasks/', {
                    headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to load tasks. Please try again.');
            }
        };

        fetchTasks();
    }, []);

    const viewTaskDetails = (taskId) => {
        navigate(`/tasks/${taskId}`);  // Navigate to task details page
    };

    const handleCreateTask = () => {
        navigate('/tasks/create');  // Navigate to task creation page
    };

    return (
        <div className="task-management-container">
            <h2>Task Management</h2>

            {/* Show error message if any */}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {/* Button to navigate to the task creation page */}
            <button onClick={handleCreateTask}>Create New Task</button>

            {tasks.length === 0 && !error ? (
                <p>No tasks found.</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            <p><strong>Task:</strong> {task.description}</p>
                            <p><strong>Scheduled Time:</strong> {new Date(task.scheduled_time).toLocaleString()}</p>
                            <p><strong>Status:</strong> {task.status}</p> {/* Display task status */}
                            <button onClick={() => viewTaskDetails(task.id)}>View Details</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskManagement;
