import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent, Paper, Container } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

function CaregiverSchedule() {
  const [jobs, setJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());

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
        console.log('Scheduled Jobs:', response.data); // Debugging: log fetched jobs
      } catch (error) {
        console.error('Error fetching scheduled jobs:', error);
      }
    };

    fetchScheduledJobs();
  }, []);

  // Get unique job dates to highlight on the calendar
  const jobDates = jobs.map(job => moment(job.scheduled_time).utc().startOf('day').format('YYYY-MM-DD'));

  // Filter jobs for the selected date with timezone handling
  const filteredJobs = jobs.filter((job) => {
    const jobDate = moment(job.scheduled_time);
    return jobDate.isValid() && jobDate.utc().isSame(selectedDate.utc(), 'day');
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: '20px' }}>
        Manage Your Schedule
      </Typography>
      <Grid container spacing={3}>
        {/* Calendar Picker */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateCalendar
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(moment(newDate))}
                renderDay={(day, _, pickersDayProps) => {
                  const dateString = day.format('YYYY-MM-DD');
                  const hasJob = jobDates.includes(dateString);
                  const isToday = day.isSame(moment(), 'day'); // Check if the day is today

                  // Set background color based on conditions
                  const backgroundColor = hasJob 
                    ? '#ffcc80' // Job date highlight
                    : isToday 
                      ? '#80d0ff' // Today's highlight
                      : undefined; // No highlight

                  return (
                    <div
                      style={{
                        backgroundColor,
                        borderRadius: '50%',
                        width: '36px', // Adjust width for a better fit
                        height: '36px', // Adjust height for a better fit
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '2px', // Add margin for spacing
                        position: 'relative',
                      }}
                    >
                      <Typography variant="body2" {...pickersDayProps}>
                        {day.date()}
                      </Typography>
                      {hasJob && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '2px',
                            top: '2px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '8px', // Adjust indicator size
                            height: '8px', // Adjust indicator size
                          }}
                        />
                      )}
                    </div>
                  );
                }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* Job Schedule for the Selected Date */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scheduled Jobs for {moment(selectedDate).format('MMMM Do, YYYY')}
            </Typography>
            {filteredJobs.length > 0 ? (
              <Grid container spacing={2}>
                {filteredJobs.map((job) => (
                  <Grid item xs={12} sm={6} md={4} key={job.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{job.title}</Typography>
                        <Typography variant="body2">
                          <strong>Time:</strong> {moment(job.scheduled_time).format('hh:mm A')}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Location:</strong> {job.location}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> {job.status}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Description:</strong> {job.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2">No jobs scheduled for this date.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CaregiverSchedule;
