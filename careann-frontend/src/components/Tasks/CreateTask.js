import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
    const [description, setDescription] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [jobId, setJobId] = useState('');  // Task must be tied to a job
    const [jobs, setJobs] = useState([]);  // List of accepted jobs for dropdown
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch accepted jobs when the component loads
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/caregiver-jobs/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJobs(response.data);  // Set the jobs for the dropdown
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError('Failed to load jobs. Please try again.');
            }
        };

        fetchJobs();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();  // Prevent page refresh

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/jobs/tasks/create/', {
                job: jobId,  // The selected job ID
                description: description,
                scheduled_time: scheduledTime,
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            console.log('Task created successfully:', response.data);
            navigate('/tasks');  // Redirect to task list page after creating the task
        } catch (error) {
            console.error('Error creating task:', error);
            if (error.response && error.response.status === 400) {
                setError("Invalid input data. Please check the fields.");
            } else {
                setError("An error occurred while creating the task.");
            }
        }
    };

    return (
        <div className="create-task-container">
            <h2>Create New Task</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleCreateTask}>
                <div>
                    <label htmlFor="jobId">Select Job:</label>
                    <select
                        id="jobId"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        required
                    >
                        <option value="">Select a Job</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="description">Task Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="scheduledTime">Scheduled Time:</label>
                    <input
                        type="datetime-local"
                        id="scheduledTime"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
}

export default CreateTask;
