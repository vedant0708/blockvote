// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration 
const firebaseConfig = { 
  apiKey: "AIzaSyDCMY2uWer49I2Uk8BbGSb_KURScEOOkrU", 
  authDomain: "blockvote-e0454.firebaseapp.com", 
  projectId: "blockvote-e0454", 
  storageBucket: "blockvote-e0454.firebasestorage.app", 
  messagingSenderId: "194058281837", 
  appId: "1:194058281837:web:7f3294954ada025b17f064", 
  measurementId: "G-15JTPLCQYC" 
}; 
 
// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
// Analytics disabled to prevent network ERR_ABORTED errors in restricted environments
const analytics = null;
const auth = getAuth(app);

export { auth, analytics };
export default app;
