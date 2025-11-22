/**
 * Date and time formatting utilities
 */

/**
 * Format a date to a readable time string (e.g., "3:45 PM")
 */
export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Format a date to show "Today, Mon Day" if it's today, otherwise null
 */
export function formatDate(date: Date): string | null {
  const today = new Date();
  const messageDate = new Date(date);
  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear();

  if (isToday) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `Today, ${
      months[messageDate.getMonth()]
    } ${messageDate.getDate()}`;
  }
  return null;
}

