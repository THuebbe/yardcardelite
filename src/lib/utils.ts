import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs Class names to combine
 * @returns Combined class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number to (xxx) xxx-xxxx format
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return "";

  // Strip all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if we have a 10-digit number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }

  // If not 10 digits, return the original input
  return phone;
};

/**
 * Formats a phone number input as the user types
 * @param value The current input value
 * @returns Formatted phone number for display
 */
export const formatPhoneNumberInput = (value: string): string => {
  // Strip all non-numeric characters
  const cleaned = value.replace(/\D/g, "");

  // Format based on the length of the input
  if (cleaned.length === 0) {
    return "";
  } else if (cleaned.length <= 3) {
    return `(${cleaned}`;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
};
