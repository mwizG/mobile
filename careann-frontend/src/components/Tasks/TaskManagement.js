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
            {error && <Typography color="error">{error}</Typography>}
            
            <Button
                variant="contained"
                color="primary"
                sx={{ marginBottom: '20px', backgroundColor: '#4caf50' }}
                onClick={handleCreateTask}
            >
                Create New Task
            </Button>

            <Paper>
                <Grid container spacing={2} justifyContent="center">
                    {tasks
                        .filter(task => task.status.toLowerCase() !== 'deleted') // Filter out deleted tasks
                        .map((task) => (
                            <Grid item key={task.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {task.description}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Scheduled Time: {new Date(task.scheduled_time).toLocaleString()}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            End Time: {task.end_time ? new Date(task.end_time).toLocaleString() : 'N/A'}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Status: {task.status}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => viewTaskDetails(task.id)}
                                            sx={{ marginTop: '10px' }}
                                        >
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Paper>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
                sx={{ marginTop: '20px' }}
            >
                Back to Dashboard
            </Button>
        </Container>
    );
}

export default TaskManagement;
