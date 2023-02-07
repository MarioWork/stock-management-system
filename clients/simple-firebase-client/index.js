import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import promptSync from "prompt-sync";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const UserType = {
  e: "employee",
  a: "admin",
};

const users = {
  employee: {
    email: "mariovieira.work+employee@hotmail.com",
    password: "mario12345",
  },
  admin: {
    email: "mariovieira.work+admin@hotmail.com",
    password: "mario12345",
  },
};

initializeApp(firebaseConfig);
const auth = getAuth();
const prompt = promptSync({ eot: true });

const promptUser = () => {
  let promptedUserType = "";

  while (
    !Object.keys(UserType).includes(promptedUserType?.toLocaleLowerCase())
  ) {
    promptedUserType = prompt(
      "Enter 'E' for Employee && 'A' for Admin 'ctrl + D' to exit -> "
    );
  }
  console.log(users[UserType[promptedUserType]]);
  return users[UserType[promptedUserType]];
};

const authenticate = async (user) => {
  await signInWithEmailAndPassword(auth, user.email, user.password);
};

const logout = async () => await signOut(auth);

const getUserToken = async () => await auth.currentUser.getIdToken(true);

const start = async () => {
  const user = await promptUser();
  await authenticate(user);

  const token = await getUserToken();

  console.log("\ntoken => " + token);

  await logout();
  console.log("\n\n logged out");
};

start();
