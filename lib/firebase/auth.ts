// app/lib/firebase/auth.ts
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from './init'; // Import the initialized Firebase app

const auth = getAuth(app);

// Function to send a sign-in link (OTP) to the user's email
export const sendEmailLink = async (email: string) => {
  const actionCodeSettings = {
    url: 'http://localhost:3000/finishSignUp', // Replace with your actual frontend URL
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Store the email locally for verification on the same device
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailForSignIn', email);
    }
    return { success: true, message: 'Sign-in link sent to your email!' };
  } catch (error) {
    throw new Error(error.message || 'Failed to send sign-in link');
  }
};

// Function to verify the email link and sign in the user
export const verifyEmailLink = async (email: string, link: string) => {
  try {
    if (isSignInWithEmailLink(auth, link)) {
      const result = await signInWithEmailLink(auth, email, link);
      // Clear the stored email after successful sign-in
      if (typeof window !== 'undefined') {
        localStorage.removeItem('emailForSignIn');
      }
      return { success: true, user: result.user };
    }
    throw new Error('Invalid or expired sign-in link');
  } catch (error) {
    throw new Error(error.message || 'Failed to verify sign-in link');
  }
};