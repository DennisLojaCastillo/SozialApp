import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGVFuqh-t-1ZztVnEY-zmLqznLaQ-gScQ",
  authDomain: "sozial-f1f9c.firebaseapp.com",
  projectId: "sozial-f1f9c",
  storageBucket: "sozial-f1f9c.appspot.com",
  messagingSenderId: "683239254535",
  appId: "1:683239254535:web:1828daf92df1dc625cd8a2"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
