import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyAFGAUQOFxygF20GokNfwP_oKc_chG5SDc",
authDomain: "advanced-intership.firebaseapp.com",
projectId: "advanced-intership",
storageBucket: "advanced-intership.firebasestorage.app",
messagingSenderId: "497136065100",
appId: "1:497136065100:web:cf41621bb94d7e080e72e9"

};

// Initialize Firebase without duplicating apps during hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut
};
