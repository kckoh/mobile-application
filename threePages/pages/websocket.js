import { useEffect } from 'react';
import {JP_WEB_SOCKET_URL} from './env';

const WebSocketComponent = () => {
    useEffect(() => {
        const socket = new WebSocket(JP_WEB_SOCKET_URL);

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            const newMessage = event.data;
            console.log('New message: ', newMessage);
            
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, []);
};

export default WebSocketComponent;