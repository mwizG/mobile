// src/services/AdminService.js
import axios from 'axios';

const API_URL = 'api/admin'; // Update this with your actual API base URL

// Support Ticket Management
export const getSupportTickets = async () => {
    const response = await axios.get(`${API_URL}/tickets/`);
    return response.data;
};

export const createSupportTicket = async (issue) => {
    const response = await axios.post(`${API_URL}/tickets/`, { issue });
    return response.data;
};

export const updateSupportTicket = async (ticketId, status) => {
    const response = await axios.patch(`${API_URL}/ticket/${ticketId}/update/`, { status });
    return response.data;
};

// Dispute Management
export const getDisputes = async () => {
    const response = await axios.get(`${API_URL}/disputes/`);
    return response.data;
};

export const createDispute = async (againstUser, job, description) => {
    const response = await axios.post(`${API_URL}/disputes/`, { against_user: againstUser, job, description });
    return response.data;
};

export const updateDispute = async (disputeId, status, resolution) => {
    const response = await axios.patch(`${API_URL}/disputes/${disputeId}/`, { status, resolution });
    return response.data;
};

// Content Moderation
export const getModerationActions = async () => {
    const response = await axios.get(`${API_URL}/moderation-actions/`);
    return response.data;
};

export const createModerationAction = async (actionType, job, reason) => {
    const response = await axios.post(`${API_URL}/moderation-actions/`, { action_type: actionType, job, reason });
    return response.data;
};

export const updateModerationAction = async (actionId, actionType, reason) => {
    const response = await axios.patch(`${API_URL}/moderation-actions/${actionId}/`, { action_type: actionType, reason });
    return response.data;
};

// User Management
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
};

export const toggleUserActiveStatus = async (userId, isActive) => {
    const response = await axios.patch(`${API_URL}/user/${userId}/toggle-active/`);
    return response.data;
};

// Payment Management
export const updatePaymentStatus = async (paymentId, status) => {
    const response = await axios.patch(`${API_URL}/payment/${paymentId}/update-status/`, { status });
    return response.data;
};

// Analytics
export const getAnalytics = async () => {
    const response = await axios.get(`${API_URL}/analytics/`);
    return response.data;
};

// User Activity Tracking
export const getUserActivities = async () => {
    const response = await axios.get(`${API_URL}/user-activities/`);
    return response.data;
};
