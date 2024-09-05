import axios from 'axios';
import { BASE_URL } from './api';
import { get,post } from './api'; 

export const postJob = async (jobData, token) => {
  try {
    const response = await post('/jobs/create/', jobData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error posting job';
  }
};

export const searchJobs = async (query, token) => {
  try {
    const response = await get('/jobs/search/', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: { search: query }, // Ensure you're using the correct parameter for your API
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred while fetching job data');
  }
};

export const fetchApplications = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/applications/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getAllJobs = async (token) => {
  try {
    const response = await get('/jobs/search', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred while fetching jobs');
  }
};