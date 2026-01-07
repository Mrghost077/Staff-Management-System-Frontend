import axios from 'axios'

const getNodeEnv = (key) =>
    typeof globalThis !== 'undefined' && globalThis.process?.env ? globalThis.process.env[key] : undefined

const API_BASE_URL =
    (import.meta.env?.VITE_API_BASE_URL ||
        import.meta.env?.REACT_APP_API_BASE_URL ||
        getNodeEnv('REACT_APP_API_BASE_URL') ||
        'http://localhost:3301') + '/api'

// Sample data for fallback
const sampleLeaves = [
    {
        _id: '1',
        teacher: { name: 'John Smith', initials: 'JS', subject: 'Mathematics' },
        type: 'Medical Leave',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Medical procedure and recovery',
        status: 'Pending',
        documents: 'View (1)'
    },
    {
        _id: '2',
        teacher: { name: 'Emily Davis', initials: 'ED', subject: 'English' },
        type: 'Personal Leave',
        startDate: '2024-01-25',
        endDate: '2024-01-25',
        days: 1,
        reason: 'Family commitment',
        status: 'Approved',
        documents: 'None'
    },
    {
        _id: '3',
        teacher: { name: 'Michael Johnson', initials: 'MJ', subject: 'Science' },
        type: 'Emergency Leave',
        startDate: '2024-01-18',
        endDate: '2024-01-19',
        days: 2,
        reason: 'Family emergency - urgent travel',
        status: 'Approved',
        documents: 'None'
    }
]

const sampleStats = {
    pendingRequests: 7,
    approvedToday: 3,
    rejectedToday: 0,
    averageResponse: 1.5
}

const withApi = async (requestFn, fallback) => {
    try {
        const { data } = await requestFn()
        return data?.data || fallback
    } catch (error) {
        console.warn('API error, using sample data:', error.message)
        return fallback
    }
}

export const fetchAllLeaves = async () =>
    withApi(
        () => axios.get(`${API_BASE_URL}/leave/all`, { withCredentials: true }),
        sampleLeaves
    )

export const fetchLeaveStats = async () =>
    withApi(
        () => axios.get(`${API_BASE_URL}/leave/stats`, { withCredentials: true }),
        sampleStats
    )

export const updateLeaveStatus = async (id, status) =>
    withApi(
        () => axios.put(`${API_BASE_URL}/leave/update/${id}`, { status }, { withCredentials: true }),
        { success: true }
    )
