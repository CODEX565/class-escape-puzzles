import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC2vrUtoauwvFp6ZVaykbiIYbVpBZfhEgk",
  authDomain: "brainbuzz-528c1.firebaseapp.com",
  projectId: "brainbuzz-528c1",
  storageBucket: "brainbuzz-528c1.firebasestorage.app",
  messagingSenderId: "209056853001",
  appId: "1:209056853001:web:025b85c134fd88ea5a9cd8",
  measurementId: "G-3L24H3KKSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;