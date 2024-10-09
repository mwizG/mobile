import axios from "axios";
import { BASE_URL } from "./api";
import { get, post } from "./api";

export const postJob = async (jobData, token) => {
  try {
    const response = await post("/jobs/create/", jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Error posting job";
  }
};

export const searchJobs = async (query, token) => {
  try {
    const response = await get("/jobs/search/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { search: query }, // Ensure you're using the correct parameter for your API
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching job data");
  }
};

export const fetchApplications = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/applications/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getAllJobs = async (token) => {
  try {
    const response = await get("/jobs/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching jobs");
  }
};

export const fetchJobs = async (token,fetchAll=false) => {
  try {
    if (!token) {
      throw new Error("No access token found.");
    }
    const endpoint = fetchAll
      ? "/jobs/all-jobs/" // Fetch all jobs
      : "/jobs/open-jobs/";

    const response = await get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error: ", error.response)
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching jobs");
  } 
};
