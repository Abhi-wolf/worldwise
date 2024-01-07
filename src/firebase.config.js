// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtSBVubWpH04TLVudTymVIPf01pe8g6vo",
  authDomain: "worldwise-b8f2c.firebaseapp.com",
  projectId: "worldwise-b8f2c",
  storageBucket: "worldwise-b8f2c.appspot.com",
  messagingSenderId: "1094094338224",
  appId: "1:1094094338224:web:771f04a8173db2762fa375",
  measurementId: "G-TBW4T7DF72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth };