import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Typography, Container } from '@mui/material';

const localizer = momentLocalizer(moment);

function CaregiverSchedule() {
    const [jobs, setJobs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch scheduled jobs
        const fetchScheduledJobs = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Retrieve the access token
                const response = await axios.get('http://192.168.251.86:8000/api/jobs/scheduled/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                });
                setJobs(response.data); // Set the jobs data
            } catch (error) {
                console.error('Error fetching scheduled jobs:', error);
                setError('Failed to load scheduled jobs. Please try again.');
            }
        };

        fetchScheduledJobs();
    }, []);

    useEffect(() => {
        // Fetch tasks
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Retrieve the access token
                const response = await axios.get('http://192.168.251.86:8000/api/jobs/tasks/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                });
                setTasks(response.data); // Set the tasks data
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to load tasks. Please try again.');
            }
        };

        fetchTasks();
    }, []);

    // Format jobs to be used in the calendar component
    const events = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        start: new Date(job.scheduled_time), // Use job's scheduled time as the event start
        end: new Date(moment(job.scheduled_time).add(1, 'hours')), // Add 1 hour as default event duration
        location: job.location,
        description: job.description,
        payRate: job.pay_rate,
        status: job.status,
        isJob: true, // Mark as job
    }));

    // Format tasks to include the main job title and status
    const taskEvents = tasks.map((task) => {
        const relatedJob = task.job ? jobs.find(job => job.id === task.job.id) : null;

        return {
            id: task.id,
            title: relatedJob ? `${task.description} (Job: ${relatedJob.title})` : task.description,
            start: new Date(task.scheduled_time),
            end: new Date(task.end_time || moment(task.scheduled_time).add(1, 'hours').toDate()), // Use task's end time or add 1 hour
            isTask: true,
            status: task.status,
        };
    });

    // Combine jobs and tasks into a single events array
    const combinedEvents = [...events, ...taskEvents];

    const eventStyleGetter = (event) => {
        let backgroundColor = '#76c7c0'; // Default color for jobs
        let textDecoration = 'none'; // Default text decoration
    
        // Styling for jobs
        if (event.isJob) {
            if (event.status && event.status.toLowerCase() === 'completed') { 
                backgroundColor = '#a5d6a7'; // Light green color for completed jobs
                textDecoration = 'line-through'; // Line-through for completed jobs
            } else {
                backgroundColor = '#1A43BF'; // Default color for ongoing jobs
            }
        }
    
        // Styling for tasks
        if (event.isTask) {
            if (event.status && event.status.toLowerCase() === 'deleted') { 
                backgroundColor = '#d3d3d3'; // Grey out deleted tasks
                textDecoration = 'line-through'; // Line-through for deleted tasks
            } else if (event.status && event.status.toLowerCase() === 'completed') { 
                backgroundColor = '#ffcccc'; // Light red color for completed tasks
                textDecoration = 'line-through'; // Line-through for completed tasks
            } else {
                backgroundColor = '#ffab40'; // Color for ongoing tasks
            }
        }
    
        return {
            style: {
                backgroundColor,
                color: '#ffffff',
                textDecoration,
                border: '1px solid #ffffff', // Adding a border to distinguish events
                borderRadius: '5px', // Slightly rounded corners for a modern look
            },
        };
    };

    const handleSelectEvent = (event) => {
        if (event.isTask) {
            alert(`Task: ${event.title}\nScheduled Time: ${moment(event.start).format('MMMM Do YYYY, h:mm:ss a')}\nEnd Time: ${moment(event.end).format('MMMM Do YYYY, h:mm:ss a')}\nStatus: ${event.status}`);
        } else {
            alert(`Job: ${event.title}\nLocation: ${event.location}\nDescription: ${event.description}\nPay Rate: ${event.payRate}\nStatus: ${event.status}`);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: '20px' }}>
                Manage Your Schedule
            </Typography>
            {error && <Typography color="error">{error}</Typography>} {/* Display error messages if any */}
            <div style={{ height: '80vh', padding: '20px' }}>
                <Calendar
                    localizer={localizer}
                    events={combinedEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    components={{
                        event: ({ event }) => (
                            <span>
                                <strong>{event.title}</strong>
                                <br />
                                {event.isTask ? (
                                    <span>Task Scheduled<br />Status: {event.status}</span> // Display task status
                                ) : (
                                    <>
                                        <span>{event.description}</span>
                                        <br />
                                        <span>Status: {event.status}</span>
                                    </>
                                )}
                            </span>
                        ),
                    }}
                />
            </div>
        </Container>
    );
}

export default CaregiverSchedule;
