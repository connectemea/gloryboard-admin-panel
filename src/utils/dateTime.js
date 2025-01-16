export const convertToDateTime = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short', 
      timeStyle: 'short',  // "4:30 AM"
      timeZone: 'UTC',     // Optional: Use the correct time zone
    }).format(date);
};