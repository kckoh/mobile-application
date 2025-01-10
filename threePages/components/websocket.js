import React, { useEffect, useRef } from 'react';
import { JP_WEB_SOCKET_URL } from '../fixedData/env';

let globalSocketRef = null;

export const setGlobalSocketRef = (socketRef) => {
    globalSocketRef = socketRef;
};

export function getGlobalSocketRef() {
    return globalSocketRef;
}

export const WebSocketComponent = (setTranscription) => {
  // useRef for the actual WebSocket instance
  const socketRef = useRef(null);

  // useRef to track whether we should keep reconnecting
  const reconnectRef = useRef(true);

  const connect = () => {
    // If there's already a socket, close it (prevent duplicates)
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Create a new WebSocket instance
    socketRef.current = new WebSocket(JP_WEB_SOCKET_URL);

    // Assign event handlers
    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data).transcript;
      setTranscription(newMessage);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      // // Attempt reconnect if allowed
      // if (!reconnectRef.current) {
      //   console.log('Attempting to reconnect in 3 seconds...');
      //   setTimeout(() => {
      //     connect(); 
      //   }, 3000);
      // }
    };
  };

  useEffect(() => {
    connect();
    setGlobalSocketRef(socketRef);
    // Cleanup: on unmount, stop reconnect attempts and close the socket
    return () => {
      reconnectRef.current = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
};

// Helper function to read audio as ArrayBuffer
const readAudioFileAsArrayBuffer = async (fileUri) => {
  try {
    const audio = await fetch(fileUri);
    const arrayBuffer = await audio.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.error('Failed to read audio file:', error);
  }
};

export const sendAudio = async (fileUri) => {
  if (!globalSocketRef || !globalSocketRef.current) {
    console.error('No WebSocket connection to send audio. Make sure the component is mounted.');
    return;
  }

  console.log('Sending audio via WebSocket:');
  try {
    const arrayBuffer = await readAudioFileAsArrayBuffer(fileUri);
    globalSocketRef.current.send(arrayBuffer);
  } catch (error) {
    console.error('Failed to send audio via websocket:', error);
  }
};

export default { WebSocketComponent, sendAudio, setGlobalSocketRef, getGlobalSocketRef };
