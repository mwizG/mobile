import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/admin_panel'; // Update this with your actual API base URL

// Function to get the authentication token
const getAuthToken = () => {
    const token = localStorage.getItem('accessToken'); 
    return token ? token.replace(/"/g, '') : null;
};

// Configure axios instance for API calls
const apiClient = axios.create({
    baseURL: API_URL,
});

// Intercept requests to add the authorization header
apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Token ${token}`; // Use "Token" prefix
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Support Ticket Management
export const getSupportTickets = async () => {
    try {
        const response = await apiClient.get('/tickets/');
        return response.data;
    } catch (error) {
        console.error('Error fetching support tickets:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createSupportTicket = async (issue) => {
    try {
        const response = await apiClient.post('/tickets/', { issue });
        return response.data;
    } catch (error) {
        console.error('Error creating support ticket:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateSupportTicket = async (ticketId, status) => {
    try {
        const response = await apiClient.patch(`/ticket/${ticketId}/update/`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating support ticket:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Dispute Management
export const getDisputes = async () => {
    try {
        const response = await apiClient.get('/disputes/');
        return response.data;
    } catch (error) {
        console.error('Error fetching disputes:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createDispute = async (againstUser, job, description) => {
    try {
        const response = await apiClient.post('/disputes/', { against_user: againstUser, job, description });
        return response.data;
    } catch (error) {
        console.error('Error creating dispute:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateDispute = async (disputeId, status, resolution) => {
    try {
        const response = await apiClient.patch(`/disputes/${disputeId}/`, { status, resolution });
        return response.data;
    } catch (error) {
        console.error('Error updating dispute:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Content Moderation
export const getModerationActions = async () => {
    try {
        const response = await apiClient.get('/moderation-actions/');
        return response.data;
    } catch (error) {
        console.error('Error fetching moderation actions:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createModerationAction = async (actionType, job, reason) => {
    try {
        const response = await apiClient.post('/moderation-actions/', { action_type: actionType, job, reason });
        return response.data;
    } catch (error) {
        console.error('Error creating moderation action:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateModerationAction = async (actionId, actionType, reason) => {
    try {
        const response = await apiClient.patch(`/moderation-actions/${actionId}/`, { action_type: actionType, reason });
        return response.data;
    } catch (error) {
        console.error('Error updating moderation action:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// User Management
export const getUsers = async () => {
    try {
        const response = await apiClient.get('/users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const toggleUserActiveStatus = async (userId, isActive) => {
    try {
        const response = await apiClient.patch(`/user/${userId}/toggle-active/`);
        return response.data;
    } catch (error) {
        console.error('Error toggling user status:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Payment Management
export const updatePaymentStatus = async (paymentId, status) => {
    try {
        const response = await apiClient.patch(`/payment/${paymentId}/update-status/`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating payment status:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Analytics
export const getAnalytics = async () => {
    try {
        const response = await apiClient.get('/analytics/');
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// User Activity Tracking
export const getUserActivities = async () => {
    try {
        const response = await apiClient.get('/user-activities/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user activities:', error.response ? error.response.data : error.message);
        throw error;
    }
};
