import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Paper, Container, Grid, Card, CardContent } from '@mui/material';

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
                        Authorization: `Bearer ${token}`,
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
        navigate(`/tasks/${taskId}`); // Navigate to task details page
    };

    const handleCreateTask = () => {
        navigate('/tasks/create'); // Navigate to task creation page
    };
    
    const handleBack = () => {
        navigate('/caregiver/dashboard');  // Back to the task management page/caregiver/dashboard
    };

    return (
        <Container sx={{ marginTop: '20px', paddingBottom: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#4caf50' }}>
                Task Management
            </Typography>

            {/* Show error message if any */}
            {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}

            {/* Button to navigate to the task creation page */}
            <Button 
                variant="contained" 
                onClick={handleCreateTask} 
                sx={{ backgroundColor: '#4caf50', color: 'white', marginBottom: '20px' }}
            >
                Create New Task
            </Button>

            {tasks.length === 0 && !error ? (
                <Typography variant="body1" align="center">No tasks found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map(task => (
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{task.description}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Scheduled Time:</strong> {new Date(task.scheduled_time).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Status:</strong> {task.status}
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => viewTaskDetails(task.id)} 
                                        sx={{ backgroundColor: '#80d0ff', color: 'white', marginTop: '10px' }}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Button 
                variant="outlined" 
                onClick={handleBack} 
                sx={{ marginTop: '20px', color: '#4caf50' }}
            >
                Back
            </Button>
        </Container>
    );
}

export default TaskManagement;
