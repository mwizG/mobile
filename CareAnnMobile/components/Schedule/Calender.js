// src/components/Schedule/Calendar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CaregiverCalendar() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://your-backend-api-url/api/schedule/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setSchedule(response.data);
            } catch (error) {
                console.error('Error fetching schedule', error);
            }
        };

        fetchSchedule();
    }, []);

    const onDateClick = (date) => {
        // Logic to handle date click and display tasks
    };

    return (
        <div className="calendar-container">
            <h2>Your Schedule</h2>
            <Calendar
                onClickDay={onDateClick}
                tileContent={({ date, view }) =>
                    view === 'month' &&
                    schedule.find((item) => new Date(item.date).toDateString() === date.toDateString()) ? (
                        <span className="dot"></span>
                    ) : null
                }
            />
        </div>
    );
}

export default CaregiverCalendar;
