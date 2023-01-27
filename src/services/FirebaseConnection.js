import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyALISfHFOI31pv3hnL4oVFQER2Fa3bCBx0",
  authDomain: "filewarehouse-70d8f.firebaseapp.com",
  projectId: "filewarehouse-70d8f",
  storageBucket: "filewarehouse-70d8f.appspot.com",
  messagingSenderId: "122562991771",
  appId: "1:122562991771:web:0fcba291f944c7bf13183e",
  measurementId: "G-H6NDY1QCNB"
};

// Initialize Firebase


if (!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);


export default firebase;
