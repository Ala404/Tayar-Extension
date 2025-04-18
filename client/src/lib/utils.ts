import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const timeStamp = new Date(date);
  
  const secondsAgo = Math.floor((now.getTime() - timeStamp.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return "just now";
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  }
  
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo} week${weeksAgo === 1 ? '' : 's'} ago`;
  }
  
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago`;
  }
  
  const yearsAgo = Math.floor(daysAgo / 365);
  return `${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago`;
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function getTagColor(color: string): {bg: string, text: string} {
  return {
    bg: `bg-[${color}] bg-opacity-90`,
    text: 'text-white'
  };
}

export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get the text content
  const plainText = temp.textContent || temp.innerText || '';
  
  // Return cleaned text
  return plainText.trim();
}
