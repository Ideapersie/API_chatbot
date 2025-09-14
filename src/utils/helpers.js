import { UI_CONSTANTS } from './constants';

export const formatTimestamp = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const truncateMessage = (message, maxLength = UI_CONSTANTS.MAX_MESSAGE_LENGTH) => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};

export const debounce = (func, delay = UI_CONSTANTS.DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/\s+/g, ' ');
};

export const isValidMessage = (message) => {
  return message &&
         typeof message === 'string' &&
         message.trim().length > 0 &&
         message.length <= UI_CONSTANTS.MAX_MESSAGE_LENGTH;
};

export const parseStreamChunk = (chunk) => {
  try {
    const lines = chunk.split('\n');
    const dataLines = lines.filter(line => line.startsWith('data: '));

    return dataLines.map(line => {
      const data = line.substring(6);
      if (data === '[DONE]') return null;
      return JSON.parse(data);
    }).filter(Boolean);
  } catch (error) {
    console.error('Error parsing stream chunk:', error);
    return [];
  }
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};