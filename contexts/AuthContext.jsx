"use client";

import React, { createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserDetails } from "@/lib/userDetails";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (isLoaded && isSignedIn && user) {
          const fetchedUserDetails = await getUserDetails(user.id);
          setUserDetails(fetchedUserDetails);
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      }
    };

    fetchUserDetails();
  }, [isSignedIn, user, isLoaded]);

  return (
    <AuthContext.Provider value={{ userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
