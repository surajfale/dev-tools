import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const convertTimestamp = (input) => {
  try {
    if (!input || !input.toString().trim()) {
      return { success: false, error: 'Input is empty' };
    }

    const cleanInput = input.toString().trim();
    let timestamp;
    let inputType;

    // Detect input type and parse
    if (/^\d{10}$/.test(cleanInput)) {
      // Unix seconds
      timestamp = dayjs.unix(parseInt(cleanInput));
      inputType = 'unix_seconds';
    } else if (/^\d{13}$/.test(cleanInput)) {
      // Unix milliseconds
      timestamp = dayjs(parseInt(cleanInput));
      inputType = 'unix_milliseconds';
    } else {
      // ISO string or other date format
      timestamp = dayjs(cleanInput);
      inputType = 'iso_string';
    }

    if (!timestamp.isValid()) {
      return { success: false, error: 'Invalid timestamp format' };
    }

    return {
      success: true,
      result: {
        inputType,
        unixSeconds: timestamp.unix(),
        unixMilliseconds: timestamp.valueOf(),
        iso8601: timestamp.toISOString(),
        localTime: timestamp.format('YYYY-MM-DD HH:mm:ss'),
        utcTime: timestamp.utc().format('YYYY-MM-DD HH:mm:ss'),
        relativeTime: timestamp.fromNow(),
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: `Time conversion error: ${error.message}` 
    };
  }
};

export const getCurrentTimestamp = () => {
  const now = dayjs();
  return {
    unixSeconds: now.unix(),
    unixMilliseconds: now.valueOf(),
    iso8601: now.toISOString(),
    localTime: now.format('YYYY-MM-DD HH:mm:ss'),
    utcTime: now.utc().format('YYYY-MM-DD HH:mm:ss'),
  };
};