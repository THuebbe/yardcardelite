/**
 * User Management Utilities
 *
 * This file contains utility functions for managing users in the application.
 * Currently, it simulates user creation with dummy data for development purposes.
 */

// Define the user data structure based on the signup form
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Simulates creating a new user with the provided data
 * @param userData The user data from the signup form
 * @returns A promise that resolves to the created user object
 */
export async function createUser(
  userData: UserData,
): Promise<UserData & { id: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real implementation, this would call an API or service
  // For now, we just return the data with a fake ID
  return {
    ...userData,
    id: `user_${Math.random().toString(36).substring(2, 11)}`,
  };
}

/**
 * Simulates fetching a list of users
 * @returns A promise that resolves to an array of user objects
 */
export async function getUsers(): Promise<Array<UserData & { id: string }>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return dummy user data
  return [
    {
      id: "user_abc123",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "********", // Passwords would never be returned in a real API
    },
    {
      id: "user_def456",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: "********",
    },
    {
      id: "user_ghi789",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex@example.com",
      password: "********",
    },
  ];
}
