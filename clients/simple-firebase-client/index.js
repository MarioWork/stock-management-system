import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

initializeApp(firebaseConfig);
const auth = getAuth();

const authenticate = async () => {
  await signInWithEmailAndPassword(
    auth,
    "filipe_mario15@hotmail.com",
    "mario123"
  );
};

const logout = async () => await signOut(auth);

const getUserToken = async () => await auth.currentUser.getIdToken(true);

const start = async () => {
  await authenticate();

  const token = await getUserToken();

  console.log("token => " + token);

  await logout();
  console.log("\n\n logged out");
};

start();
