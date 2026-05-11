import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
});

export const fetchStates = () => API.get('/states');
export const fetchStateById = (id) => API.get(`/states/${id}`);
export const fetchPlacesByState = (stateId) => API.get(`/places?state=${stateId}`);
export const fetchPlacesByCategory = (category) => API.get(`/places?category=${category}`);
export const searchStates = (query) => API.get(`/states?search=${query}`);

export default API;