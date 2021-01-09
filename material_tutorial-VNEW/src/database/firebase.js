import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDwVMrPBJNkPg29fl7F41mUpySPQBfx010",
  authDomain: "dvgreacttodo.firebaseapp.com",
  databaseURL: "https://dvgreacttodo.firebaseio.com",
  projectId: "dvgreacttodo",
  storageBucket: "dvgreacttodo.appspot.com",
  messagingSenderId: "512833604297",
  appId: "1:512833604297:web:00ed8408c0498b104edb18",
});

export const auth = app.auth();
export const db = app.firestore();
export default app;
