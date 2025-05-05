"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/lib/types";

type UserContextType = {
  userId: string | null;
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;
};

const UserContext = createContext<UserContextType>({
  userId: null,
  userEmail: null,
  isLoading: true,
  error: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check for stored user ID first
        const storedUserId = localStorage.getItem("currentUserId");

        if (storedUserId) {
          console.log("Found stored user ID in localStorage:", storedUserId);
          // For Robert, we know the email
          if (storedUserId === "97e322b1-0028-4acb-ad14-e81069a6772d") {
            setUserId(storedUserId);
            setUserEmail("robert@example.com");
            setIsLoading(false);
            return;
          }
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw new Error(`Authentication error: ${error.message}`);
        }

        if (data.session) {
          // For Robert, override with the correct ID
          if (data.session.user.email === "robert@example.com") {
            setUserId("97e322b1-0028-4acb-ad14-e81069a6772d");
            setUserEmail(data.session.user.email);
            console.log("UserContext initialized with Robert's fixed ID");
          } else {
            // Store the user ID and email in state
            setUserId(data.session.user.id);
            setUserEmail(data.session.user.email);
            console.log(
              "UserContext initialized with ID:",
              data.session.user.id,
            );
          }
        } else {
          console.log("No active session found in UserContext");
          setUserId(null);
          setUserEmail(null);
        }
      } catch (err: any) {
        console.error("Error in UserContext:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Set up auth state change listener
    const { data: authListener } = createClient().auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          console.log("Auth state changed, new user ID:", session.user.id);
        } else {
          setUserId(null);
          setUserEmail(null);
          console.log("Auth state changed, user signed out");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userId, userEmail, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
