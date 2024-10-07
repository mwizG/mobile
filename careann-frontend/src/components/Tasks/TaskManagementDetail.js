import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper, Box, Alert } from '@mui/material';

function TaskManagementDetail() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [description, setDescription] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isCompleted, setIsCompleted] = useState(false); // Track completion status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTask(response.data);
                setDescription(response.data.description);
                setScheduledTime(response.data.scheduled_time);
                setIsCompleted(response.data.status === 'Completed'); // Set completion status based on the response
            } catch (error) {
                console.error('Error fetching task details:', error);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleUpdateTask = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                description: description,
                scheduled_time: scheduledTime,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Task updated:', response.data);
            setTask(response.data); // Update task state with new data
            navigate('/tasks');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleMarkComplete = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                status: 'Completed',
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Task marked as complete:', response.data);
            setTask(response.data); // Update task state with new data
            setIsCompleted(true); // Update the completion status
            // Optionally, navigate to tasks after marking complete
        } catch (error) {
            console.error('Error marking task as complete:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            await axios.delete(`http://127.0.0.1:8000/api/jobs/tasks/${taskId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Task deleted');
            navigate('/tasks'); 
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleBack = () => {
        navigate('/tasks');  
    };

    if (!task) {
        return <div>Loading task details...</div>;
    }

    return (
        <Container sx={{ marginTop: '20px', paddingBottom: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#4caf50' }}>
                Task Details
            </Typography>

            {isCompleted && (
                <Alert severity="success" sx={{ marginBottom: '20px' }}>
                    Task marked as completed!
                </Alert>
            )}

            <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h6">Description:</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isCompleted} // Disable editing if completed
                    />
                </Box>
                
                <Box sx={{ marginBottom: '20px' }}>
                    <Typography variant="h6">Scheduled Time:</Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        disabled={isCompleted} // Disable editing if completed
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: '#4caf50', color: 'white', flexGrow: 1, marginRight: '10px' }}
                        onClick={handleUpdateTask}
                        disabled={isCompleted} // Disable button if completed
                    >
                        Update Task
                    </Button>
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: '#4caf50', color: 'white', flexGrow: 1, marginRight: '10px' }}
                        onClick={handleMarkComplete}
                        disabled={isCompleted} // Disable button if already completed
                    >
                        Mark as Complete
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        sx={{ flexGrow: 1 }}
                        onClick={handleDeleteTask}
                    >
                        Delete Task
                    </Button>
                </Box>
                
                <Button 
                    variant="outlined" 
                    onClick={handleBack} 
                    sx={{ marginTop: '20px', color: '#4caf50' }}
                >
                    Back
                </Button>
            </Paper>
        </Container>
    );
}

export default TaskManagementDetail;
