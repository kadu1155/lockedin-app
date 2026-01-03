/**
 * Generates a Google Calendar Event URL
 * @param {Object} todo - The task object
 * @returns {string} - The Google Calendar URL
 */
export function generateGoogleCalendarUrl(todo) {
    const title = encodeURIComponent(todo.text);
    const details = encodeURIComponent(`Category: ${todo.category}`);

    // Default to current time if no reminder, or parse reminder time
    // If no reminder is set, create a 1-hour event starting now
    let startDate, endDate;

    if (todo.reminderTime) {
        startDate = new Date(todo.reminderTime);
    } else {
        startDate = new Date();
    }

    // End time = start time + 1 hour
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    // Format to YYYYMMDDTHHmmssZ (UTC)
    const formatTime = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const start = formatTime(startDate);
    const end = formatTime(endDate);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
}
