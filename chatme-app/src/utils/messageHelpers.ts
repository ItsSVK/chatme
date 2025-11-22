/**
 * Message display helper functions
 */

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * Determine if date separator should be shown for a message
 */
export function shouldShowDate(
  currentMsg: Message,
  previousMsg: Message | null,
): boolean {
  if (!previousMsg) return true;
  const currentDate = new Date(currentMsg.timestamp);
  const previousDate = new Date(previousMsg.timestamp);
  return (
    currentDate.getDate() !== previousDate.getDate() ||
    currentDate.getMonth() !== previousDate.getMonth() ||
    currentDate.getFullYear() !== previousDate.getFullYear()
  );
}

/**
 * Determine if timestamp should be shown for a message
 */
export function shouldShowTimestamp(
  currentMsg: Message,
  nextMsg: Message | null,
): boolean {
  if (!nextMsg) return true;
  const currentDate = new Date(currentMsg.timestamp);
  const nextDate = new Date(nextMsg.timestamp);
  const timeDiff = Math.abs(nextDate.getTime() - currentDate.getTime());
  return timeDiff > 5 * 60 * 1000 || currentMsg.isUser !== nextMsg.isUser;
}
