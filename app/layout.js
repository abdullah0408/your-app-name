import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AuthProvider>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {children}
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}