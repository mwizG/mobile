import React, { useState } from 'react';
import axios from 'axios';

function JobPostingForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [payRate, setPayRate] = useState('');
    const [proposedTime, setProposedTime] = useState('');

    // List of job types (matching what you have in Django's choices)
    const jobTypes = [
        'Respite Care',
        'Home Care',
        'Senior Care',
        'Child Care',
        'Disability Care',
        'Palliative Care',
        'Post-Surgical Care',
        'Maternity Care',
        'Dementia Care',
    ];

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/api/jobs/create/', {
                title,
                description,
                location,
                job_type: jobType,  // Pass the selected job type
                pay_rate: payRate,
                proposed_time: proposedTime,
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
                
                {/* Dropdown for Job Type */}
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Job Type</option>
                    {jobTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                
                <input
                    type="number"
                    placeholder="Pay Rate"
                    value={payRate}
                    onChange={(e) => setPayRate(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="Proposed Time"
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                />
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
}

export default JobPostingForm;
