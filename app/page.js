"use client";

import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { userDetails } = useAuth();
  console.log(userDetails);
  return (
    <div>
      {userDetails ? (
        <div>
          <h2>Welcome, {userDetails.email}</h2>
          {userDetails.isSubscribed ? (
            <p>Thank you for subscribing!</p>
          ) : (
            <p>Not Subscribed</p>
          )}
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}