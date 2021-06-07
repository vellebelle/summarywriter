import firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEQKsM697Ezh7__Z3kg7ggdWZSGyH39V4",
  authDomain: "summary-writer.firebaseapp.com",
  projectId: "summary-writer",
  storageBucket: "summary-writer.appspot.com",
  messagingSenderId: "327788918901",
  appId: "1:327788918901:web:0602a0eb3634c1204ce03c"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();