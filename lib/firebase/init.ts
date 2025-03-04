// app/lib/firebase/init.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics'; // Optional, for analytics

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAyNSXEQyE6YF8sh3SvjwkHG5dld9BqT84",
  authDomain: "careervision-d2e55.firebaseapp.com",
  projectId: "careervision-d2e55",
  storageBucket: "careervision-d2e55.firebasestorage.app",
  messagingSenderId: "579528681945",
  appId: "1:579528681945:web:c3a7a1fe89d3f3a4e791c8",
  measurementId: "G-GM19HMN9JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize Analytics (if you're using it)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };