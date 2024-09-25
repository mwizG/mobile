// src/components/Jobs/JobPostingForm.js
import React, { useState } from 'react';
import axios from 'axios';

function JobPostingForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [payRate, setPayRate] = useState('');
    const [proposedTime, setProposedTime] = useState(''); // Changed to proposedTime

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/api/jobs/create/', {
                title,
                description,
                location,
                job_type: jobType,
                pay_rate: payRate,
                proposed_time: proposedTime, // Changed to proposed_time
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            alert('Job posted successfully!');
        } catch (error) {
            console.error('Error posting job', error);
        }
    };

    return (
        <div>
            <h2>Post a Job</h2>
            <form onSubmit={handlePostJob}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Job Type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Pay Rate"
                    value={payRate}
                    onChange={(e) => setPayRate(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="Proposed Time"
                    value={proposedTime} // Changed to proposedTime
                    onChange={(e) => setProposedTime(e.target.value)} // Changed to proposedTime
                />
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
}

export default JobPostingForm;
