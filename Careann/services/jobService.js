import axios from 'axios';
import { BASE_URL } from './api';

export const postJob = async (jobData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs/post/`, jobData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchJobs = async (query, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/search/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: { query },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
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
