import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CaregiverJobSearch() {
    const [location, setLocation] = useState('');
    const [careType, setCareType] = useState('');
    const [payRate, setPayRate] = useState('');
    const [jobs, setJobs] = useState([]);

    const fetchJobs = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/jobs/search', {
                headers: {
                    Authorization: `Token ${token}`,
                },
                params: {
                    location,
                    care_type: careType,
                    pay_rate: payRate,
                },
            });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs', error);
        }
    }, [location, careType, payRate]);

    useEffect(() => {
        fetchJobs();
    }, [location, careType, payRate, fetchJobs]);

    return (
        <div>
            <h2>Search for Jobs</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Care Type"
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Pay Rate"
                    value={payRate}
                    onChange={(e) => setPayRate(e.target.value)}
                />
                <button type="button" onClick={fetchJobs}>Search</button>
            </form>

            <div>
                <h3>Available Jobs</h3>
                <ul>
                    {jobs.map((job) => (
                        <li key={job.id}>
                            <strong>
                            <Link to={`/caregiver/jobs/${job.id}`}>
                                    {job.title}
                                </Link>
                            </strong> 
                            - {job.location} - ${job.pay_rate}/hr
                            <p>{job.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CaregiverJobSearch;
