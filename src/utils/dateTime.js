export const convertToDateTime = (isoString) => {
  try {
    const date = new Date(isoString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short', // "4:30 AM"
      timeZone: 'UTC',    // Optional: Use the correct time zone
    }).format(date);
  } catch (error) {
    console.error("Invalid date input:", error.message);
    return "-";
  }
};
