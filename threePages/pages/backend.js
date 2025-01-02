import axios from 'axios';
import { JP_IP_URL } from './env';

export const getItems = async () => {
    try {
        const response = await axios.get(`${JP_IP_URL}items/`);
        return response.data; // Return JSON data
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};
