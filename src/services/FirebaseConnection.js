
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


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
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const authenticate = getAuth(firebaseApp);

export { db, authenticate };

